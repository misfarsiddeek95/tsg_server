import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import moment = require('moment');

@Injectable()
export class ExportHubService {
  constructor(private prisma: PrismaService) {}

  async fetchTutorProfiles() {
    const tutor_profiles_query = await this.prisma.$queryRaw` SELECT u.tsp_id
    , p.tutor_status, p.profile_status
    , DATE_FORMAT(p.tsp_activated_at, '%Y-%m-%d %H:%i:%s') AS tsp_activated_at
    ,apd.short_name, acd.work_email
    ,tm.employee_status, tm.sub_status
    , tsl.tsl_id
     FROM user u
    left join hris_progress p on u.tsp_id = p.tsp_id
    left join approved_personal_data apd on u.tsp_id = apd.tsp_id
    left join approved_contact_data acd on u.tsp_id = acd.tsp_id
    left join tm_approved_status tm on u.tsp_id = tm.tutor_tsp_id
    left join tsl_user tsl on u.tsp_id = tsl.tsp_id
    where u.level in (1);`;

    return tutor_profiles_query;
  }

  async fetchLatestQualifications() {
    const raw_query_result = await this.prisma
      .$queryRaw` WITH ranked_messages AS (
      SELECT m.*, ROW_NUMBER() OVER (PARTITION BY tsp_id ORDER BY id DESC) AS rn
      FROM hris_qualifications_data AS m
     
    ),
    hcd AS (SELECT * FROM ranked_messages WHERE rn = 1)
    
    SELECT
        u4.tsp_id,
        hpd.short_name,
        u4.username,
        tma.employee_status AS tm_employee_status,
        tma.movement_type,
        qd.*
    FROM
    user u4
        LEFT JOIN approved_personal_data hpd ON u4.tsp_id = hpd.tsp_id
        LEFT JOIN tm_approved_status tma ON u4.tsp_id = tma.tutor_tsp_id
        LEFT JOIN hcd ON u4.tsp_id = hcd.tsp_id
        LEFT JOIN xother_quali_data qd ON hcd.id=qd.q_id
       WHERE u4.level in(1,2) 
         order by tma.batch,u4.tsp_id;`;

    return raw_query_result;
  }

  async fetchProfileCompletion() {
    const raw_query_result = await this.prisma.$queryRaw`
      SELECT  u.tsp_id, u.username,apd.short_name, u.last_login_at, u.created_at, 
      p.tsp_id, p.submited_at, p.tsp_activated_at,
      p.personal_data_count, p.contact_data_count, p.educational_data_count, p.qualification_data_count, p.work_experience_data_count, 
      p.bank_data_count, p.referee_data_count, p.health_data_count, p.it_data_count, p.availability_data_count, p.support_data_count, p.right2work_data_count,
      p.auditor_id, p.tutor_status, p.profile_status, p.updated_at

      FROM user u left join 
      hris_progress p on u.tsp_id = p.tsp_id
      left join approved_personal_data apd on u.tsp_id = apd.tsp_id
      where u.level = 2 and p.tutor_status='onboarding ready';`;
    return raw_query_result;
  }

