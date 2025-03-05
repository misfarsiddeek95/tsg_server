import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import axios from 'axios';
import * as moment from 'moment-timezone';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SessionTrackerService {
  constructor(private prisma: PrismaService) {}

  // @Cron('23,53 7-17 * * *', {
  //   timeZone: 'Europe/London'
  // })
  async tinyBirdSMS() {
    const rows = (
      await axios(
        'https://api.tinybird.co/v0/pipes/api_session_tracker_main__v5.json?token=p.eyJ1IjogImE2NGFhODhkLWYzZjgtNGVhOC04ZTUzLTU5MWNlYThmMDhiNCIsICJpZCI6ICJmZmQ3YzYwYS0zNzA2LTRlMzMtYWQwNi01NTBhMWI2NjBhOTMiLCAiaG9zdCI6ICJldV9zaGFyZWQifQ.mt9QTA3EobLB7cFWoA9P5omtfMuszxa0C8hlL-zegtE'
      )
    ).data.data;

    const filteredRows = rows.filter(
      (row) =>
        row.tutor_center === 'TSG SL' &&
        row.session_cancelled_at === null &&
        moment
          .tz(
            row.session_start_date + ' ' + row.session_start_time,
            'Europe/London'
          )
          .diff(moment.tz('Europe/London'), 'minute') > 0 &&
        moment
          .tz(
            row.session_start_date + ' ' + row.session_start_time,
            'Europe/London'
          )
          .diff(moment.tz('Europe/London'), 'minute') < 7 &&
        row.tutor_joined === null &&
        row.session_cancelled_at === null &&
        row.student_id !== 0
    );

    const slotName = moment(filteredRows[0].session_start_time, 'HH:mm')
      .add(4.5, 'hours')
      .format('HH:mm');

    const users = await this.prisma.tslUser.findMany({
      where: {
        tsl_id: {
          in: filteredRows.map((row) => row.tutor_id)
        }
      },
      select: {
        tsl_id: true,
        tsl_first_name: true,
        user: {
          select: {
            approved_contact_data: {
              select: {
                mobileNumber: true
              }
            }
          }
        }
      }
    });

    console.log(
      'cron job at ',
      slotName,
      moment.tz('Europe/London').toISOString(),
      users.length
    );

    users.map((user, index) =>
      axios(
        `https://app.notify.lk/api/v1/send?user_id=25457&api_key=C2tnOhtmitZcIYwC9xTC&sender_id=TSG Ops&to=+94717659355&message=Hi ${user.tsl_first_name}\n\nKindly launch your session ASAP which is booked at ${slotName}.\nPlease disregard this message if already launched.\n\nThank you`
      )
    );

    users.map((user, index) =>
      axios(
        `https://app.notify.lk/api/v1/send?user_id=25457&api_key=C2tnOhtmitZcIYwC9xTC&sender_id=TSG Ops&to=${user.user.approved_contact_data.mobileNumber
          .split(' ')
          .reduce((prev, curr) => prev + curr, '')}&message=Hi ${
          user.tsl_first_name
        }\n\nKindly launch your session ASAP which is booked at ${slotName}.\nPlease disregard this message if already launched.\n\nThank you`
      )
    );

    // return {
    //   filteredRows,
    //   rowsLength: rows.length,
    //   filteredRowsLength: filteredRows.length,
    //   users,
    //   usersLength: users.length
    // };
  }
}
