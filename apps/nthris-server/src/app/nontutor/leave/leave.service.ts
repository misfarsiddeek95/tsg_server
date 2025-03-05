import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLeaveDto,
  LeaveUserDto,
  LeaveDateDto,
  CancelLeaveDto,
  UpdateLeaveDto,
  SummaryFilterDto,
  CalendarFilterDto,
  LeaveQuotaDto,
  LeaveCalendarDateDto
} from './leave.dto';
import moment from 'moment';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class LeaveService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async metaData(userId: number) {
    try {
      const fetchMetadata = async (metaType: string) => {
        return await this.prisma.nTHRISLeaveMeta.findMany({
          where: {
            metaType: metaType
          },
          select: {
            metaName: true,
            metaValue: true
          }
        });
      };

      const userLeavePolicies =
        await this.prisma.nTHRISLeaveEntitlements.findMany({
          where: {
            tsp_id: userId
          },
          select: {
            policy_id: true,
            leavePolicy: {
              select: {
                policy_name: true,
                short_title: true
              }
            }
          }
        });

      const leavePolicies = await this.prisma.nTHRISLeavePolicies.findMany({
        where: {
          status: 1
        },
        select: {
          hr_policy_id: true,
          policy_name: true
        }
      });

      const holidayTypes = await this.prisma.holidaysType.findMany({
        select: {
          id: true,
          holiday_type: true,
          color_code: true
        }
      });

      const leaveDurations = await fetchMetadata('leave_duration');
      const leaveReasons = await fetchMetadata('leave_reason');
      const cancelReasons = await fetchMetadata('cancel_reason');
      const leaveShifts = await fetchMetadata('leave_shift');
      const leaveStates = await fetchMetadata('leave_status');
      const yearStart = await fetchMetadata('year_start');
      const yearEnd = await fetchMetadata('year_end');

      const metaData = {
        userLeavePolicies,
        leavePolicies,
        leaveDurations,
        leaveReasons,
        cancelReasons,
        leaveShifts,
        leaveStates,
        holidayTypes,
        yearStart,
        yearEnd
      };
      return { success: true, data: metaData };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async searchUser(userId: number, qS: string) {
    try {
      const data = await this.prisma.nonTutorDirectory.findMany({
        select: {
          hr_tsp_id: true,
          short_name: true,
          tsg_email: true
        },
        where: {
          supervisor_id: userId,
          short_name: {
            startsWith: qS
          }
        },
        orderBy: {
          short_name: 'asc'
        },
        take: 10
      });
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async holidays(userId: number) {
    try {
      const query = `
      SELECT
          DATE_FORMAT(A.effective_date, '%Y-%m-%d') AS holiday,
          A.description,
          A.holidays_type_id AS type_id,
          B.holiday_type,
          B.color_code,
          CASE
              WHEN A.country = 'indian' AND A.holidays_type_id = 1 THEN CAST(3 AS CHAR)
              WHEN A.country = 'srilankan' AND A.holidays_type_id = 1 THEN CAST(2 AS CHAR)
              WHEN A.country = 'srilankan' AND A.holidays_type_id != 1  THEN CAST(1 AS CHAR)
              ELSE CAST(0 AS CHAR)
          END AS calendar_type
      FROM
          calendar A
      LEFT JOIN
          holidays_type B ON A.holidays_type_id = B.id
      WHERE
          A.holidays_type_id NOT IN (5, 7)
      ORDER BY
          holiday;
      `;
      const data: {
        holiday: string;
        type_id: number;
        description: string;
        holiday_type: string;
        color_code: string;
        calendar_type: string;
      }[] = await this.prisma.$queryRawUnsafe(query);

      const convertedData = data.map((obj) => ({
        ...obj,
        calendar_type: parseInt(obj.calendar_type, 10)
      }));
      return { success: true, data: convertedData };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async leave_holidays(userId: number) {
    try {
      const query = `SELECT DATE_FORMAT(A.effective_date, '%Y-%m-%d') AS holiday, 
      A.description, A.holidays_type_id AS type_id, B.holiday_type 
      FROM calendar A 
      LEFT JOIN holidays_type B ON A.holidays_type_id = B.id 
      WHERE A.country = 'srilankan' 
      AND A.holidays_type_id IN(2) 
      ORDER BY holiday`;
      const data: {
        holiday: string;
        description: string;
        id_type: number;
        holiday_type: string;
      }[] = await this.prisma.$queryRawUnsafe(query);
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async validateDates(
    userId: number,
    leaveType: number,
    leaveDuration: string,
    fromDate?: string,
    toDate?: string
  ) {
    try {
      const result = { success: true, message: '' };
      const sD = fromDate ? moment.utc(fromDate).format('YYYY-MM-DD') : '';
      const eD = toDate ? moment.utc(toDate).format('YYYY-MM-DD') : '';
      const query = `SELECT COUNT(id) as num
      FROM calendar 
      WHERE country = 'srilankan' 
        AND holidays_type_id IN(2) 
        AND DATE_FORMAT(effective_date, '%Y-%m-%d') IN(DATE('${sD}'), DATE('${eD}'))`;
      const data = await this.prisma.$queryRawUnsafe(query);
      if (Number(data[0].num) > 0) {
        result.success = false;
        result.message = 'Selected dates contain holidays';
      } else {
        let num_of_days = 0.0;
        const leaveDates = await this.getNumOfDays(userId, fromDate, toDate);
        if (leaveDuration) {
          if (leaveDuration == 'Full Day') {
            num_of_days = leaveDates.length;
          } else {
            num_of_days = 0.5;
            if (leaveDates.length > 1) {
              result.success = false;
              result.message = 'Selected Duration is invalid';
            }
          }
        }
        let durationArray = [];
        if (leaveDuration == 'Second Half') {
          durationArray = ['Full Day', 'Second Half'];
        } else if (leaveDuration == 'First Half') {
          durationArray = ['Full Day', 'First Half'];
        } else {
          durationArray = ['Full Day', 'First Half', 'Second Half'];
        }
        const query1 = `SELECT SUM(IF(
          (from_date IN(${leaveDates}) OR to_date IN(${leaveDates})) 
          AND tsp_id = ${userId} 
          AND leave_duration IN('${durationArray.join("','")}')
          AND status IN(0,1,2,5), num_of_days, 0)
        ) as num
        FROM nthris_leave_applications`;
        const applied = await this.prisma.$queryRawUnsafe(query1);
        if (applied[0].num > 0) {
          result.success = false;
          result.message = 'Already applied leaves within selected dates';
        } else {
          const query2 = `SELECT
          SUM(IF(status IN(0,1,2,5) 
            AND tsp_id = ${userId} 
            AND leave_policy_id = ${leaveType}, (num_of_days), 0)) 
          AS utilised
          FROM nthris_leave_applications`;
          const data2 = await this.prisma.$queryRawUnsafe(query2);
          // console.log(data2);
          const used = Number(data2[0].utilised) + num_of_days;
          const query3 = `SELECT allocated_days
            FROM nthris_leave_entitlements
            WHERE tsp_id = ${userId} AND policy_id = ${leaveType}`;
          const data3: [{ allocated_days: number }] =
            await this.prisma.$queryRawUnsafe(query3);
          let available = 0;
          if (data3.length > 0) {
            available = Number(data3[0].allocated_days);
          }
          if (used > available) {
            result.success = false;
            result.message = 'Exceeds allocated number of leaves';
          }
        }
      }
      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async selfApplications(userId: number) {
    try {
      const data = await this.prisma.nTHRISLeaveApplications.findMany({
        where: {
          tspId: userId
        },
        select: {
          id: true,
          managerId: true,
          appliedDate: true,
          leavePolicyId: true,
          leaveDuration: true,
          shift: true,
          fromDate: true,
          toDate: true,
          numOfDays: true,
          reason: true,
          status: true,
          cancelRequestDate: true,
          cancelRequestReason: true,
          rejectApproveDate: true,
          createdAt: true,
          updatedAt: true,
          leavePolicy: {
            select: {
              policy_name: true
            }
          },
          leaveUser: {
            select: {
              short_name: true
            }
          },
          leaveDates: {
            select: {
              leaveDate: true
            }
          }
        },
        orderBy: {
          appliedDate: 'desc'
        }
      });
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async selfSummary(userId: number) {
    try {
      const query = `SELECT 
        LE.allocated_days, 
        LE.policy_id, 
        LP.policy_name,
        LP.short_title
      FROM nthris_leave_entitlements LE 
      LEFT JOIN nthris_leave_policies LP ON LE.policy_id = LP.hr_policy_id 
      WHERE tsp_id = ${userId};`;
      const data: any = await this.prisma.$queryRawUnsafe(query);
      const summary: any = [];
      await Promise.all(
        data.map(async (rec: any) => {
          const query2 = `SELECT
            SUM(IF(status IN(2,5) AND tsp_id = ${userId} AND leave_policy_id = ${Number(
            rec.policy_id
          )}, (num_of_days), 0)) AS utilised,
            SUM(IF(status NOT IN(2,3,4,5) AND tsp_id = ${userId} AND leave_policy_id = ${Number(
            rec.policy_id
          )}, (num_of_days), 0)) AS pending
          FROM nthris_leave_applications`;
          const data2: { utilised: number; pending: number } =
            await this.prisma.$queryRawUnsafe(query2);
          rec.utilised = data2[0].utilised;
          rec.pending = data2[0].pending;
          summary.push(rec);
        })
      );
      return { success: true, data: summary };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async getLineManagers(userId: number) {
    try {
      const query1 = `WITH recursive emp_level AS
      (SELECT hr_tsp_id 
        FROM non_tutor_directory WHERE hr_tsp_id = ${userId}
        UNION
        SELECT N.hr_tsp_id
        FROM emp_level L
        JOIN non_tutor_directory N ON L.hr_tsp_id = N.supervisor_id 
      )
      SELECT * FROM emp_level;`;
      const data1: any = await this.prisma.$queryRawUnsafe(query1);
      const hrTspIds: string = data1.map((item) => item.hr_tsp_id).join(',');
      //console.log(hrTspIds);
      const query = `SELECT
          hr_tsp_id, short_name
      FROM
          non_tutor_directory
      WHERE hr_tsp_id IN(${hrTspIds})
      ;`;
      //console.log(query);
      const data: any = await this.prisma.$queryRawUnsafe(query);
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async getLeaveQuota(nonTutorId: number) {
    try {
      const query = `SELECT
          LE.tsp_id AS tspId,
          NT.short_name AS name,
          MAX(CASE WHEN LE.policy_id = 1 THEN LE.allocated_days ELSE 0 END) as annualAllocated,
          MAX(CASE WHEN LE.policy_id = 2 THEN LE.allocated_days ELSE 0 END) as casualAllocated,
          MAX(CASE WHEN LE.policy_id = 3 THEN LE.allocated_days ELSE 0 END) as medicalAllocated,
          MAX(CASE WHEN LE.policy_id = 20 THEN LE.allocated_days ELSE 0 END) as anpAllocated,
          MAX(CASE WHEN LE.policy_id = 4 THEN LE.allocated_days ELSE 0 END) as unpAllocated,
          MAX(CASE WHEN LE.policy_id = 24 THEN LE.allocated_days ELSE 0 END) as lieuAllocated,
          MAX(CASE WHEN LE.policy_id = 23 THEN LE.allocated_days ELSE 0 END) as specialAllocated,
          MAX(CASE WHEN LE.policy_id = 21 THEN LE.allocated_days ELSE 0 END) as maternityAllocated,
          MAX(CASE WHEN LE.policy_id = 22 THEN LE.allocated_days ELSE 0 END) as paternityAllocated
      FROM
          nthris_leave_entitlements LE
      LEFT JOIN
          non_tutor_directory NT ON LE.tsp_id = NT.hr_tsp_id
      WHERE 
          LE.tsp_id = ${nonTutorId}
      GROUP BY 
          LE.tsp_id;`;
      //console.log(query);
      const data: any = await this.prisma.$queryRawUnsafe(query);
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async saveLeaveQuota(userId: number, quota: LeaveQuotaDto) {
    try {
      const policies = {
        1: 'annualAllocated',
        2: 'casualAllocated',
        3: 'medicalAllocated',
        4: 'unpAllocated',
        20: 'anpAllocated',
        24: 'lieuAllocated',
        23: 'specialAllocated',
        21: 'maternityAllocated',
        22: 'paternityAllocated'
      };
      const { tspId, ...allocations } = quota;
      const result = {};
      for (const policyId in policies) {
        const allocationType = policies[policyId];
        const allocationValue = allocations[allocationType];

        if (allocationValue && allocationValue !== 0) {
          result[policyId] = allocationValue;
        }
      }
      await this.prisma.nTHRISLeaveEntitlements.deleteMany({
        where: {
          tsp_id: tspId
        }
      });
      for (const policyId in result) {
        const allocatedDays = result[policyId];

        await this.prisma.nTHRISLeaveEntitlements.create({
          data: {
            tsp_id: tspId,
            policy_id: parseInt(policyId),
            allocated_days: allocatedDays,
            created_by: userId
          }
        });
      }
      return { success: true, data: quota };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async saveApplication(userId: number, application: CreateLeaveDto) {
    try {
      const applicantId = application.tspId ? application.tspId : userId;
      const managerData: LeaveUserDto = await this.getManagerData(applicantId);
      let num_of_days = 0.5;
      const result = await this.getNumOfDays(
        applicantId,
        application.fromDate,
        application.toDate
      );
      const leaveDates: Array<LeaveDateDto> = [];
      await Promise.all(
        result.map((day) => {
          leaveDates.push({
            leaveDate: moment.utc(day, 'YYYY-MM-DD').toISOString()
          });
        })
      );
      if (application.leaveDuration == 'Full Day') {
        num_of_days = result.length;
      }
      const leave_application =
        await this.prisma.nTHRISLeaveApplications.create({
          data: {
            managerId: managerData.tspId,
            tspId: applicantId,
            appliedDate: new Date(application.appliedDate),
            leavePolicyId: application.leavePolicyId,
            leaveDuration: application.leaveDuration,
            shift: application.shift,
            shiftDuration: application.shift + '-' + application.leaveDuration,
            fromDate: new Date(application.fromDate),
            toDate: new Date(application.toDate),
            numOfDays: num_of_days,
            reason: application.reason,
            status: 0,
            leaveDates: {
              create: leaveDates
            }
          }
        });
      const leaveData = await this.getLeaveData(leave_application.id);
      //console.log(managerData);
      //console.log(leaveData);
      await this.mailService.sendLeaveApplicationEmail(managerData, leaveData);
      return { success: true, data: leave_application };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async cancelApplication(userId: number, application: CancelLeaveDto) {
    try {
      const data = await this.prisma.nTHRISLeaveApplications.update({
        where: {
          id: application.applicationId
        },
        data: {
          status: 1,
          cancelRequestDate: new Date(),
          cancelRequestReason: application.cancelReason
        }
      });
      const leaveData = await this.getLeaveData(application.applicationId);
      const managerData = await this.getManagerData(userId);
      await this.mailService.sendLeaveCancelEmail(managerData, leaveData);
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async userApplications(params: any) {
    try {
      const start = (Number(params.page) - 1) * Number(params.perPage);
      let query = `SELECT A.*, B.short_name 
      FROM nthris_leave_applications A
      LEFT JOIN non_tutor_directory B ON A.tsp_id = B.hr_tsp_id 
      WHERE A.manager_id = ${params.userId} `;
      if (params.searchName) {
        query += `AND B.short_name LIKE('${params.searchName}%') `;
      }
      if (params.startDate) {
        query += `AND A.from_date >= '${params.startDate}' `;
      }
      if (params.endDate) {
        query += `AND A.to_date <= '${params.endDate}' `;
      }
      if (params.leaveTypes && params.leaveTypes.length != 0) {
        query += `AND A.leave_policy_id IN(${params.leaveTypes.toString()}) `;
      }
      if (params.leaveStatus && params.leaveStatus.length != 0) {
        query += `AND A.status IN(${params.leaveStatus.toString()}) `;
      }
      if (params.leaveDurations && params.leaveDurations.length != 0) {
        const result = params.leaveDurations
          .map((a) => JSON.stringify(a))
          .join();
        query += `AND A.shift_duration IN(${result}) `;
      }
      // console.log(query);
      const rows: Array<object> = await this.prisma.$queryRawUnsafe(query);
      query += `ORDER BY status 
      LIMIT ${start},${params.perPage}`;

      const data = await this.prisma.$queryRawUnsafe(query);
      const result = {
        applications: data,
        total: rows.length
      };
      return { success: true, data: result };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async updateApplications(leaveUpdate: UpdateLeaveDto) {
    try {
      const data = await this.prisma.nTHRISLeaveApplications.updateMany({
        where: {
          id: {
            in: leaveUpdate.applicationIds
          }
        },
        data: {
          status: leaveUpdate.action,
          rejectApproveDate: new Date()
        }
      });
      await Promise.all(
        leaveUpdate.applicationIds.map(async (id: number) => {
          const leaveData = await this.getLeaveData(id);
          const userData = await this.getUserData(leaveData.tsp_id);
          await this.mailService.sendLeaveUpdateEmail(
            userData,
            leaveData,
            leaveUpdate.action
          );
        })
      );
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  // async leaveSummaryTest(params: SummaryFilterDto) {
  //   try {
  //     const query = `WITH recursive emp_level AS
  //     (SELECT hr_tsp_id
  //       FROM non_tutor_directory WHERE hr_tsp_id = 2
  //       UNION
  //       SELECT N.hr_tsp_id
  //       FROM emp_level L
  //       JOIN non_tutor_directory N ON L.hr_tsp_id = N.supervisor_id
  //     )
  //     SELECT * FROM emp_level;`;
  //     const data: any = await this.prisma.$queryRawUnsafe(query);
  //     const hrTspIds: string = data.map((item) => item.hr_tsp_id).join(',');
  //     return {
  //       success: true,
  //       data: hrTspIds,
  //       total: 0
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         error: error.message
  //       },
  //       400
  //     );
  //   }
  // }

  async leaveSummary(params: SummaryFilterDto, tspId: number) {
    try {
      const query1 = `WITH recursive emp_level AS
      (SELECT hr_tsp_id 
        FROM non_tutor_directory WHERE hr_tsp_id = ${tspId}
        UNION
        SELECT N.hr_tsp_id
        FROM emp_level L
        JOIN non_tutor_directory N ON L.hr_tsp_id = N.supervisor_id 
      )
      SELECT * FROM emp_level;`;
      const data1: any = await this.prisma.$queryRawUnsafe(query1);
      const hrTspIds: string = data1.map((item) => item.hr_tsp_id).join(',');
      //console.log(hrTspIds);
      const query = `SELECT
          LE.tsp_id AS tspId,
          NT.short_name AS name,
          NT.supervisor AS lineManager,
          COUNT(case when LA.leave_policy_id=1 and LA.status IN(2,5) then 1 end) AS annual_used,
          COUNT(case when LA.leave_policy_id=2 and LA.status IN(2,5) then 1 end) AS casual_used,
          COUNT(case when LA.leave_policy_id=3 and LA.status IN(2,5) then 1 end) AS medical_used,
          COUNT(case when LA.leave_policy_id=20 and LA.status IN(2,5) then 1 end) AS anp_used,
          COUNT(case when LA.leave_policy_id=21 and LA.status IN(2,5) then 1 end) AS unp_used,
          COUNT(case when LA.leave_policy_id=22 and LA.status IN(2,5) then 1 end) AS lieu_used,
          COUNT(case when LA.leave_policy_id=23 and LA.status IN(2,5) then 1 end) AS special_used,
          COUNT(case when LA.leave_policy_id=24 and LA.status IN(2,5) then 1 end) AS parental_used,
          CONCAT('{', GROUP_CONCAT(CONCAT('"', LE.policy_id, '":', LE.allocated_days) SEPARATOR ', '), '}') AS leaves
      FROM
          nthris_leave_entitlements LE
      LEFT JOIN
          non_tutor_directory NT ON LE.tsp_id = NT.hr_tsp_id
      LEFT JOIN 
          nthris_leave_applications LA ON LE.tsp_id = LA.tsp_id
      WHERE LE.tsp_id IN(${hrTspIds})
      GROUP BY
          LE.tsp_id;`;
      //console.log(query);
      const data: any = await this.prisma.$queryRawUnsafe(query);
      //console.log(data);
      const convertedData: Promise<any>[] = data.map(async (obj) => {
        const leaves = JSON.parse(obj.leaves);

        return {
          tspId: obj.tspId,
          name: obj.name,
          lineManager: obj.lineManager,
          annualAllocated: leaves[1] ? leaves[1] : 0,
          annualPending: leaves[1] ? Number(obj.annual_used) : 0,
          annualRemaining: leaves[1] ? leaves[1] - Number(obj.annual_used) : 0,
          casualAllocated: leaves[2] ? leaves[2] : 0,
          casualPending: leaves[2] ? Number(obj.casual_used) : 0,
          casualRemaining: leaves[2] ? leaves[2] - Number(obj.casual_used) : 0,
          medicalAllocated: leaves[3] ? leaves[3] : 0,
          medicalPending: leaves[3] ? Number(obj.medical_used) : 0,
          medicalRemaining: leaves[3]
            ? leaves[3] - Number(obj.medical_used)
            : 0,
          anpAllocated: leaves[20] ? leaves[20] : 0,
          anpPending: leaves[20] ? Number(obj.anp_used) : 0,
          anpRemaining: leaves[20] ? leaves[20] - Number(obj.anp_used) : 0,
          unpAllocated: leaves[21] ? leaves[21] : 0,
          unpPending: leaves[21] ? Number(obj.unp_used) : 0,
          unpRemaining: leaves[21] ? leaves[21] - Number(obj.unp_used) : 0,
          lieuAllocated: leaves[22] ? leaves[22] : 0,
          lieuPending: leaves[22] ? Number(obj.lieu_used) : 0,
          lieuRemaining: leaves[22] ? leaves[22] - Number(obj.lieu_used) : 0,
          specialAllocated: leaves[23] ? leaves[23] : 0,
          specialPending: leaves[23] ? Number(obj.special_used) : 0,
          specialRemaining: leaves[23]
            ? leaves[23] - Number(obj.special_used)
            : 0,
          parentalAllocated: leaves[24] ? leaves[24] : 0,
          parentalPending: leaves[24] ? Number(obj.parental_used) : 0,
          parentalRemaining: leaves[24]
            ? leaves[24] - Number(obj.parental_used)
            : 0
        };
      });
      const resolvedConvertedData: any[] = await Promise.all(convertedData);
      return {
        success: true,
        data: resolvedConvertedData,
        total: 0
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async leaveCalendar(params: CalendarFilterDto, tspId: number) {
    try {
      const query1 = `WITH recursive emp_level AS
      (SELECT hr_tsp_id 
        FROM non_tutor_directory WHERE hr_tsp_id = ${tspId}
        UNION
        SELECT N.hr_tsp_id
        FROM emp_level L
        JOIN non_tutor_directory N ON L.hr_tsp_id = N.supervisor_id 
      )
      SELECT * FROM emp_level;`;
      const data1: any = await this.prisma.$queryRawUnsafe(query1);
      const hrTspIds: string = data1.map((item) => item.hr_tsp_id).join(',');
      //console.log(hrTspIds);
      const query = `SELECT
          LA.from_date,
          COUNT(case when LA.status IN(2,5) then 1 end) AS approved,
          COUNT(case when LA.status NOT IN(2,5) then 1 end) AS pending
      FROM
          nthris_leave_applications LA
      WHERE LA.tsp_id IN(${hrTspIds})
      GROUP BY
          LA.from_date;`;
      //console.log(query);
      const data: any = await this.prisma.$queryRawUnsafe(query);
      let n = 0;
      const convertedData: Promise<any>[] = data.map(async (obj) => {
        if (obj.pending != 0) {
          n = n + 1;
          return {
            id: n,
            calendarType: 1,
            type: 2,
            title: String(obj.pending),
            description: '',
            begin: moment.utc(obj.from_date).format('YYYY-MM-DD'),
            end: moment.utc(obj.from_date).format('YYYY-MM-DD')
          };
        }
        if (obj.approved != 0) {
          n = n + 1;
          return {
            id: n,
            calendarType: 1,
            type: 1,
            title: String(obj.approved),
            description: '',
            begin: moment.utc(obj.from_date).format('YYYY-MM-DD'),
            end: moment.utc(obj.from_date).format('YYYY-MM-DD')
          };
        }
      });
      const resolvedConvertedData: any[] = await Promise.all(convertedData);
      return {
        success: true,
        data: resolvedConvertedData
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async leaveCalendarDate(params: LeaveCalendarDateDto, tspId: number) {
    try {
      //console.log(tspId);
      const query1 = `WITH recursive emp_level AS
      (SELECT hr_tsp_id 
        FROM non_tutor_directory WHERE hr_tsp_id = ${tspId}
        UNION
        SELECT N.hr_tsp_id
        FROM emp_level L
        JOIN non_tutor_directory N ON L.hr_tsp_id = N.supervisor_id 
      )
      SELECT * FROM emp_level;`;
      const data1: any = await this.prisma.$queryRawUnsafe(query1);
      const hrTspIds: string = data1.map((item) => item.hr_tsp_id).join(',');

      let pendingLeaves = {};
      let approvedLeaves = {};
      if (hrTspIds) {
        const approved = `SELECT
            LA.tsp_id as tspId,
            LA.shift, 
            LA.leave_duration as duration,
            NT.short_name as name,
            NT.job_title as designation,
            LP.policy_name as leavePolicy
        FROM
            nthris_leave_applications LA
        LEFT JOIN
            non_tutor_directory NT ON LA.tsp_id = NT.hr_tsp_id
        LEFT JOIN
            nthris_leave_policies LP ON LA.leave_policy_id = LP.hr_policy_id
        WHERE LA.tsp_id IN(${hrTspIds})
            AND '${params.date}' BETWEEN from_date AND to_date
            AND LA.status IN(2,5);`;
        //console.log(query);
        approvedLeaves = await this.prisma.$queryRawUnsafe(approved);

        const pending = `SELECT
            LA.tsp_id as tspId,
            LA.shift, 
            LA.leave_duration as duration,
            NT.short_name as name,
            NT.job_title as designation,
            LP.policy_name as leavePolicy
        FROM
            nthris_leave_applications LA
        LEFT JOIN
            non_tutor_directory NT ON LA.tsp_id = NT.hr_tsp_id
        LEFT JOIN
            nthris_leave_policies LP ON LA.leave_policy_id = LP.hr_policy_id
        WHERE LA.tsp_id IN(${hrTspIds})
            AND '${params.date}' BETWEEN from_date AND to_date
            AND LA.status NOT IN(2,5);`;
        pendingLeaves = await this.prisma.$queryRawUnsafe(pending);
      }
      return {
        success: true,
        data: { pending: pendingLeaves, approved: approvedLeaves }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async getSubordinates(userId: number) {
    try {
      const data = await this.prisma.nonTutorDirectory.findMany({
        where: {
          supervisor_id: userId
        },
        select: {
          hr_tsp_id: true,
          preferred_name: true,
          leaveEntitlements: {
            select: {
              policy_id: true,
              allocated_days: true,
              leavePolicy: {
                select: {
                  policy_name: true
                }
              }
            }
          }
        },
        orderBy: {
          preferred_name: 'asc'
        }
      });
      return { success: true, data: data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message
        },
        400
      );
    }
  }

  async getManagerData(userId: number) {
    const query = `SELECT B.hr_tsp_id, B.supervisor_id, B.short_name, B.tsg_email 
      FROM non_tutor_directory A 
      LEFT OUTER JOIN non_tutor_directory B ON A.supervisor_id = B.hr_tsp_id 
      WHERE A.hr_tsp_id = ${userId} 
      LIMIT 1`;
    const data: [{ hr_tsp_id: number; short_name: string; tsg_email: string }] =
      await this.prisma.$queryRawUnsafe(query);
    const manager: LeaveUserDto = {
      tspId: data[0].hr_tsp_id,
      userName: data[0].short_name,
      userEmail: data[0].tsg_email
    };
    return manager;
  }

  async getUserData(userId: number) {
    const query = `SELECT hr_tsp_id, short_name, tsg_email 
      FROM non_tutor_directory  
      WHERE hr_tsp_id = ${userId} 
      LIMIT 1`;
    const data: [{ hr_tsp_id: number; short_name: string; tsg_email: string }] =
      await this.prisma.$queryRawUnsafe(query);
    const userData: LeaveUserDto = {
      tspId: data[0].hr_tsp_id,
      userName: data[0].short_name,
      userEmail: data[0].tsg_email
    };
    return userData;
  }

  async getLeaveData(applicationId: number) {
    const query = `SELECT A.*, B.short_name, B.tsg_email, C.policy_name 
      FROM nthris_leave_applications A 
      LEFT OUTER JOIN non_tutor_directory B ON A.tsp_id = B.hr_tsp_id 
      LEFT OUTER JOIN nthris_leave_policies C ON A.leave_policy_id = C.hr_policy_id
      WHERE A.id = ${applicationId} 
      LIMIT 1`;
    const data = await this.prisma.$queryRawUnsafe(query);
    return data[0];
  }

  async getNumOfDays(userId: number, fromDate: string, toDate: string) {
    const holidays: {
      holiday: string;
      description: string;
      id_type: number;
      holiday_type: string;
    }[] = (await this.leave_holidays(userId)).data;
    const start = moment.utc(fromDate);
    const end = moment.utc(toDate);
    const result = [];
    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      const currentDay = current.format('dddd');
      if (
        holidays.filter(
          (e) =>
            moment.utc(e.holiday).format('YYYY-MM-DD') ==
            current.format('YYYY-MM-DD')
        ).length == 0 &&
        currentDay != 'Saturday' &&
        currentDay != 'Sunday'
      ) {
        result.push("'" + current.format('YYYY-MM-DD') + "'");
      }
      current = current.add(1, 'days');
    }
    return result;
  }
}