  async fetchLatestHardware() {
    const raw_query_result = await this.prisma
      .$queryRaw` WITH ranked_messages AS (
          SELECT m.*, ROW_NUMBER() OVER (PARTITION BY tsp_id ORDER BY id DESC) AS rn
          FROM hris_it_data AS m
        ),
        hcd AS (SELECT tsp_id,have_pc, pc_type, pc_url, have_headset, headset_specs, headset_url, primary_isp, secondary_isp, responsible_it_check, pc_ownership, pc_os, pc_ram, hd_type, hd_capacity, pc_browsers, pc_antivirus, headset_usb, headset_mute_btn, headset_noise_cancel, primary_connected_count, primary_upload_speed, primary_ping, have_secondary_connection, secondary_upload_speed, secondary_ping, updated_by, updated_at, audited_by, audited_at, desktop_ups, desktop_ups_reject_reason, desktop_ups_runtime, desktop_ups_runtime_reject_reason, desktop_ups_runtime_status, desktop_ups_status, desktop_ups_url, desktop_ups_url_reject_reason, desktop_ups_url_status, have_headset_reject_reason, have_headset_status, have_pc_reject_reason, have_pc_status, have_secondary_connection_reject_reason, have_secondary_connection_status, hd_capacity_reject_reason, hd_capacity_status, hd_type_reject_reason, hd_type_status, headset_connectivity_type, headset_connectivity_type_reject_reason, headset_connectivity_type_status, headset_mute_btn_reject_reason, headset_mute_btn_status, headset_noise_cancel_reject_reason, headset_noise_cancel_status, headset_specs_reject_reason, headset_specs_status, headset_url_reject_reason, headset_url_status, headset_usb_reject_reason, headset_usb_status, laptop_battery_age, laptop_battery_age_reject_reason, laptop_battery_age_status, laptop_battery_runtime, laptop_battery_runtime_reject_reason, laptop_battery_runtime_status, laptop_serial, laptop_serial_reject_reason, laptop_serial_status, last_service_date, last_service_date_reject_reason, last_service_date_status, pc_antivirus_other, pc_antivirus_other_reject_reason, pc_antivirus_other_status, pc_antivirus_reject_reason, pc_antivirus_status, pc_bit_version, pc_bit_version_reject_reason, pc_bit_version_status, pc_brand, pc_brand_other, pc_brand_other_reject_reason, pc_brand_other_status, pc_brand_reject_reason, pc_brand_status, pc_browsers_reject_reason, pc_browsers_status, pc_ip_address, pc_ip_address_reject_reason, pc_ip_address_status, pc_model, pc_model_reject_reason, pc_model_status, pc_os_reject_reason, pc_os_status, pc_ownership_reject_reason, pc_ownership_status, pc_processor, pc_processor_reject_reason, pc_processor_status, pc_ram_reject_reason, pc_ram_status, pc_type_reject_reason, pc_type_status, pc_url_reject_reason, pc_url_status, primary_connected_count_reject_reason, primary_connected_count_status, primary_connection_type, primary_connection_type_reject_reason, primary_connection_type_status, primary_download_speed, primary_download_speed_reject_reason, primary_download_speed_status, primary_isp_reject_reason, primary_isp_status, primary_ping_reject_reason, primary_ping_status, primary_speed_url, primary_speed_url_reject_reason, primary_speed_url_status, primary_upload_speed_reject_reason, primary_upload_speed_status, ram_url, ram_url_reject_reason, ram_url_status, secondary_connection_type, secondary_connection_type_reject_reason, secondary_connection_type_status, secondary_download_speed, secondary_download_speed_reject_reason, secondary_download_speed_status, secondary_isp_reject_reason, secondary_isp_status, secondary_ping_reject_reason, secondary_ping_status, secondary_speed_url, secondary_speed_url_reject_reason, secondary_speed_url_status, secondary_upload_speed_reject_reason, secondary_upload_speed_status, pc_os_other, pc_os_other_reject_reason, pc_os_other_status, pc_processor_other, pc_processor_other_reject_reason, pc_processor_other_status, primary_isp_other, primary_isp_other_reject_reason, primary_isp_other_status, secondary_isp_other, secondary_isp_other_reject_reason, secondary_isp_other_status FROM ranked_messages WHERE rn = 1)

        SELECT
            u4.tsp_id,
            hpd.short_name,
            u4.username,
            tma.employee_status AS tm_employee_status,
            tma.movement_type,
          hcd.*,
            p.tutor_status
        FROM
        hcd
        LEFT JOIN user u4 ON u4.tsp_id = hcd.tsp_id
            LEFT JOIN approved_personal_data hpd ON u4.tsp_id = hpd.tsp_id
            LEFT JOIN tm_approved_status tma ON u4.tsp_id = tma.tutor_tsp_id
            LEFT JOIN hris_progress p on u4.tsp_id = p.tsp_id          
        WHERE u4.level in(1,2) 
            order by u4.tsp_id;`;

    return raw_query_result;
  }

