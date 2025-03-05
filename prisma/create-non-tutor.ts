import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * function to check whether user exists
 * @param tspId
 */
export async function isUserExist(tspId: number) {
  return prisma.user.findUnique({
    where: {
      tsp_id: tspId
    }
  });
}

/**
 * function to check whether user exists
 * @param tspId
 */
export async function isUsernameExist(username: string) {
  return prisma.user.findUnique({
    where: {
      username: username
    }
  });
}

/**
 * function to create nontutor accounts : interviewer / admin
 * @param tsp_id
 * @param username
 * @param fname
 * @param lname
 * @param ac_type
 */
export async function createNonTutor(
  tsp_id: number,
  username: string,
  fname: string,
  lname: string,
  ac_type: string = 'interviewer'
) {
  let level = 3;
  let email = username;
  let password = '$2a$10$qHXb0Ar.lNve9IuxGJXnMO0ded3p3Z.tFgKmI77XutMDrhpj2rk86'; //pw = b
  let query = '';
  //type = interviewer / admin

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

  // query = `
  //   INSERT INTO bs_candidate_level (candidate_id,level) VALUES
  //   (${tsp_id},3);
  // `;
  // await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO non_tutor_directory (hr_tsp_id,short_name,work_email) VALUES 
    (${tsp_id},'${fname} ${lname}','${email}');
  `;
  await prisma.$executeRawUnsafe(query);

  query = '';
  let query2 = '';

  if (ac_type == 'admin') {
    //accss to gra admin
    query = `
      INSERT INTO hris_access 
    (tsp_id,access,access_type,module) VALUES 
    (${tsp_id},1,'profile','recruitment'),
    (${tsp_id},1,'all', 'CP_AD'),
    (${tsp_id},1,'all', 'CP_AD_HRIS'),
    (${tsp_id},1,'all', 'MA_AD'),
    (${tsp_id},1,'all', 'PIH_AD'),
    (${tsp_id},1,'all', 'AP_AD'),
    (${tsp_id},1,'all', 'TIH_AD'),
    (${tsp_id},1,'all', 'FASH_AD');
    `;
  } else if (ac_type === 'interviewer') {
    //accss to gra interviewer
    query = `
      INSERT INTO hris_access 
      (tsp_id,access,access_type,module) VALUES 
      (${tsp_id},1,'profile','recruitment'),
      (${tsp_id},1,'all', 'AP_INT'),
      (${tsp_id},1,'all', 'CP'),
      (${tsp_id},1,'all', 'PIH'),
      (${tsp_id},1,'all', 'TIH'),
      (${tsp_id},1,'all', 'FASH'),
      (${tsp_id},1,'all', 'RES')
      `;
  } else if (ac_type === 'auditor') {
    //accss to hris auditor
    query = `
      INSERT INTO hris_access
      (tsp_id,access,access_type,module) VALUES
      (${tsp_id},1,'profile','recruitment'),
      (${tsp_id},1,'all', 'AUDITOR');
      `;
  } else if (ac_type === 'it_auditor') {
    //accss to hris it auditor
    query = `
      INSERT INTO hris_access
      (tsp_id,access,access_type,module) VALUES
      (${tsp_id},1,'all', 'HR_IT');
      `;
  } else if (ac_type === 'hr admin') {
    //accss to hris hr admin
    //accss to tms hr admin
    query = `
       INSERT INTO hris_access
      (tsp_id,access,access_type,module) VALUES
      (${tsp_id},1,'profile','recruitment'),
      (${tsp_id},1,'all', 'HR_ADMIN'),
      (${tsp_id},1,'all', 'NON_TUTOR_HR_ADMIN');
      `;

    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},4,1);
      `;
  } else if (ac_type === 'hr user') {
    //accss to hris hr user
    //accss to tms dep head
    query = `
       INSERT INTO hris_access
      (tsp_id,access,access_type,module) VALUES
      (${tsp_id},1,'profile','recruitment'),
      (${tsp_id},1,'all', 'HR_USER'),
      (${tsp_id},1,'all', 'NON_TUTOR_HR_USER');
      `;

    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},3,1);
      `;
  } else if (ac_type === 'rm') {
    //accss to tms relationship manager Executive - Relationship Management
    query = `
       UPDATE non_tutor_directory
      SET job_title='Team Lead'
      WHERE hr_tsp_id=${tsp_id};
      `;
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},2,1);
      `;
  } else if (ac_type === 'capacity') {
    //accss to tms capacity team
    query = '';
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},5,1);
      `;
  } else if (ac_type === 'operations') {
    //accss to tms operations team
    query = '';
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},6,1);
      `;
  } else if (ac_type === 'bsa') {
    //accss to tms bsa team
    query = '';
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},7,1);
      `;
  } else if (ac_type === 'tms_am') {
    //accss to tms am assistant manager acedemic operations
    query = '';
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},8,1);
      `;
  } else if (ac_type === 'tms_com') {
    //accss to tms com compliance team of ops
    query = '';
    query2 = `
       INSERT INTO access_users_on_modules
      (tsp_id,module_id,authorization) VALUES
      (${tsp_id},9,1);
      `;
  } else if (ac_type === 'nthris manager') {
    query = `INSERT INTO hris_access
    (tsp_id,access,access_type,module) VALUES
    (${tsp_id},1,'all', 'NON_TUTOR_MANAGER');
    `;
    query2 = `
       INSERT INTO nthris_leave_entitlements
      (tsp_id,policy_id,allocated_days,created_by) VALUES
      (${tsp_id}, 1, 21, 1),
      (${tsp_id}, 2, 7, 1)
      ;
      `;
  } else if (ac_type === 'nthris user') {
    query = `INSERT INTO hris_access
    (tsp_id,access,access_type,module) VALUES
    (${tsp_id},1,'all', 'NON_TUTOR_USER');
    `;
    query2 = `
       INSERT INTO nthris_leave_entitlements
      (tsp_id,policy_id,allocated_days,created_by) VALUES
      (${tsp_id}, 1, 14, 1),
      (${tsp_id}, 2, 7, 1),
      (${tsp_id}, 3, 7, 1)
      ;
      `;
  } else {
    query = '';
    query2 = '';
  }

  query != '' && (await prisma.$executeRawUnsafe(query));
  query2 != '' && (await prisma.$executeRawUnsafe(query2));

  query = `
    INSERT INTO gra_registration_data 
  (tspId,which_partner,knew_about_us,bank_status,progress,created_at) VALUES 
  (${tsp_id},'Not Applicable','TSG employee','Yes, I have an active bank account either in Sri Lanka or India',2,'2022-05-16 13:06:36.076');
  `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO hris_contact_data 
  (tsp_id,personal_email,work_email,mobile_number,mobile_number_status,mobile_number_reject_reason,landline_number,landline_number_status,landline_number_reject_reason,residing_address_l1,residing_address_l1_status,residing_address_l1_reject_reason,residing_address_l2,residing_address_l2_status,residing_address_l2_reject_reason,residing_city,residing_city_status,residing_city_reject_reason,residing_district,residing_district_status,residing_district_reject_reason,residing_province,residing_province_status,residing_province_reject_reason,residing_country,residing_country_status,residing_country_reject_reason,same_residing_permanent,permanent_address_l1,permanent_address_l1_status,permanent_address_l1_reject_reason,permanent_address_l2,permanent_address_l2_status,permanent_address_l2_reject_reason,permanent_city,permanent_city_status,permanent_city_reject_reason,permanent_district,permanent_district_status,permanent_district_reject_reason,permanent_province,permanent_province_status,permanent_province_reject_reason,permanent_country,permanent_country_status,permanent_country_reject_reason,emg_contact_name,emg_relationship,emg_contact_num,emg_contact_num_status,emg_contact_num_reject_reason,updated_by,updated_at,audited_by,audited_at,record_approved) VALUES 
  (${tsp_id},'${email}','${email}','+94123456789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Galle',NULL,NULL,NULL,NULL,NULL,'Sri Lanka',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
  `;
  await prisma.$executeRawUnsafe(query);

  query = `
    INSERT INTO hris_personal_data 
  (tsp_id,full_name,full_name_status,full_name_reject_reason,name_with_initials,name_with_initials_status,name_with_initials_reject_reason,first_name,first_name_status,first_name_reject_reason,surname,surname_status,surname_reject_reason,gender,dob,dob_status,dob_reject_reason,birth_certificate_url,birth_certificate_url_status,birth_certificate_url_reject_reason,religion,marital_state,spouse_name,have_children,nic,nic_status,nic_reject_reason,nic_url,nic_url_status,nic_url_reject_reason,have_affiliations,short_name,age,pp_url,pp_url_status,pp_url_reject_reason,updated_by,updated_at,audited_by,audited_at,nationality) VALUES 
  (${tsp_id},NULL,NULL,NULL,NULL,NULL,NULL,'${fname}',NULL,NULL,'${lname}',NULL,NULL,NULL,'2000-01-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'${fname} ${lname}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sri Lankan');
  `;
  await prisma.$executeRawUnsafe(query);

  if (ac_type == 'interviewer') {
    query = `
    INSERT INTO bs_interviewer_appointment_type_ref 
  (user_id, status, appointment_type) VALUES 
  (${tsp_id}, 1, 1),
  (${tsp_id}, 1, 2),
  (${tsp_id}, 1, 3);
  `;
    await prisma.$executeRawUnsafe(query);

    query = `
    INSERT INTO bs_vp_meeting_link 
  (user_id, url, status) VALUES 
  (${tsp_id}, 'https://meet.google.com/kab-wwqr-qaj', 1);
  `;
    await prisma.$executeRawUnsafe(query);
  }
} //end: createNonTutor
