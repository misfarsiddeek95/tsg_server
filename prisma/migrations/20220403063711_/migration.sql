/*
  Warnings:

  - You are about to alter the column `updated_at` on the `hris_academic_inputs` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `created_at` on the `hris_access` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - The primary key for the `hris_progress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `hris_progress` table. All the data in the column will be lost.
  - You are about to alter the column `created_at` on the `hris_qualifications` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `hris_qualifications` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `created_at` on the `hris_sign_up_data` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `hris_sign_up_data` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `created_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `updated_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to drop the `banks` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `updated_at` on table `hris_access` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tsp_id` to the `hris_progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `approved_bank_data` ADD COLUMN `bank_status` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `approved_personal_data` ADD COLUMN `nationality` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `approved_work_exp_data` ADD COLUMN `tutoring_partner` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `approved_xother_quali_data` ADD COLUMN `completion_date` DATE NULL,
    ADD COLUMN `start_date` DATE NULL;

-- AlterTable
ALTER TABLE `hris_academic_inputs` MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `hris_access` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `hris_bank_data` ADD COLUMN `bank_status` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `hris_education_data` ADD COLUMN `other` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `hris_personal_data` ADD COLUMN `nationality` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `hris_progress` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `tsp_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`tsp_id`);

-- AlterTable
ALTER TABLE `hris_qualifications` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `hris_sign_up_data` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `hris_work_exp_data` ADD COLUMN `tutoring_partner` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `flexiquiz_id` VARCHAR(100) NULL,
    MODIFY `last_login_at` DATETIME(0) NULL,
    MODIFY `last_logout_at` DATETIME(0) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `xother_quali_data` ADD COLUMN `completion_date` DATE NULL,
    ADD COLUMN `start_date` DATE NULL;

-- DropTable
DROP TABLE `banks`;

-- CreateTable
CREATE TABLE `flexiquiz_webhook_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_submitted` DATETIME(0) NULL,
    `response_id` VARCHAR(50) NULL,
    `quiz_id` VARCHAR(50) NULL,
    `quiz_name` VARCHAR(50) NULL,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `email_address` VARCHAR(50) NULL,
    `user_name` VARCHAR(50) NULL,
    `points` DOUBLE NOT NULL,
    `available_points` DOUBLE NOT NULL,
    `percentage_score` DOUBLE NOT NULL,
    `grade` VARCHAR(10) NULL,
    `pass` BOOLEAN NOT NULL,
    `duration` DOUBLE NOT NULL,
    `attempt` INTEGER NOT NULL,
    `ip_address` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stem_criteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_of_qualification` VARCHAR(100) NOT NULL,
    `category` VARCHAR(45) NULL,
    `is_stem` SMALLINT NULL,

    UNIQUE INDEX `stem_criteria_field_of_qualification_key`(`field_of_qualification`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `hris_progress_tsp_id_idx` ON `hris_progress`(`tsp_id`);

-- AddForeignKey
ALTER TABLE `hris_progress` ADD CONSTRAINT `hris_progress_tsp_id_fkey` FOREIGN KEY (`tsp_id`) REFERENCES `user`(`tsp_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