  async fetchLatestPersonalContactData() {
    const raw_query_result = await this.prisma.$queryRaw`
       WITH 
r1 AS (
  SELECT m.*, ROW_NUMBER() OVER (PARTITION BY tsp_id ORDER BY id DESC) AS rn 
  FROM hris_personal_data AS m 
),
rr1 AS (SELECT tsp_id,full_name, full_name_status, full_name_reject_reason, name_with_initials, name_with_initials_status, name_with_initials_reject_reason, first_name, first_name_status, first_name_reject_reason, surname, surname_status, surname_reject_reason, gender, dob, dob_status, dob_reject_reason, birth_certificate_url, birth_certificate_url_status, birth_certificate_url_reject_reason, religion, marital_state, spouse_name, have_children, nic, nic_status, nic_reject_reason, nic_url, nic_url_status, nic_url_reject_reason, have_affiliations, short_name, age, pp_url, pp_url_status, pp_url_reject_reason, updated_by, updated_at, audited_by, audited_at, nationality, have_rtw_document, have_rtw_document_reject_reason, have_rtw_document_status, have_rtw_expiration_date, have_rtw_expiration_date_reject_reason, have_rtw_expiration_date_status, id_language, id_language_reject_reason, id_language_status, passport_country, passport_country_reject_reason, passport_country_status, passport_expiration_date, passport_expiration_date_reject_reason, passport_expiration_date_status, rtw_document_url, rtw_document_url_reject_reason, rtw_document_url_status, rtw_expiration_date, rtw_expiration_date_reject_reason, rtw_expiration_date_status, type_of_id, type_of_id_reject_reason, type_of_id_status FROM r1 WHERE rn = 1),


r2 AS (
  SELECT m.*, ROW_NUMBER() OVER (PARTITION BY tsp_id ORDER BY id DESC) AS rn 
  FROM hris_contact_data AS m 
),
rr2 AS (SELECT tsp_id, personal_email, work_email, work_email_status, work_email_reject_reason, mobile_number, mobile_number_status, mobile_number_reject_reason, landline_number, landline_number_status, landline_number_reject_reason, residing_address_l1, residing_address_l1_status, residing_address_l1_reject_reason, residing_address_l2, residing_address_l2_status, residing_address_l2_reject_reason, residing_city, residing_city_status, residing_city_reject_reason, residing_district, residing_district_status, residing_district_reject_reason, residing_province, residing_province_status, residing_province_reject_reason, residing_country, residing_country_status, residing_country_reject_reason, same_residing_permanent, permanent_address_l1, permanent_address_l1_status, permanent_address_l1_reject_reason, permanent_address_l2, permanent_address_l2_status, permanent_address_l2_reject_reason, permanent_city, permanent_city_status, permanent_city_reject_reason, permanent_district, permanent_district_status, permanent_district_reject_reason, permanent_province, permanent_province_status, permanent_province_reject_reason, permanent_country, permanent_country_status, permanent_country_reject_reason, emg_contact_name, emg_relationship, emg_contact_num, emg_contact_num_status, emg_contact_num_reject_reason, residing_pin, residing_pin_status, residing_pin_reject_reason, permanent_pin, permanent_pin_status, permanent_pin_reject_reason, updated_by, updated_at, audited_by, audited_at, record_approved FROM r2 WHERE rn = 1)

SELECT
    u4.tsp_id,
    
    apd.short_name,
    apd.full_name,
    apd.dob,
    acd.work_email,
    acd.personal_email,
    acd.residing_country,
    hp.tutor_status AS hris_tutor_status,
    hp.profile_status AS hris_profile_status,
    tma.employee_status AS tm_employee_status,
   --  rr1.*
	rr2.*
FROM
user u4
    LEFT JOIN approved_personal_data apd ON u4.tsp_id = apd.tsp_id
    LEFT JOIN approved_contact_data acd ON u4.tsp_id = acd.tsp_id
    LEFT JOIN hris_progress hp ON u4.tsp_id = hp.tsp_id
    LEFT JOIN tm_approved_status tma ON u4.tsp_id = tma.tutor_tsp_id
   
    left join rr1 on u4.tsp_id = rr1.tsp_id
    left join rr2 on u4.tsp_id = rr2.tsp_id
WHERE u4.level in (1,2)
    order by u4.tsp_id

;`;

    return raw_query_result;
  }

