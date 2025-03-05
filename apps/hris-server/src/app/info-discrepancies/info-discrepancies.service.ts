import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InfoDiscrepanciesService {

    constructor(private prisma: PrismaService) {}

    async allRejectedFields(userId: number) {
        try {
          const rejectedFieldsByTables = await this.prisma.$transaction(async (tx) => {
            const tables = {
              bankData: tx.hrisBankData,
              educationData: tx.hrisEducationData,
              personalData: tx.hrisPersonalData,
              contactData: tx.hrisContactData,
              rightToWorkData: tx.hrisRight2workData,
              referenceData: tx.hrisRefereeData,
              ItData: tx.hrisItData,
              healthData: tx.hrisHealthData,
              qualificationData: tx.hrisQualificationsData,
              workExperienceData: tx.hrisWorkExpData
            };

            const allTables = Object.entries(tables).map(([_, table]) => {
              return (table as any).findFirst({
                where: {
                  tspId: userId
                },
                orderBy: {
                  id: 'desc'
                }
              });
            });

            const allTableDetails = await Promise.all(allTables);

            const tableKeys = Object.keys(tables);

            const rejectedFieldsByTables = allTableDetails
              .map((table) => {
                if (table) {
                  return Object.entries(table).reduce((prev, [key, value]) => {
                    if (key.includes('Status') && value === 'rejected') {
                      const realKey = key.replace('Status', '');
                      prev[realKey] = table[realKey];
                      prev[key] = value;
                      prev[realKey + 'RejectReason'] =
                        table[realKey + 'RejectReason'];
                    }
                    return prev;
                  }, {} as any);
                } else {
                  return {};
                }
              })
              .reduce((prev, value, index) => {
                prev[tableKeys[index]] = value;
                return prev;
              }, {} as any);

            //remove any tables with no reject reasons found
            const filteredReturnList = Object.entries(
              rejectedFieldsByTables
            ).reduce((acc, [key, value]) => {
              if (Object.keys(value).length !== 0) {
                acc[key] = value;
              }
              return acc;
            }, {});
            const tableCountWithDiscrepencies = filteredReturnList
              ? Object.keys(filteredReturnList).length
              : 0;

            return {
              ...rejectedFieldsByTables,
              tableCountWithDiscrepencies: tableCountWithDiscrepencies
            };
            return rejectedFieldsByTables;
          })
    
          return rejectedFieldsByTables
        } catch (error) {
          throw new HttpException({ success: false, error }, 400);
        }
      }
}
