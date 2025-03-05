import { Injectable } from '@nestjs/common';
import moment from 'moment';
// import { PrismaService } from '../prisma/prisma.service';
import { compareDateIsDateBefor } from '.';

@Injectable()
export class CommonService {
  // constructor(private prisma: PrismaService) {}

  async calculateInvoiceTotalAmount({
    launchedSessionsForSlot,
    tutorCenter,
    paymentRate,
    academicCalendar,
    fromDate,
    timeRangeId
  }: any) {
    const RateCode = {
      0: 'AVL',
      1: 'SES_DE',
      2: 'SES_AD_SEC',
      3: 'STAT_ALW'
    };

    return launchedSessionsForSlot.length > 0
      ? (tutorCenter === 'SL' ? 'LKR' : 'INR') +
          ' ' +
          (paymentRate
            ? academicCalendar.some(
                // If this is a holiday, not pay
                (item) =>
                  moment(item.effective_date).format('YYYY-MM-DD') ===
                    moment(launchedSessionsForSlot[0].effective_date).format(
                      'YYYY-MM-DD'
                    ) && [2, 8].includes(item.holidays_type_id)
              )
              ? 0
              : await (async () => {
                  let totalAmount = 0;

                  for (const entry of paymentRate) {
                    // Date preparation and comparison logic
                    const date2 = moment('2024-09-01 00:00:00');
                    const date1 = moment(fromDate);

                    (await compareDateIsDateBefor(date1, date2))
                      ? (() => {
                          // Primary session status checks
                          const isStatus1Or3 =
                            [1, 3].includes(
                              launchedSessionsForSlot[0].slot_status_id
                            ) &&
                            (entry.rate_code === RateCode[0] ||
                              entry.rate_code === RateCode[1] ||
                              academicCalendar.some(
                                (item) =>
                                  moment(item.effective_date).format(
                                    'YYYY-MM-DD'
                                  ) ===
                                    moment(
                                      launchedSessionsForSlot[0].effective_date
                                    ).format('YYYY-MM-DD') &&
                                  entry.rate_code === RateCode[3] &&
                                  [1].includes(item.holidays_type_id)
                              ));

                          //Secondary session status checks
                          const isStatus2Or4 =
                            [2, 4].includes(
                              launchedSessionsForSlot[0].slot_status_id
                            ) &&
                            (entry.rate_code === RateCode[0] ||
                              entry.rate_code === RateCode[1] ||
                              entry.rate_code === RateCode[2] ||
                              academicCalendar.some(
                                (item) =>
                                  moment(item.effective_date).format(
                                    'YYYY-MM-DD'
                                  ) ===
                                    moment(
                                      launchedSessionsForSlot[0].effective_date
                                    ).format('YYYY-MM-DD') &&
                                  entry.rate_code === RateCode[3] &&
                                  [1].includes(item.holidays_type_id)
                              ));

                          return (totalAmount +=
                            isStatus1Or3 || isStatus2Or4 ? entry.amount : 0);
                        })()
                      : (() => {
                          // Primary session status checks
                          const isStatus1Or3 =
                            [1, 3].includes(
                              launchedSessionsForSlot[0].slot_status_id
                            ) &&
                            (entry.rate_code === 'AVL_AFT' ||
                              entry.rate_code === 'AVL_EVE' ||
                              entry.rate_code === RateCode[1] ||
                              academicCalendar.some(
                                (item) =>
                                  moment(item.effective_date).format(
                                    'YYYY-MM-DD'
                                  ) ===
                                    moment(
                                      launchedSessionsForSlot[0].effective_date
                                    ).format('YYYY-MM-DD') &&
                                  entry.rate_code === RateCode[3] &&
                                  [1].includes(item.holidays_type_id)
                              ));

                          //Secondary session status checks
                          const isStatus2Or4 =
                            [2, 4].includes(
                              launchedSessionsForSlot[0].slot_status_id
                            ) &&
                            (entry.rate_code === 'AVL_AFT' ||
                              entry.rate_code === 'AVL_EVE' ||
                              entry.rate_code === RateCode[1] ||
                              entry.rate_code === RateCode[2] ||
                              academicCalendar.some(
                                (item) =>
                                  moment(item.effective_date).format(
                                    'YYYY-MM-DD'
                                  ) ===
                                    moment(
                                      launchedSessionsForSlot[0].effective_date
                                    ).format('YYYY-MM-DD') &&
                                  entry.rate_code === RateCode[3] &&
                                  [1].includes(item.holidays_type_id)
                              ));

                          // Availability checks for afternoon and evening
                          const isAvlAft = [1, 2, 3, 4].includes(timeRangeId); // Availability Afternoon
                          const isAvlEve = [5, 6, 7, 8].includes(timeRangeId); // Availability Evening

                          if (isStatus1Or3 || isStatus2Or4) {
                            if (entry.rate_code === 'AVL_AFT' && isAvlAft) {
                              totalAmount += entry.amount;
                            } else if (
                              entry.rate_code == 'AVL_EVE' &&
                              isAvlEve
                            ) {
                              totalAmount += entry.amount;
                            } else if (
                              entry.rate_code !== 'AVL_EVE' &&
                              entry.rate_code !== 'AVL_AFT'
                            ) {
                              totalAmount += entry.amount;
                            }

                            console.log('totalAmount: ' + totalAmount);
                          }
                        })();
                  }

                  return totalAmount;
                })()
            : 0)
      : (tutorCenter === 'SL' ? ' LKR' : ' INR') +
          ' ' +
          (paymentRate
            ? await (async () => {
                // Date preparation
                const date2 = moment('2024-09-01 00:00:00');
                const date1 = moment(fromDate);

                // Compare the dateFrom with the 2024-09-01 00:00:00 date - this will excecute old logic
                if (await compareDateIsDateBefor(date1, date2)) {
                  return paymentRate.find(
                    (entry) => entry.rate_code === RateCode[0]
                  ).amount;
                } else {
                  // for 3 availability -
                  const isAvlAft = [1, 2, 3, 4].includes(timeRangeId); //Availability Afternoon
                  const isAvlEve = [5, 6, 7, 8].includes(timeRangeId); //Availability Evening

                  // console.log('TRUE ' + isAvlAft);
                  if (isAvlAft) {
                    // console.log(
                    //   'TRUE ' +
                    //     isAvlAft +
                    //     paymentRateForDay.find(
                    //       (entry) => entry.rate_code === 'AVL_AFT'
                    //     ).amount
                    // );
                    return paymentRate.find(
                      (entry) => entry.rate_code === 'AVL_AFT'
                    ).amount;
                  } else {
                    return paymentRate.find(
                      (entry) => entry.rate_code === 'AVL_EVE'
                    ).amount;
                  }
                }
              })()
            : 0);
  }
}