  async fetchTmsHistoryData(query) {
    const dateRangeFilter =
      query &&
      query.startDate &&
      query.endDate &&
      moment(query.startDate).isValid() &&
      moment(query.endDate).isValid()
        ? " AND tmmt.created_at BETWEEN '" +
          moment(query.startDate).format('YYYY-MM-DD') +
          "' AND '" +
          moment(query.endDate).format('YYYY-MM-DD') +
          "'"
        : '';

    const raw_query_result = await this.prisma.$queryRawUnsafe(`
    SELECT 
        tmmt.tutor_tsp_id AS tutor_tsp_id,
        CONCAT(apd.first_name, ' ', apd.surname) AS short_name,
        acd.work_email AS work_email,
        tmmt.movement_type AS movement_type,
        tmmt.effective_date AS effective_date,

        tmmt.created_at AS created_at,
        tmmt.created_by AS created_by,
        CONCAT('M-', tmmt.id) AS idx,
        tmmt.id AS id,
        'tm_master_tb' AS tb,

        tmmt.m1_approval AS m1_approval,
        tmmt.l1_approval AS l1_approval,
        tmmt.l2_approval AS l2_approval,
        tmmt.movement_status AS movement_status,
        tmmt.reject_reason AS reject_reason,

        tmmt.resignation_given_date AS resignation_given_date,
        tmmt.return_date AS return_date,
        tmmt.resignation_reason AS resignation_reason,
        tmmt.withdrawal_reason AS withdrawal_reason,
        tmmt.description AS description,
        tmmt.comment AS comment,

        tmapp.supervisor_tsp_id AS supervisor_tsp_id,
        tmapp.supervisor_name AS supervisor_name,
        tmapp.employee_status AS employee_status,
        tmapp.movement_type AS ap_movement_type,
        tmapp.status_description AS ap_status_description,
        tmapp.sub_status AS ap_sub_status,

        tmmt.m1_at AS m1_at,
        tmmt.m1_by AS m1_by,
        tmmt.l1_at AS l1_at,
        tmmt.l1_by AS l1_by,
        tmmt.l2_at AS l2_at,
        tmmt.l2_by AS l2_by,
        u3a.username AS created_byn,
        u3b.username AS m1_byn,
        u3c.username AS l1_byn,
        u3d.username AS l2_byn

    FROM
        (((((((tm_master_tb tmmt
        LEFT JOIN tm_approved_status tmapp ON ((tmmt.tutor_tsp_id = tmapp.tutor_tsp_id)))
        LEFT JOIN approved_personal_data apd ON ((tmmt.tutor_tsp_id = apd.tsp_id)))
        LEFT JOIN approved_contact_data acd ON ((tmmt.tutor_tsp_id = acd.tsp_id)))
        LEFT JOIN user u3a ON ((tmmt.created_by = u3a.tsp_id)))
        LEFT JOIN user u3b ON ((tmmt.m1_by = u3b.tsp_id)))
        LEFT JOIN user u3c ON ((tmmt.l1_by = u3c.tsp_id)))
        LEFT JOIN user u3d ON ((tmmt.l2_by = u3d.tsp_id)))
    WHERE 1=1 ${dateRangeFilter}

    ORDER BY tmmt.effective_date ASC, tmmt.created_at ASC
    ;`);
    return raw_query_result;
  }

