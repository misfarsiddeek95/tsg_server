-- CreateTable
CREATE TABLE `approved_bank_data` (
    `tsp_id` INTEGER NOT NULL,
    `bank_name` VARCHAR(200) NULL,
    `b_branch` VARCHAR(200) NULL,
    `b_branch_code` VARCHAR(45) NULL,
    `b_account_no` VARCHAR(45) NULL,
    `b_account_name` VARCHAR(200) NULL,
    `b_swift` VARCHAR(100) NULL,
    `b_passbook_url` VARCHAR(500) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1273`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_contact_data` (
    `tsp_id` INTEGER NOT NULL,
    `personal_email` VARCHAR(100) NULL,
    `work_email` VARCHAR(100) NULL,
    `mobile_number` VARCHAR(45) NULL,
    `landline_number` VARCHAR(45) NULL,
    `residing_address_l1` VARCHAR(200) NULL,
    `residing_address_l2` VARCHAR(200) NULL,
    `residing_city` VARCHAR(100) NULL,
    `residing_district` VARCHAR(100) NULL,
    `residing_province` VARCHAR(100) NULL,
    `residing_country` VARCHAR(100) NULL,
    `same_residing_permanent` VARCHAR(45) NULL,
    `permanent_address_l1` VARCHAR(200) NULL,
    `permanent_address_l2` VARCHAR(200) NULL,
    `permanent_city` VARCHAR(100) NULL,
    `permanent_district` VARCHAR(100) NULL,
    `permanent_province` VARCHAR(100) NULL,
    `permanent_country` VARCHAR(45) NULL,
    `emg_contact_name` VARCHAR(100) NULL,
    `emg_relationship` VARCHAR(100) NULL,
    `emg_contact_num` VARCHAR(45) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_995`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_contract_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `contract_url` VARCHAR(1000) NULL,
    `contract_no` INTEGER NOT NULL,
    `contract_type` VARCHAR(100) NULL,
    `contract_start_d` DATE NULL,
    `contract_end_d` DATE NULL,
    `hr_admin_approval` VARCHAR(45) NULL,
    `hr_comment` VARCHAR(200) NULL,
    `updated_by` VARCHAR(100) NULL,
    `updated_at` DATETIME(0) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(0) NULL,

    INDEX `fkIdx_1768`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_education_data` (
    `tsp_id` INTEGER NOT NULL,
    `ol_syllabus` VARCHAR(100) NULL,
    `ol_year` INTEGER NULL,
    `ol_maths` VARCHAR(45) NULL,
    `ol_english` VARCHAR(45) NULL,
    `ol_certificate_url` VARCHAR(500) NULL,
    `al_syllabus` VARCHAR(200) NULL,
    `al_year` INTEGER NULL,
    `al_stream` VARCHAR(200) NULL,
    `al_certificate_url` VARCHAR(500) NULL,
    `al_subject1` VARCHAR(200) NULL,
    `al_subject1_result` VARCHAR(10) NULL,
    `al_subject2` VARCHAR(200) NULL,
    `al_subject2_result` VARCHAR(10) NULL,
    `al_subject3` VARCHAR(200) NULL,
    `al_subject3_result` VARCHAR(10) NULL,
    `al_subject4` VARCHAR(200) NULL,
    `al_subject4_result` VARCHAR(10) NULL,
    `al_subject5` VARCHAR(200) NULL,
    `al_subject5_result` VARCHAR(10) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1099`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_health_data` (
    `tsp_id` INTEGER NOT NULL,
    `hd1_heart` VARCHAR(10) NULL,
    `hd1_heart_state` VARCHAR(30) NULL,
    `hd2_neck` VARCHAR(10) NULL,
    `hd2_neck_state` VARCHAR(30) NULL,
    `hd3_high` VARCHAR(10) NULL,
    `hd3_high_state` VARCHAR(30) NULL,
    `hd4_arthritis` VARCHAR(10) NULL,
    `hd4_arthritis_state` VARCHAR(30) NULL,
    `hd5_terminally` VARCHAR(10) NULL,
    `hd5_terminally_state` VARCHAR(30) NULL,
    `hd6_unusual` VARCHAR(10) NULL,
    `hd6_unusual_state` VARCHAR(30) NULL,
    `hd7_asthma` VARCHAR(10) NULL,
    `hd7_asthma_state` VARCHAR(30) NULL,
    `hd8_fainting` VARCHAR(10) NULL,
    `hd8_fainting_state` VARCHAR(30) NULL,
    `hd9_depression` VARCHAR(10) NULL,
    `hd9_depression_state` VARCHAR(30) NULL,
    `hd10_throat` VARCHAR(10) NULL,
    `hd10_throat_state` VARCHAR(30) NULL,
    `hd11_other` VARCHAR(10) NULL,
    `hd11_other_explain` VARCHAR(200) NULL,
    `hd_page_status` VARCHAR(45) NULL,
    `hd_page_reject_reason` VARCHAR(200) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_937_clone`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_it_data` (
    `tsp_id` INTEGER NOT NULL,
    `have_pc` VARCHAR(45) NULL,
    `pc_type` VARCHAR(45) NULL,
    `pc_specs` VARCHAR(200) NULL,
    `pc_url` VARCHAR(500) NULL,
    `have_headset` VARCHAR(45) NULL,
    `headset_specs` VARCHAR(200) NULL,
    `headset_url` VARCHAR(500) NULL,
    `primary_internet` VARCHAR(45) NULL,
    `primary_isp` VARCHAR(45) NULL,
    `secondary_internet` VARCHAR(45) NULL,
    `secondary_isp` VARCHAR(45) NULL,
    `primary_net_speed` VARCHAR(200) NULL,
    `primary_net_url` VARCHAR(500) NULL,
    `responsible_it_check` VARCHAR(45) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1244`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_personal_data` (
    `tsp_id` INTEGER NOT NULL,
    `full_name` VARCHAR(200) NULL,
    `name_with_initials` VARCHAR(200) NULL,
    `first_name` VARCHAR(200) NULL,
    `surname` VARCHAR(200) NULL,
    `gender` VARCHAR(45) NULL,
    `dob` DATE NULL,
    `birth_certificate_url` VARCHAR(500) NULL,
    `religion` VARCHAR(45) NULL,
    `marital_state` VARCHAR(45) NULL,
    `spouse_name` VARCHAR(200) NULL,
    `have_children` VARCHAR(45) NULL,
    `nic` VARCHAR(45) NULL,
    `nic_url` VARCHAR(500) NULL,
    `have_affiliations` VARCHAR(45) NULL,
    `short_name` VARCHAR(200) NULL,
    `age` INTEGER NULL,
    `pp_url` VARCHAR(500) NULL,
    `XfamilyAffiliations_pd_id` INTEGER NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_771`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_qualifications_data` (
    `tsp_id` INTEGER NOT NULL,
    `hq_course_type` VARCHAR(100) NULL,
    `hq_field_study` VARCHAR(100) NULL,
    `hq_has_completed` VARCHAR(45) NULL,
    `hq_start_year` INTEGER NULL,
    `hq_completion_year` INTEGER NULL,
    `hq_is_local` VARCHAR(100) NULL,
    `hq_main_inst` VARCHAR(200) NULL,
    `hq_affi_inst` VARCHAR(200) NULL,
    `hq_doc_url` VARCHAR(500) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_920_clone`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_right2work_data` (
    `tsp_id` INTEGER NOT NULL,
    `contract_url` VARCHAR(500) NULL,
    `gs_issued_date` DATE NULL,
    `gs_url` VARCHAR(500) NULL,
    `pcc_issued_date` DATE NULL,
    `pcc_reference_no` VARCHAR(45) NULL,
    `pcc_url` VARCHAR(500) NULL,
    `pcc_expire_date` DATE NULL,
    `pcc_state` VARCHAR(45) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1579`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_work_exp_data` (
    `tsp_id` INTEGER NOT NULL,
    `have_pre_tsg` VARCHAR(45) NULL,
    `pre_tsg_type` VARCHAR(100) NULL,
    `pre_tsg_start` DATE NULL,
    `pre_tsg_end` DATE NULL,
    `is_currently_employed` VARCHAR(45) NULL,
    `current_emp_name` VARCHAR(200) NULL,
    `current_emp_type` VARCHAR(100) NULL,
    `current_emp_title` VARCHAR(200) NULL,
    `current_emp_start` DATE NULL,
    `current_emp_teaching` VARCHAR(45) NULL,
    `current_emp_doc_url` VARCHAR(500) NULL,
    `acknowledgment_check` VARCHAR(45) NULL,
    `approved_by` SMALLINT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1196`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_xother_quali_data` (
    `tsp_id` INTEGER NOT NULL,
    `local_id` INTEGER NOT NULL,
    `course_type` VARCHAR(100) NULL,
    `field_study` VARCHAR(100) NULL,
    `has_completed` VARCHAR(45) NULL,
    `start_year` INTEGER NULL,
    `completion_year` INTEGER NULL,
    `is_local` VARCHAR(45) NULL,
    `main_inst` VARCHAR(200) NULL,
    `affi_inst` VARCHAR(200) NULL,
    `doc_url` VARCHAR(500) NULL,

    INDEX `fkIdx_1595`(`tsp_id`),
    PRIMARY KEY (`tsp_id`, `local_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approved_xother_work_exp_data` (
    `tsp_id` INTEGER NOT NULL,
    `local_id` INTEGER NOT NULL,
    `employer_name` VARCHAR(100) NULL,
    `employment_type` VARCHAR(100) NULL,
    `job_title` VARCHAR(100) NULL,
    `currently_employed` VARCHAR(20) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `teaching_exp` VARCHAR(20) NULL,
    `doc_url` VARCHAR(200) NULL,

    INDEX `fkIdx_1640`(`tsp_id`),
    PRIMARY KEY (`tsp_id`, `local_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank_name` VARCHAR(200) NULL,
    `bank_swift_code` VARCHAR(45) NULL,
    `bank_code` VARCHAR(45) NULL,
    `branch_code` VARCHAR(45) NULL,
    `updated_by` VARCHAR(45) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_academic_inputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `academic_coach` VARCHAR(200) NULL,
    `academic_assistant_manager` VARCHAR(200) NULL,
    `academic_tsp_status` VARCHAR(45) NULL,
    `trainee_performance` VARCHAR(45) NULL,
    `academic_tsp_instance` VARCHAR(45) NULL,
    `updated_by` VARCHAR(45) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fkIdx_1008`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_access` (
    `record_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `access` BOOLEAN NOT NULL,
    `access_type` VARCHAR(45) NULL,
    `module` VARCHAR(45) NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(0) NULL,

    INDEX `FK_942`(`tsp_id`),
    PRIMARY KEY (`record_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_assigned_auditor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NULL,
    `auditor` INTEGER NULL,
    `updated_by` SMALLINT NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `fkIdx_1030`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_audited_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `audit_result` VARCHAR(45) NULL,
    `eligibility_status` VARCHAR(45) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,

    INDEX `fkIdx_1318`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_bank_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `bank_name` VARCHAR(200) NULL,
    `bank_name_status` VARCHAR(45) NULL,
    `bank_name_reject_reason` VARCHAR(200) NULL,
    `b_branch` VARCHAR(200) NULL,
    `b_branch_status` VARCHAR(45) NULL,
    `b_branch_reject_reason` VARCHAR(200) NULL,
    `b_branch_code` VARCHAR(45) NULL,
    `b_account_no` VARCHAR(45) NULL,
    `b_account_no_status` VARCHAR(45) NULL,
    `b_account_no_reject_reason` VARCHAR(200) NULL,
    `b_account_name` VARCHAR(200) NULL,
    `b_account_name_status` VARCHAR(45) NULL,
    `b_account_name_reject_reason` VARCHAR(200) NULL,
    `b_swift` VARCHAR(45) NULL,
    `b_passbook_url` VARCHAR(500) NULL,
    `b_passbook_url_status` VARCHAR(45) NULL,
    `b_passbook_url_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_933`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_contact_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `personal_email` VARCHAR(100) NULL,
    `work_email` VARCHAR(100) NULL,
    `mobile_number` VARCHAR(45) NULL,
    `mobile_number_status` VARCHAR(45) NULL,
    `mobile_number_reject_reason` VARCHAR(200) NULL,
    `landline_number` VARCHAR(45) NULL,
    `landline_number_status` VARCHAR(45) NULL,
    `landline_number_reject_reason` VARCHAR(200) NULL,
    `residing_address_l1` VARCHAR(200) NULL,
    `residing_address_l1_status` VARCHAR(45) NULL,
    `residing_address_l1_reject_reason` VARCHAR(200) NULL,
    `residing_address_l2` VARCHAR(200) NULL,
    `residing_address_l2_status` VARCHAR(45) NULL,
    `residing_address_l2_reject_reason` VARCHAR(200) NULL,
    `residing_city` VARCHAR(100) NULL,
    `residing_city_status` VARCHAR(45) NULL,
    `residing_city_reject_reason` VARCHAR(200) NULL,
    `residing_district` VARCHAR(100) NULL,
    `residing_district_status` VARCHAR(45) NULL,
    `residing_district_reject_reason` VARCHAR(200) NULL,
    `residing_province` VARCHAR(100) NULL,
    `residing_province_status` VARCHAR(45) NULL,
    `residing_province_reject_reason` VARCHAR(200) NULL,
    `residing_country` VARCHAR(100) NULL,
    `residing_country_status` VARCHAR(45) NULL,
    `residing_country_reject_reason` VARCHAR(200) NULL,
    `same_residing_permanent` VARCHAR(45) NULL,
    `permanent_address_l1` VARCHAR(200) NULL,
    `permanent_address_l1_status` VARCHAR(45) NULL,
    `permanent_address_l1_reject_reason` VARCHAR(200) NULL,
    `permanent_address_l2` VARCHAR(200) NULL,
    `permanent_address_l2_status` VARCHAR(45) NULL,
    `permanent_address_l2_reject_reason` VARCHAR(200) NULL,
    `permanent_city` VARCHAR(100) NULL,
    `permanent_city_status` VARCHAR(45) NULL,
    `permanent_city_reject_reason` VARCHAR(200) NULL,
    `permanent_district` VARCHAR(100) NULL,
    `permanent_district_status` VARCHAR(45) NULL,
    `permanent_district_reject_reason` VARCHAR(200) NULL,
    `permanent_province` VARCHAR(100) NULL,
    `permanent_province_status` VARCHAR(45) NULL,
    `permanent_province_reject_reason` VARCHAR(200) NULL,
    `permanent_country` VARCHAR(45) NULL,
    `permanent_country_status` VARCHAR(45) NULL,
    `permanent_country_reject_reason` VARCHAR(200) NULL,
    `emg_contact_name` VARCHAR(100) NULL,
    `emg_relationship` VARCHAR(100) NULL,
    `emg_contact_num` VARCHAR(45) NULL,
    `emg_contact_num_status` VARCHAR(45) NULL,
    `emg_contact_num_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_465`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_education_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `ol_syllabus` VARCHAR(100) NULL,
    `ol_syllabus_status` VARCHAR(45) NULL,
    `ol_syllabus_reject_reason` VARCHAR(200) NULL,
    `ol_year` INTEGER NULL,
    `ol_year_status` VARCHAR(200) NULL,
    `ol_year_reject_reason` VARCHAR(200) NULL,
    `ol_maths` VARCHAR(45) NULL,
    `ol_maths_status` VARCHAR(45) NULL,
    `ol_maths_reject_reason` VARCHAR(200) NULL,
    `ol_english` VARCHAR(45) NULL,
    `ol_english_status` VARCHAR(45) NULL,
    `ol_english_reject_reason` VARCHAR(200) NULL,
    `ol_certificate_url` VARCHAR(500) NULL,
    `ol_certificate_url_status` VARCHAR(45) NULL,
    `ol_certificate_url_reject_reason` VARCHAR(200) NULL,
    `al_syllabus` VARCHAR(200) NULL,
    `al_syllabus_status` VARCHAR(45) NULL,
    `al_syllabus_reject_reason` VARCHAR(200) NULL,
    `al_year` INTEGER NULL,
    `al_year_status` VARCHAR(45) NULL,
    `al_year_reject_reason` VARCHAR(200) NULL,
    `al_stream` VARCHAR(200) NULL,
    `al_stream_status` VARCHAR(45) NULL,
    `al_stream_reject_reason` VARCHAR(200) NULL,
    `al_certificate_url` VARCHAR(500) NULL,
    `al_certificate_url_status` VARCHAR(45) NULL,
    `al_certificate_url_reject_reason` VARCHAR(200) NULL,
    `al_subject1` VARCHAR(200) NULL,
    `al_subject1_status` VARCHAR(45) NULL,
    `al_subject1_reject_reason` VARCHAR(200) NULL,
    `al_subject1_result` VARCHAR(10) NULL,
    `al_subject2` VARCHAR(200) NULL,
    `al_subject2_status` VARCHAR(45) NULL,
    `al_subject2_reject_reason` VARCHAR(200) NULL,
    `al_subject2_result` VARCHAR(10) NULL,
    `al_subject3` VARCHAR(200) NULL,
    `al_subject3_status` VARCHAR(45) NULL,
    `al_subject3_reject_reason` VARCHAR(300) NULL,
    `al_subject3_result` VARCHAR(10) NULL,
    `al_subject4` VARCHAR(200) NULL,
    `al_subject4_status` VARCHAR(45) NULL,
    `al_subject4_reject_reason` VARCHAR(200) NULL,
    `al_subject4_result` VARCHAR(10) NULL,
    `al_subject5` VARCHAR(200) NULL,
    `al_subject5_status` VARCHAR(45) NULL,
    `al_subject5_reject_reason` VARCHAR(200) NULL,
    `al_subject5_result` VARCHAR(10) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_530`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_health_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `hd1_heart` VARCHAR(10) NULL,
    `hd1_heart_state` VARCHAR(30) NULL,
    `hd2_neck` VARCHAR(10) NULL,
    `hd2_neck_state` VARCHAR(30) NULL,
    `hd3_high` VARCHAR(10) NULL,
    `hd3_high_state` VARCHAR(30) NULL,
    `hd4_arthritis` VARCHAR(10) NULL,
    `hd4_arthritis_state` VARCHAR(30) NULL,
    `hd5_terminally` VARCHAR(10) NULL,
    `hd5_terminally_state` VARCHAR(30) NULL,
    `hd6_unusual` VARCHAR(10) NULL,
    `hd6_unusual_state` VARCHAR(30) NULL,
    `hd7_asthma` VARCHAR(10) NULL,
    `hd7_asthma_state` VARCHAR(30) NULL,
    `hd8_fainting` VARCHAR(10) NULL,
    `hd8_fainting_state` VARCHAR(30) NULL,
    `hd9_depression` VARCHAR(10) NULL,
    `hd9_depression_state` VARCHAR(30) NULL,
    `hd10_throat` VARCHAR(10) NULL,
    `hd10_throat_state` VARCHAR(30) NULL,
    `hd11_other` VARCHAR(10) NULL,
    `hd11_other_explain` VARCHAR(200) NULL,
    `hd_page_status` VARCHAR(45) NULL,
    `hd_page_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_937`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_hr_inputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `contract_type` VARCHAR(45) NULL,
    `batch` VARCHAR(45) NULL,
    `supervisor` VARCHAR(200) NULL,
    `division` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `contract_start_date` DATETIME(0) NULL,
    `contract_end_date` DATETIME(0) NULL,
    `employment_type` VARCHAR(45) NULL,
    `job_title` VARCHAR(200) NULL,
    `tutor_line` VARCHAR(100) NULL,
    `center` VARCHAR(100) NULL,
    `approval_status` VARCHAR(45) NULL,
    `reject_reason` VARCHAR(200) NULL,
    `updated_by` VARCHAR(45) NULL,
    `updated_at` DATETIME(0) NULL,
    `approval_by` VARCHAR(45) NULL,
    `approval_at` DATETIME(0) NULL,

    INDEX `fkIdx_833`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_it_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `have_pc` VARCHAR(45) NULL,
    `pc_type` VARCHAR(45) NULL,
    `pc_type_status` VARCHAR(45) NULL,
    `pc_type_reject_reason` VARCHAR(200) NULL,
    `pc_specs` VARCHAR(200) NULL,
    `pc_url` VARCHAR(500) NULL,
    `have_headset` VARCHAR(45) NULL,
    `headset_specs` VARCHAR(200) NULL,
    `headset_url` VARCHAR(500) NULL,
    `headset_url_status` VARCHAR(45) NULL,
    `headset_url_reject_reason` VARCHAR(200) NULL,
    `primary_internet` VARCHAR(45) NULL,
    `primary_isp` VARCHAR(45) NULL,
    `secondary_internet` VARCHAR(45) NULL,
    `secondary_isp` VARCHAR(45) NULL,
    `primary_net_speed` VARCHAR(200) NULL,
    `primary_net_url` VARCHAR(500) NULL,
    `primary_net_url_status` VARCHAR(45) NULL,
    `primary_net_url_reject_reason` VARCHAR(200) NULL,
    `responsible_it_check` VARCHAR(45) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_925`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_operations_inputs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `ops__tutor_status` VARCHAR(45) NULL,
    `operation_manager` VARCHAR(200) NULL,
    `session_availability_count` VARCHAR(100) NULL,
    `updated_by` VARCHAR(45) NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `fkIdx_1021`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_personal_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `full_name` VARCHAR(200) NULL,
    `full_name_status` VARCHAR(45) NULL,
    `full_name_reject_reason` VARCHAR(200) NULL,
    `name_with_initials` VARCHAR(200) NULL,
    `name_with_initials_status` VARCHAR(45) NULL,
    `name_with_initials_reject_reason` VARCHAR(200) NULL,
    `first_name` VARCHAR(45) NULL,
    `first_name_status` VARCHAR(45) NULL,
    `first_name_reject_reason` VARCHAR(200) NULL,
    `surname` VARCHAR(45) NULL,
    `surname_status` VARCHAR(45) NULL,
    `surname_reject_reason` VARCHAR(200) NULL,
    `gender` VARCHAR(45) NULL,
    `dob` DATE NULL,
    `dob_status` VARCHAR(45) NULL,
    `dob_reject_reason` VARCHAR(100) NULL,
    `birth_certificate_url` VARCHAR(500) NULL,
    `birth_certificate_url_status` VARCHAR(45) NULL,
    `birth_certificate_url_reject_reason` VARCHAR(200) NULL,
    `religion` VARCHAR(45) NULL,
    `marital_state` VARCHAR(45) NULL,
    `spouse_name` VARCHAR(200) NULL,
    `have_children` VARCHAR(45) NULL,
    `nic` VARCHAR(45) NULL,
    `nic_status` VARCHAR(45) NULL,
    `nic_reject_reason` VARCHAR(200) NULL,
    `nic_url` VARCHAR(500) NULL,
    `nic_url_status` VARCHAR(45) NULL,
    `nic_url_reject_reason` VARCHAR(200) NULL,
    `have_affiliations` VARCHAR(45) NULL,
    `short_name` VARCHAR(200) NULL,
    `age` INTEGER NULL,
    `pp_url` VARCHAR(500) NULL,
    `pp_url_status` VARCHAR(45) NULL,
    `pp_url_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,

    UNIQUE INDEX `hris_personal_data_tsp_id_key`(`tsp_id`),
    INDEX `fkIdx_411`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_progress` (
    `user_id` INTEGER NOT NULL,
    `personal_data_emp` INTEGER NULL DEFAULT 0,
    `personal_data_auditor` INTEGER NULL DEFAULT 0,
    `personal_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `contact_data_emp` INTEGER NULL DEFAULT 0,
    `contact_data_auditor` INTEGER NULL DEFAULT 0,
    `contact_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `education_data_emp` INTEGER NULL DEFAULT 0,
    `education_data_auditor` INTEGER NULL DEFAULT 0,
    `education_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `qualifications_data_emp` INTEGER NULL DEFAULT 0,
    `qualifications_data_auditor` INTEGER NULL DEFAULT 0,
    `qualifications_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `work_exp_emp` INTEGER NULL DEFAULT 0,
    `work_exp_auditor` INTEGER NULL DEFAULT 0,
    `work_exp_sidebar_prog` INTEGER NULL DEFAULT 0,
    `availability_data_emp` INTEGER NULL DEFAULT 0,
    `availability_data_auditor` INTEGER NULL DEFAULT 0,
    `availability_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `it_data_emp` INTEGER NULL DEFAULT 0,
    `it_data_auditor` INTEGER NULL DEFAULT 0,
    `it_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `bank_data_emp` INTEGER NULL DEFAULT 0,
    `bank_data_auditor` INTEGER NULL DEFAULT 0,
    `bank_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `health_data_emp` INTEGER NULL DEFAULT 0,
    `health_data_auditor` INTEGER NULL DEFAULT 0,
    `health_data_sidebar_prog` INTEGER NULL DEFAULT 0,
    `right2work_info_emp` INTEGER NULL DEFAULT 0,
    `right2work_info_auditor` INTEGER NULL DEFAULT 0,
    `right2work_info_sidebar_prog` INTEGER NULL DEFAULT 0,
    `submited_at` DATETIME(0) NULL,
    `tutor_status` VARCHAR(45) NULL,
    `employee_status` VARCHAR(45) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_qualifications` (
    `record_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `type` VARCHAR(45) NOT NULL,
    `edu_status` VARCHAR(45) NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FK_970`(`tsp_id`),
    PRIMARY KEY (`record_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_qualifications_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `hq_course_type` VARCHAR(100) NULL,
    `hq_course_type_status` VARCHAR(45) NULL,
    `hq_course_type_reject_reason` VARCHAR(200) NULL,
    `hq_field_study` VARCHAR(100) NULL,
    `hq_field_study_status` VARCHAR(45) NULL,
    `hq_field_study_reject_reason` VARCHAR(200) NULL,
    `hq_has_completed` VARCHAR(45) NULL,
    `hq_has_completed_status` VARCHAR(45) NULL,
    `hq_has_completed_reject_reason` VARCHAR(200) NULL,
    `hq_start_year` INTEGER NULL,
    `hq_start_year_status` VARCHAR(45) NULL,
    `hq_start_year_reject_reason` VARCHAR(200) NULL,
    `hq_completion_year` INTEGER NULL,
    `hq_completion_year_status` VARCHAR(45) NULL,
    `hq_completion_year_reject_reason` VARCHAR(200) NULL,
    `hq_is_local` VARCHAR(100) NULL,
    `hq_is_local_status` VARCHAR(45) NULL,
    `hq_is_local_reject_reason` VARCHAR(200) NULL,
    `hq_main_inst` VARCHAR(200) NULL,
    `hq_main_inst_status` VARCHAR(45) NULL,
    `hq_main_inst_reject_reason` VARCHAR(200) NULL,
    `hq_affi_inst` VARCHAR(200) NULL,
    `hq_affi_inst_status` VARCHAR(45) NULL,
    `hq_affi_inst_reject_reason` VARCHAR(200) NULL,
    `hq_doc_url` VARCHAR(500) NULL,
    `hq_doc_url_status` VARCHAR(45) NULL,
    `hq_doc_url_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_920`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_right2work_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `contract_url` VARCHAR(500) NULL,
    `contract_url_status` VARCHAR(45) NULL,
    `contract_url_reject_reason` VARCHAR(200) NULL,
    `gs_issued_date` DATE NULL,
    `gs_url` VARCHAR(500) NULL,
    `gs_url_status` VARCHAR(45) NULL,
    `gs_url_reject_reason` VARCHAR(200) NULL,
    `pcc_issued_date` DATE NULL,
    `pcc_reference_no` VARCHAR(45) NULL,
    `pcc_url` VARCHAR(500) NULL,
    `pcc_url_status` VARCHAR(45) NULL,
    `pcc_url_reject_reason` VARCHAR(200) NULL,
    `pcc_expire_date` DATE NULL,
    `pcc_state` VARCHAR(45) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_1570`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_sign_up_data` (
    `tsp_id` INTEGER NOT NULL,
    `first_name` VARCHAR(200) NOT NULL,
    `last_name` VARCHAR(200) NOT NULL,
    `other_name` VARCHAR(200) NULL,
    `contact_no` VARCHAR(45) NULL,
    `dob` DATE NOT NULL,
    `nationality` VARCHAR(45) NULL,
    `country` VARCHAR(45) NULL,
    `bank` VARCHAR(100) NULL,
    `submit_status` INTEGER NULL,
    `score` INTEGER NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FK_946`(`tsp_id`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hris_work_exp_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tsp_id` INTEGER NOT NULL,
    `have_pre_tsg` VARCHAR(45) NULL,
    `have_pre_tsg_status` VARCHAR(45) NULL,
    `have_pre_tsg_reject_reason` VARCHAR(200) NULL,
    `pre_tsg_type` VARCHAR(100) NULL,
    `pre_tsg_start` DATE NULL,
    `pre_tsg_end` DATE NULL,
    `is_currently_employed` VARCHAR(45) NULL,
    `is_currently_employed_status` VARCHAR(45) NULL,
    `is_currently_employed_reject_reason` VARCHAR(200) NULL,
    `current_emp_name` VARCHAR(200) NULL,
    `current_emp_type` VARCHAR(100) NULL,
    `current_emp_title` VARCHAR(200) NULL,
    `current_emp_start` DATE NULL,
    `current_emp_teaching` VARCHAR(45) NULL,
    `current_emp_doc_url` VARCHAR(500) NULL,
    `current_emp_doc_url_status` VARCHAR(45) NULL,
    `current_emp_doc_url_reject_reason` VARCHAR(200) NULL,
    `acknowledgment_check` VARCHAR(45) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL,
    `audited_by` SMALLINT NULL,
    `audited_at` DATETIME(0) NULL,
    `record_approved` VARCHAR(45) NULL,

    INDEX `fkIdx_566`(`tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tm_approved_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_tsp_id` INTEGER NOT NULL,
    `employee_status` VARCHAR(45) NULL,
    `movement_type` VARCHAR(45) NULL,
    `sub_status` VARCHAR(45) NULL,
    `status_description` VARCHAR(200) NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,

    INDEX `FK_95`(`tutor_tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tm_master_tb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_tsp_id` INTEGER NOT NULL,
    `movement_type` VARCHAR(45) NULL,
    `supervisor_tsp_id` INTEGER NULL,
    `supervisor_name` VARCHAR(45) NULL,
    `resignation_reason` VARCHAR(200) NULL,
    `resignation_given_date` DATE NULL,
    `return_date` DATE NULL,
    `description` VARCHAR(200) NULL,
    `ac_name` VARCHAR(100) NULL,
    `ac_tsp_id` INTEGER NULL,
    `department` VARCHAR(100) NULL,
    `tutor_line` VARCHAR(100) NULL,
    `division` VARCHAR(100) NULL,
    `session_capacity` VARCHAR(100) NULL,
    `effective_date` DATE NULL,
    `document` VARCHAR(500) NULL,
    `comment` VARCHAR(500) NULL,
    `m1_approval` VARCHAR(45) NULL,
    `l1_approval` VARCHAR(45) NULL,
    `l2_approval` VARCHAR(45) NULL,
    `reject_reason` VARCHAR(200) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(100) NULL,
    `m1_at` DATETIME(0) NULL,
    `m1_by` VARCHAR(100) NULL,
    `l1_at` DATETIME(0) NULL,
    `l1_by` VARCHAR(100) NULL,
    `l2_at` DATETIME(0) NULL,
    `l2_by` VARCHAR(100) NULL,

    INDEX `FK_43`(`tutor_tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tm_withdrawal_tb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_tsp_id` INTEGER NOT NULL,
    `withdrawal_type` VARCHAR(45) NULL,
    `withdrawal_date` DATE NULL,
    `reason` VARCHAR(200) NULL,
    `next_status` VARCHAR(100) NULL,
    `effective_date` DATE NULL,
    `document` VARCHAR(500) NULL,
    `comment` VARCHAR(500) NULL,
    `m1_approval` VARCHAR(45) NULL,
    `l1_approval` VARCHAR(45) NULL,
    `l2_approval` VARCHAR(45) NULL,
    `reject_reason` VARCHAR(200) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(100) NULL,
    `m1_at` DATETIME(0) NULL,
    `m1_by` VARCHAR(100) NULL,
    `l1_at` DATETIME(0) NULL,
    `l1_by` VARCHAR(100) NULL,
    `l2_at` DATETIME(0) NULL,
    `l2_by` VARCHAR(100) NULL,

    INDEX `FK_72`(`tutor_tsp_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `tsp_id` INTEGER NOT NULL,
    `username` VARCHAR(200) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `level` INTEGER NULL,
    `last_login_at` TIMESTAMP(0) NULL,
    `last_logout_at` TIMESTAMP(0) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`tsp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xfamily_affiliations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pd_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `affiliate_name` VARCHAR(200) NULL,
    `affiliate_relationship` VARCHAR(45) NULL,
    `affiliate_job` VARCHAR(100) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fkIdx_705`(`pd_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xother_quali_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `q_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `local_id` INTEGER NULL,
    `course_type` VARCHAR(100) NULL,
    `course_type_status` VARCHAR(45) NULL,
    `course_type_reject_reason` VARCHAR(200) NULL,
    `field_study` VARCHAR(100) NULL,
    `field_study_status` VARCHAR(45) NULL,
    `field_study_reject_reason` VARCHAR(200) NULL,
    `has_completed` VARCHAR(45) NULL,
    `has_completed_status` VARCHAR(45) NULL,
    `has_completed_reject_reason` VARCHAR(200) NULL,
    `start_year` INTEGER NULL,
    `start_year_status` VARCHAR(45) NULL,
    `start_year_reject_reason` VARCHAR(200) NULL,
    `completion_year` INTEGER NULL,
    `completion_year_status` VARCHAR(45) NULL,
    `completion_year_reject_reason` VARCHAR(200) NULL,
    `is_local` VARCHAR(45) NULL,
    `is_local_status` VARCHAR(45) NULL,
    `is_local_reject_reason` VARCHAR(200) NULL,
    `main_inst` VARCHAR(200) NULL,
    `main_inst_status` VARCHAR(45) NULL,
    `main_inst_reject_reason` VARCHAR(200) NULL,
    `affi_inst` VARCHAR(200) NULL,
    `affi_inst_status` VARCHAR(45) NULL,
    `affi_inst_reject_reason` VARCHAR(200) NULL,
    `doc_url` VARCHAR(500) NULL,
    `doc_url_status` VARCHAR(45) NULL,
    `doc_url_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fkIdx_1474`(`q_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xother_work_exp_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `we_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `local_id` INTEGER NULL,
    `employer_name` VARCHAR(100) NULL,
    `employment_type` VARCHAR(100) NULL,
    `job_title` VARCHAR(100) NULL,
    `currently_employed` VARCHAR(20) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `teaching_exp` VARCHAR(20) NULL,
    `doc_url` VARCHAR(200) NULL,
    `doc_url_status` VARCHAR(45) NULL,
    `doc_url_reject_reason` VARCHAR(200) NULL,
    `updated_by` SMALLINT NULL,
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fkIdx_1202`(`we_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_register` (
    `email` VARCHAR(250) NOT NULL,
    `otp` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `otp_register_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `approved_bank_data` ADD CONSTRAINT `FK_1272` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_contact_data` ADD CONSTRAINT `FK_994` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_contract_data` ADD CONSTRAINT `FK_1767` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_education_data` ADD CONSTRAINT `FK_1098` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_health_data` ADD CONSTRAINT `FK_936_clone` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_it_data` ADD CONSTRAINT `FK_1243` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_personal_data` ADD CONSTRAINT `FK_770` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_qualifications_data` ADD CONSTRAINT `FK_919_clone` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_right2work_data` ADD CONSTRAINT `FK_1578` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_work_exp_data` ADD CONSTRAINT `FK_1195` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_xother_quali_data` ADD CONSTRAINT `FK_1594` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approved_xother_work_exp_data` ADD CONSTRAINT `FK_1639` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_academic_inputs` ADD CONSTRAINT `FK_1007` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_access` ADD CONSTRAINT `FK_940` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_assigned_auditor` ADD CONSTRAINT `FK_1029` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_audited_data` ADD CONSTRAINT `FK_1317` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_bank_data` ADD CONSTRAINT `FK_932` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_contact_data` ADD CONSTRAINT `FK_464` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_education_data` ADD CONSTRAINT `FK_529` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_health_data` ADD CONSTRAINT `FK_936` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_hr_inputs` ADD CONSTRAINT `FK_832` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_it_data` ADD CONSTRAINT `FK_924` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_operations_inputs` ADD CONSTRAINT `FK_1020` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_personal_data` ADD CONSTRAINT `FK_410` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_qualifications` ADD CONSTRAINT `FK_968` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_qualifications_data` ADD CONSTRAINT `FK_919` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_right2work_data` ADD CONSTRAINT `FK_1569` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_sign_up_data` ADD CONSTRAINT `FK_944` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hris_work_exp_data` ADD CONSTRAINT `FK_565` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tm_approved_status` ADD CONSTRAINT `FK_93` FOREIGN KEY (`tutor_tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tm_master_tb` ADD CONSTRAINT `FK_41` FOREIGN KEY (`tutor_tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tm_withdrawal_tb` ADD CONSTRAINT `FK_70` FOREIGN KEY (`tutor_tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `xfamily_affiliations` ADD CONSTRAINT `FK_704` FOREIGN KEY (`pd_id`) REFERENCES `hris_personal_data`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `xother_quali_data` ADD CONSTRAINT `FK_1473` FOREIGN KEY (`q_id`) REFERENCES `hris_qualifications_data`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `xother_work_exp_data` ADD CONSTRAINT `FK_1201` FOREIGN KEY (`we_id`) REFERENCES `hris_work_exp_data`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
