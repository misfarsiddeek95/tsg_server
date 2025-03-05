import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * function to create tutor accounts
 * @param tsp_id
 * @param username
 * @param fname
 * @param lname
 * @param tutor_level
 */
export async function createTutor(
  tsp_id: number,
  username: string,
  fname: string,
  lname: string,
  tutor_level: number = 3
) {
  let level = 2;
  let email = username;
  let password = '$2a$10$qHXb0Ar.lNve9IuxGJXnMO0ded3p3Z.tFgKmI77XutMDrhpj2rk86'; //pw = b
  let query = '';
  var now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var nowDate = new Date().toISOString().slice(0, 10).replace('T', ' ');

  query = `
    INSERT INTO user (tsp_id, username, password, level) VALUES('${tsp_id}', '${username}', '${password}', ${level});
    `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO approved_contact_data  
    (tsp_id,personal_email,work_email,mobile_number,landline_number,residing_address_l1,residing_address_l2,residing_city,residing_district,residing_province,residing_country,same_residing_permanent,permanent_address_l1,permanent_address_l2,permanent_city,permanent_district,permanent_province,permanent_country,emg_contact_name,emg_relationship,emg_contact_num,approved_by,approved_at) VALUES 
    ('${tsp_id}','${email}','${email}','+94123456789',NULL,NULL,NULL,NULL,'Galle',NULL,'Sri Lanka',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-16 13:06:36.073');
    `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO approved_personal_data 
    (tsp_id,full_name,name_with_initials,first_name,surname,gender,dob,birth_certificate_url,religion,marital_state,spouse_name,have_children,nic,nic_url,have_affiliations,short_name,age,pp_url,xfamily_affiliations_pd_id,approved_by,approved_at,nationality) VALUES 
    (${tsp_id},NULL,NULL,'${fname}','${lname}',NULL,'2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'${fname} ${lname}',NULL,NULL,NULL,NULL,'2022-05-16 13:06:36.068','Sri Lankan');
    `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO bs_candidate_level (candidate_id,level) VALUES 
    (${tsp_id},${tutor_level});
  `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO hris_access
    (tsp_id,access,access_type,module) VALUES
    (${tsp_id},1,'profile','recruitment');
    `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO gra_registration_data 
    (tspid,which_partner,knew_about_us,bank_status,progress) VALUES 
    (${tsp_id},'Not Applicable','TSG employee','Yes, I have an active bank account either in Sri Lanka or India',2);
    `;
  await prisma.$executeRawUnsafe(query);

  if ([6, 7].includes(tutor_level)) {
    query = `
        INSERT INTO hris_progress 
            (tsp_id,tutor_status) VALUES 
            (${tsp_id},'onboarding ready')
            ;
        `;
    await prisma.$executeRawUnsafe(query);
  }
} //end: createTutor