  async fetchTmsApprovalData() {
    const raw_query_result = await this.prisma.$queryRaw`
       (
    (
    SELECT 
        tmmt.tutor_tsp_id AS tutor_tsp_id,
        CONCAT(apd.first_name, ' ', apd.surname) AS short_name,
        acd.work_email AS work_email,
        tmmt.movement_type AS movement_type,
        tmmt.effective_date AS effective_date,

        tmmt.created_at AS created_at,
        tmmt.created_by AS created_by,
        CONCAT('M-', tmmt.id) AS idx,
        tmmt.id AS id,
        'tm_master_tb' AS tb,

        tmmt.m1_approval AS m1_approval,
        tmmt.l1_approval AS l1_approval,
        tmmt.l2_approval AS l2_approval,
        tmmt.movement_status AS movement_status,
        tmmt.reject_reason AS reject_reason,

        tmmt.resignation_given_date AS resignation_given_date,
        tmmt.return_date AS return_date,
        tmmt.resignation_reason AS resignation_reason,
        tmmt.withdrawal_reason AS withdrawal_reason,
        tmmt.description AS description,
        tmmt.comment AS comment,

        tmapp.supervisor_tsp_id AS supervisor_tsp_id,
        tmapp.supervisor_name AS supervisor_name,
        tmapp.employee_status AS employee_status,
        tmapp.movement_type AS ap_movement_type,
        tmapp.status_description AS ap_status_description,
        tmapp.sub_status AS ap_sub_status,

        tmmt.m1_at AS m1_at,
        tmmt.m1_by AS m1_by,
        tmmt.l1_at AS l1_at,
        tmmt.l1_by AS l1_by,
        tmmt.l2_at AS l2_at,
        tmmt.l2_by AS l2_by,
        u3a.username AS created_byn,
        u3b.username AS m1_byn,
        u3c.username AS l1_byn,
        u3d.username AS l2_byn


    FROM
        (((((((tm_master_tb tmmt
        LEFT JOIN tm_approved_status tmapp ON ((tmmt.tutor_tsp_id = tmapp.tutor_tsp_id)))
        LEFT JOIN approved_personal_data apd ON ((tmmt.tutor_tsp_id = apd.tsp_id)))
        LEFT JOIN approved_contact_data acd ON ((tmmt.tutor_tsp_id = acd.tsp_id)))
        LEFT JOIN user u3a ON ((tmmt.created_by = u3a.tsp_id)))
        LEFT JOIN user u3b ON ((tmmt.m1_by = u3b.tsp_id)))
        LEFT JOIN user u3c ON ((tmmt.l1_by = u3c.tsp_id)))
        LEFT JOIN user u3d ON ((tmmt.l2_by = u3d.tsp_id)))

    ORDER BY effective_date ASC, created_at ASC
    )
)
    ;`;
    return raw_query_result;
  }

  async fetchNthrisLeaveApplicationsData(query) {
    const dateRangeFilter =
      query &&
      query.startDate &&
      query.endDate &&
      moment(query.startDate).isValid() &&
      moment(query.endDate).isValid()
        ? " AND ntla.to_date >= '" +
          moment(query.startDate).format('YYYY-MM-DD') +
          "' AND ntla.from_date <= '" +
          moment(query.endDate).format('YYYY-MM-DD') +
          "'"
        : '';

    const raw_query_result = await this.prisma.$queryRawUnsafe(`
    SELECT 
    ntla.*
    , u1.username 'nt_email', u2.username 'mng_email'
    , meta.meta_name 'status_description'
    , policies.policy_name 'policy_description'
    FROM nthris_leave_applications ntla
    left join user u1 on ntla.tsp_id = u1.tsp_id
    left join user u2 on ntla.manager_id = u2.tsp_id
    left join nthris_leave_meta meta on (ntla.status = meta.meta_value and meta.meta_type = 'leave_status')
    left join nthris_leave_policies policies on ntla.leave_policy_id = policies.hr_policy_id

    WHERE 1=1 ${dateRangeFilter}

    ORDER BY ntla.id ASC
    ;`);
    console.log('raw_query_result', raw_query_result);
    return raw_query_result;
  }

  async fetchNthrisPendingLeaveReportData(query) {
    const dateRangeFilter =
      query &&
      query.startDate &&
      query.endDate &&
      moment(query.startDate).isValid() &&
      moment(query.endDate).isValid()
        ? " AND l.from_date >= '" +
          moment(query.startDate).format('YYYY-MM-DD') +
          "' AND l.from_date <= '" +
          moment(query.endDate).format('YYYY-MM-DD') +
          "'"
        : '';

    const raw_query_result = await this.prisma.$queryRawUnsafe(`
    SELECT n.short_name,n.epf,n.supervisor_id,n.supervisor,l.* FROM 
    nthris_leave_applications l Left Join
    non_tutor_directory n
    ON l.tsp_id=n.hr_tsp_id 
    where l.status=0 and

    WHERE 1=1 ${dateRangeFilter}

    ORDER BY l.id ASC
    ;`);
    console.log('raw_query_result', raw_query_result);
    return raw_query_result;
  }
}
