import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';
import moment = require('moment');
import { setTimeout } from 'timers/promises';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { gSheetCourses } from './lms-resources';
@Injectable()
export class TalentLmsService {
  constructor(private prisma: PrismaService) {}

  async findUserChanges(oldArr: any, newArr: any) {
    const scoreChanges = [];
    const oldArrEmailMap = new Map();

    // Create a map from emails to oldArr objects for quick lookup

    oldArr.forEach((obj1) => {
      oldArrEmailMap.set(obj1.email, obj1);
    });

    // console.log('old length: ' + oldArr.length);

    // Find updates, new entries, and deleted
    const newArrIdSet = new Set(newArr.map((obj) => Number(obj.id)));

    newArr.forEach((obj2) => {
      const obj1 = oldArr.find((obj1) => obj1.id === Number(obj2.id));
      const isNew = !oldArr.some((obj1) => obj1.id === Number(obj2.id));
      const emailMatch = oldArrEmailMap.get(obj2.email);

      if (obj1) {
        // Check for updates
        if (
          obj1.status !== obj2.status ||
          obj1.email !== obj2.email ||
          obj1.points !== Number(obj2.points) ||
          obj1.level !== Number(obj2.level) ||
          obj1.userType !== obj2.user_type
        ) {
          scoreChanges.push({
            id: obj2.id,
            login: obj2.login,
            first_name: obj2.first_name,
            last_name: obj2.last_name,
            email: obj2.email,
            user_type: obj2.user_type,
            status: obj2.status,
            deactivation_date: obj2.deactivation_date,
            level: obj2.level,
            points: obj2.points,
            created_on: obj2.created_on,
            last_updated: obj2.last_updated,
            deleted: 0
          });
        }
      } else {
        if (isNew) {
          if (emailMatch) {
            // Mark the old record as deleted
            scoreChanges.push({
              id: emailMatch.id,
              login: emailMatch.login,
              first_name: emailMatch.firstName,
              last_name: emailMatch.lastName,
              email: emailMatch.email,
              user_type: emailMatch.userType,
              status: emailMatch.status,
              deactivation_date: emailMatch.deactivationDate,
              level: emailMatch.level,
              points: emailMatch.points,
              created_on: emailMatch.createdOn,
              last_updated: emailMatch.lastUpdated,
              deleted: 1
            });
            scoreChanges.push({
              id: obj2.id,
              login: obj2.login,
              first_name: obj2.first_name,
              last_name: obj2.last_name,
              email: obj2.email,
              user_type: obj2.user_type,
              status: obj2.status,
              deactivation_date: obj2.deactivation_date,
              level: obj2.level,
              points: obj2.points,
              created_on: obj2.created_on,
              last_updated: obj2.last_updated,
              deleted: 0
            });
          } else {
            scoreChanges.push({
              id: obj2.id,
              login: obj2.login,
              first_name: obj2.first_name,
              last_name: obj2.last_name,
              email: obj2.email,
              user_type: obj2.user_type,
              status: obj2.status,
              deactivation_date: obj2.deactivation_date,
              level: obj2.level,
              points: obj2.points,
              created_on: obj2.created_on,
              last_updated: obj2.last_updated,
              deleted: 0
            });
          }
        }
      }
    });

    // Find deleted accounts
    oldArr.forEach((obj1) => {
      if (!newArrIdSet.has(obj1.id)) {
        scoreChanges.push({
          id: obj1.id,
          login: obj1.login,
          first_name: obj1.first_name,
          last_name: obj1.last_name,
          email: obj1.email,
          user_type: obj1.user_type,
          status: obj1.status,
          deactivation_date: obj1.deactivation_date,
          level: obj1.level,
          points: obj1.points,
          created_on: obj1.created_on,
          last_updated: obj1.last_updated,
          deleted: 1
        });
      }
    });

    // Old code should remove this after test

    // //Find updated object in newArr
    // oldArr.forEach((obj1) => {
    //   const obj2 = newArr.find((o) => Number(o.id) === obj1.id);
    //   console.log('*** find bug ***', obj2);
    //   if (
    //     obj2 &&
    //     (obj1.status !== obj2.status ||
    //       obj1.email !== obj2.email ||
    //       obj1.points !== Number(obj2.points) ||
    //       obj1.level !== Number(obj2.level))
    //   ) {
    //     // console.log('IN 2 - ' + obj1.score + '-' + obj2.score);
    //     scoreChanges.push({
    //       id: obj2.id,
    //       login: obj2.login,
    //       first_name: obj2.first_name,
    //       last_name: obj2.last_name,
    //       email: obj2.email,
    //       user_type: obj2.user_type,
    //       status: obj2.status,
    //       deactivation_date: obj2.deactivation_date,
    //       level: obj2.level,
    //       points: obj2.points,
    //       created_on: obj2.created_on,
    //       last_updated: obj2.last_updated,
    //       deleted: 0
    //     });
    //   }
    // });

    // // Find new objects in newArr
    // newArr.forEach((obj2) => {
    //   const isNew = !oldArr.some((obj1) => obj1.id === Number(obj2.id));
    //   const emailMatch = oldArrEmailMap.get(obj2.email);
    //   if (isNew) {
    //     if (emailMatch) {
    //       // Also update the modified old record in the scoreChanges
    //       // scoreChanges.push({
    //       //   id: emailMatch.id,
    //       //   login: emailMatch.login,
    //       //   first_name: emailMatch.firstName,
    //       //   last_name: emailMatch.lastName,
    //       //   email: emailMatch.email,
    //       //   user_type: emailMatch.userType,
    //       //   status: emailMatch.status,
    //       //   deactivation_date: emailMatch.deactivationDate,
    //       //   level: emailMatch.level,
    //       //   points: emailMatch.points,
    //       //   created_on: emailMatch.createdOn,
    //       //   last_updated: emailMatch.lastUpdated,
    //       //   deleted: 1
    //       // });
    //       // scoreChanges.push({
    //       //   id: obj2.id,
    //       //   login: obj2.login,
    //       //   first_name: obj2.first_name,
    //       //   last_name: obj2.last_name,
    //       //   email: obj2.email,
    //       //   user_type: obj2.user_type,
    //       //   status: obj2.status,
    //       //   deactivation_date: obj2.deactivation_date,
    //       //   level: obj2.level,
    //       //   points: obj2.points,
    //       //   created_on: obj2.created_on,
    //       //   last_updated: obj2.last_updated,
    //       //   deleted: 0
    //       // });
    //     } else {
    //       console.log('**** New One  ***');
    //       //   scoreChanges.push({
    //       //     id: obj2.id,
    //       //     login: obj2.login,
    //       //     first_name: obj2.first_name,
    //       //     last_name: obj2.last_name,
    //       //     email: obj2.email,
    //       //     user_type: obj2.user_type,
    //       //     status: obj2.status,
    //       //     deactivation_date: obj2.deactivation_date,
    //       //     level: obj2.level,
    //       //     points: obj2.points,
    //       //     created_on: obj2.created_on,
    //       //     last_updated: obj2.last_updated,
    //       //     deleted: 0
    //       //   });
    //     }
    //   }
    // });

    // // Find Delete Account
    // const deleteArr = oldArr.filter(
    //   (objB) => !newArr.some((objA) => Number(objA.id) === objB.id)
    // );

    // deleteArr.forEach((obj1) => {
    //   scoreChanges.push({
    //     id: obj1.id,
    //     login: obj1.login,
    //     first_name: obj1.first_name,
    //     last_name: obj1.last_name,
    //     email: obj1.email,
    //     user_type: obj1.user_type,
    //     status: obj1.status,
    //     deactivation_date: obj1.deactivation_date,
    //     level: obj1.level,
    //     points: obj1.points,
    //     created_on: obj1.created_on,
    //     last_updated: obj1.last_updated,
    //     deleted: 1
    //   });
    // });

    return scoreChanges;
  } //end: findUserChanges

  async processUser() {
    try {
      // Set up authentication credentials
      const username = process.env['NX_LMS_TOKEN'];
      const password = '';

      const basicAuth =
        'Basic ' + Buffer.from(username + ':' + password).toString('base64');

      //
      const existingUser = await this.prisma.lmsUser.findMany({
        where: { deleted: 0 }
      });
      //
      const response: any = await axios.get(
        process.env['NX_LMS_API_URL'] + '/users',
        {
          headers: {
            Authorization: basicAuth
          }
        }
      );

      Promise.all(existingUser);

      const changeArr: any = await this.findUserChanges(
        existingUser,
        response.data
      );

      // console.log('Change : ' + JSON.stringify(changeArr));
      console.log('changeArr_length : ' + changeArr.length);

      const formatDate = (date) =>
        moment(date, 'DD/MM/YYYY, HH:mm:ss').toISOString();

      await Promise.all(
        changeArr.map(async (item: any, index: number) => {
          return this.prisma.lmsUser.upsert({
            where: {
              id: Number(item.id)
            },
            create: {
              id: Number(item.id),
              login: item.login ? item.login : null,
              firstName: item.first_name ? item.first_name : null,
              lastName: item.last_name ? item.last_name : null,
              email: item.email ? item.email : null,
              userType: item.user_type ? item.user_type : null,
              status: item.status ? item.status : null,
              deactivationDate: item.deactivation_date
                ? formatDate(item.deactivation_date)
                : null,
              level: Number(item.level),
              points: Number(item.points),
              createdOn: item.created_on ? formatDate(item.created_on) : null,
              lastUpdated: item.created_on
                ? formatDate(item.last_updated)
                : null,
              deleted: item.deleted
            },
            update: {
              login: item.login ? item.login : null,
              firstName: item.first_name ? item.first_name : null,
              lastName: item.last_name ? item.last_name : null,
              email: item.email ? item.email : null,
              userType: item.user_type ? item.user_type : null,
              status: item.status ? item.status : null,
              deactivationDate: item.deactivation_date
                ? formatDate(item.deactivation_date)
                : null,
              level: Number(item.level),
              points: Number(item.points),
              createdOn: item.created_on ? formatDate(item.created_on) : null,
              lastUpdated: item.created_on
                ? formatDate(item.last_updated)
                : null,
              deleted: item.deleted
            }
          });
        })
      );

      return true;
    } catch (error) {
      console.log('error:', error);
      throw new Error(error);
    }
  } //end: processUser

  async processCategory(categoryIds: any = [105, 18, 20]) {
    try {
      // Set up authentication credentials
      const username = process.env['NX_LMS_TOKEN'];
      const password = '';

      const basicAuth =
        'Basic ' + Buffer.from(username + ':' + password).toString('base64');

      Promise.all(
        categoryIds.map(async (categoryId) => {
          // categoryIds.map(async (categoryId: number) => {
          const response = await axios.get(
            process.env['NX_LMS_API_URL'] + '/categories/id:' + categoryId,
            {
              headers: {
                Authorization: basicAuth
              }
            }
          );

          const item = response.data;

          await this.prisma.lmsCategory.upsert({
            where: {
              id: Number(item.id)
            },
            create: {
              id: Number(item.id),
              name: item.name ? item.name : null,
              price: item.price ? item.price : null,
              parentCategoryId: item.parent_category_id
                ? Number(item.parent_category_id)
                : null
            },
            update: {
              name: item.name ? item.name : null,
              price: item.price ? item.price : null,
              parentCategoryId: item.parent_category_id
                ? Number(item.parent_category_id)
                : null
            }
          });
        })
      );

      return true;
    } catch (error) {
      console.log('Category error:', error);
      throw new Error(error);
    }
  } //end: processCategory

  async findCourseChanges(oldArr: any, newArr: any) {
    const scoreChanges = [];

    //Find updated object in newArr
    oldArr.forEach((obj1) => {
      const obj2 = newArr.find((o) => Number(o.id) === obj1.id);
      if (
        obj2 &&
        (obj1.description !== obj2.description ||
          obj1.status !== obj2.status ||
          obj1.name !== obj2.name)
      ) {
        scoreChanges.push({
          id: obj2.id,
          name: obj2.name,
          code: obj2.code,
          category_id: obj2.category_id,
          description: obj2.description,
          price: obj2.price,
          status: obj2.status,
          creation_date: obj2.creation_date,
          last_update_on: obj2.last_update_on,
          creator_id: obj2.creator_id,
          hide_from_catalog: obj2.hide_from_catalog,
          time_limit: obj2.time_limit,
          start_datetime: obj2.start_datetime,
          expiration_datetime: obj2.expiration_datetime,
          level: obj2.level,
          shared: obj2.shared,
          shared_url: obj2.shared_url,
          certification: obj2.certification,
          certification_duration: obj2.certification_duration
        });
      }
    });

    // Find new objects in newArr
    newArr.forEach((obj2) => {
      const isNew = !oldArr.some((obj1) => obj1.id === Number(obj2.id));
      if (isNew) {
        scoreChanges.push({
          id: obj2.id,
          name: obj2.name,
          code: obj2.code,
          category_id: obj2.category_id,
          description: obj2.description,
          price: obj2.price,
          status: obj2.status,
          creation_date: obj2.creation_date,
          last_update_on: obj2.last_update_on,
          creator_id: obj2.creator_id,
          hide_from_catalog: obj2.hide_from_catalog,
          time_limit: obj2.time_limit,
          start_datetime: obj2.start_datetime,
          expiration_datetime: obj2.expiration_datetime,
          level: obj2.level,
          shared: obj2.shared,
          shared_url: obj2.shared_url,
          certification: obj2.certification,
          certification_duration: obj2.certification_duration
        });
      }
    });

    return scoreChanges;
  } //end: findCourseChanges

  async findCourseUserChanges(oldArr: any, newArr: any) {
    const scoreChanges = [];

    //Find updated object in newArr
    oldArr.forEach((obj1) => {
      const obj2 = newArr.find((o) => Number(o.id) === obj1.userId);

      let areDatesEqual = true;
      if (obj2?.completed_on) {
        // Define two dates
        const date1 = moment(obj1.completedOn);
        const date2 = moment(
          obj2.completed_on,
          'DD/MM/YYYY, HH:mm:ss'
        ).toISOString();
        // Check if the dates are the same down to the second
        areDatesEqual = date1.isSame(date2);
      }
      // console.log('areDatesEqual:', areDatesEqual);
      if (
        obj2 &&
        (obj1.completionPercentage !== Number(obj2.completion_percentage) ||
          !areDatesEqual)
      ) {
        scoreChanges.push({
          id: obj2.id,
          name: obj2.name,
          role: obj2.role,
          enrolled_on: obj2.enrolled_on,
          enrolled_on_timestamp: obj2.enrolled_on_timestamp,
          completed_on: obj2.completed_on,
          completed_on_timestamp: obj2.completed_on_timestamp,
          completion_percentage: obj2.completion_percentage,
          expired_on: obj2.expired_on,
          expired_on_timestamp: obj2.expired_on_timestamp,
          total_time: obj2.total_time,
          total_time_seconds: obj2.total_time_seconds
        });
      }
    });

    // // Find new objects in newArr
    newArr.forEach((obj2) => {
      const isNew = !oldArr.some((obj1) => obj1.userId === Number(obj2.id));
      if (isNew) {
        // console.log('New object found: ' + obj2.user_id);
        scoreChanges.push({
          id: obj2.id,
          name: obj2.name,
          role: obj2.role,
          enrolled_on: obj2.enrolled_on,
          enrolled_on_timestamp: obj2.enrolled_on_timestamp,
          completed_on: obj2.completed_on,
          completed_on_timestamp: obj2.completed_on_timestamp,
          completion_percentage: obj2.completion_percentage,
          expired_on: obj2.expired_on,
          expired_on_timestamp: obj2.expired_on_timestamp,
          total_time: obj2.total_time,
          total_time_seconds: obj2.total_time_seconds
        });
      }
    });

    console.log('scoreChanges: ' + scoreChanges.length);
    return scoreChanges;
  } //end: findCourseUserChanges

  async findCourseUnitChanges(oldArr: any, newArr: any) {
    const scoreChanges = [];

    //Find updated object in newArr
    oldArr.forEach((obj1) => {
      const obj2 = newArr.find((o) => Number(o.id) === obj1.unitId);
      if (obj2 && obj1.name !== obj2.name) {
        scoreChanges.push({
          id: obj2.id,
          type: obj2.type,
          name: obj2.name,
          url: obj2.url
        });
      }
    });

    // Find new objects in newArr
    newArr.forEach((obj2) => {
      const isNew = !oldArr.some((obj1) => obj1.unitId === Number(obj2.id));
      if (isNew) {
        // console.log('New object found: ' + obj2.user_id);
        scoreChanges.push({
          id: obj2.id,
          type: obj2.type,
          name: obj2.name,
          url: obj2.url
        });
      }
    });

    return scoreChanges;
  } //end: findCourseUnitChanges

  // Should optimize
  async processCourses(coursesIds: any) {
    try {
      // Set up authentication credentials
      const username = process.env['NX_LMS_TOKEN'];
      const password = '';

      const basicAuth =
        'Basic ' + Buffer.from(username + ':' + password).toString('base64');

      const existingCourse = await this.prisma.lmsCourse.findMany({
        include: {
          lmsCourseUnit: true,
          lmsCourseUser: true
        }
      });
      const courseUnitList = [];
      let count = 0;

      for (let i = 0; i < coursesIds.length; i++) {
        const coursesId = coursesIds[i];
        // coursesIds.map(async (coursesId) => {
        const response = await axios.get(
          process.env['NX_LMS_API_URL'] + '/courses/id:' + coursesId,
          {
            headers: {
              Authorization: basicAuth
            }
          }
        );

        response.data.units.map((unit) => {
          courseUnitList.push({
            courseId: coursesId,
            unitId: Number(unit.id)
          });
        });

        const changeArr: any = await this.findCourseChanges(existingCourse, [
          response.data
        ]);

        const formatDate = (date) =>
          moment(date, 'DD/MM/YYYY, HH:mm:ss').toISOString();

        // console.log('changeArr:' + JSON.stringify(changeArr));

        //Upsert Courses
        if (changeArr.length > 0) {
          const item = changeArr.length > 0 ? changeArr[0] : {};
          await this.prisma.lmsCourse.upsert({
            where: {
              id: Number(item.id)
            },
            create: {
              id: Number(item.id),
              name: item.name ? item.name : null,
              code: item.code ? item.code : null,
              categoryId: item.category_id ? Number(item.category_id) : null,
              description: item.description ? item.description : null,
              price: item.price ? item.price : null,
              status: item.status ? item.status : null,
              creationDate: item.creation_date
                ? formatDate(item.creation_date)
                : null,
              lastUpdateOn: item.last_update_on
                ? formatDate(item.last_update_on)
                : null,
              creatorId: Number(item.creator_id),
              hideFromCatalog: Number(item.hide_from_catalog),
              timeLimit: Number(item.time_limit),
              startDatetime: item.start_datetime
                ? formatDate(item.start_datetime)
                : null,
              expirationDatetime: item.expiration_datetime
                ? formatDate(item.expiration_datetime)
                : null,
              level: Number(item.level),
              shared: Number(item.shared),
              sharedUrl: item.shared_url ? item.shared_url : null,
              certification: item.certification ? item.certification : null,
              certificationDuration: item.certification_duration
                ? item.certification_duration
                : null
            },
            update: {
              name: item.name ? item.name : null,
              code: item.code ? item.code : null,
              categoryId: item.category_id ? Number(item.category_id) : null,
              description: item.description ? item.description : null,
              price: item.price ? item.price : null,
              status: item.status ? item.status : null,
              creationDate: item.creation_date
                ? formatDate(item.creation_date)
                : null,
              lastUpdateOn: item.last_update_on
                ? formatDate(item.last_update_on)
                : null,
              creatorId: Number(item.creator_id),
              hideFromCatalog: Number(item.hide_from_catalog),
              timeLimit: Number(item.time_limit),
              startDatetime: item.start_datetime
                ? formatDate(item.start_datetime)
                : null,
              expirationDatetime: item.expiration_datetime
                ? formatDate(item.expiration_datetime)
                : null,
              level: Number(item.level),
              shared: Number(item.shared),
              sharedUrl: item.shared_url ? item.shared_url : null,
              certification: item.certification ? item.certification : null,
              certificationDuration: item.certification_duration
                ? item.certification_duration
                : null
            }
          });
        }

        //-------------------------------
        //Find Old Course object
        const oldUCourse = existingCourse.find(
          (o) => Number(o.id) === coursesId
        );
        const oldUsers = oldUCourse?.lmsCourseUser
          ? oldUCourse.lmsCourseUser
          : [];
        const oldUnits = oldUCourse?.lmsCourseUnit
          ? oldUCourse.lmsCourseUnit
          : [];

        const changeArrUsers: any = await this.findCourseUserChanges(
          oldUsers,
          response.data.users
        );

        const changeArrUnits: any = await this.findCourseUnitChanges(
          oldUnits,
          response.data.units
        );

        console.log('coursesId:' + coursesId);
        // console.log(
        //   'changeArrUsers:' +
        //     JSON.stringify(changeArrUnits).substring(0, 1000) +
        //     '-----------'
        // );

        // const users = changeArrUsers;
        // const units = changeArrUnits;

        // console.log('slice:' + JSON.stringify(users.slice(0, 5)));
        try {
          // new Code line

          for (const user of changeArrUsers) {
            await this.prisma.lmsCourseUser.upsert({
              where: {
                courseId_userId: {
                  courseId: +coursesId,
                  userId: Number(user.id)
                }
              },
              create: {
                courseId: +coursesId,
                userId: Number(user.id),
                name: user.name ? user.name : null,
                role: user.role ? user.role : null,
                enrolledOn: user.enrolled_on
                  ? formatDate(user.enrolled_on)
                  : null,
                enrolledOnTimestamp: user.enrolled_on_timestamp
                  ? formatDate(user.enrolled_on_timestamp)
                  : null,
                completedOn: user.completed_on
                  ? formatDate(user.completed_on)
                  : null,
                completedOnTimestamp: user.completed_on_timestamp
                  ? formatDate(user.completed_on_timestamp)
                  : null,
                completionPercentage: user.completion_percentage
                  ? Number(user.completion_percentage)
                  : null,
                expiredOn: user.expired_on ? formatDate(user.expired_on) : null,
                expiredOnTimestamp: user.expired_on_timestamp
                  ? formatDate(user.expired_on_timestamp)
                  : null,
                totalTime: user.total_time ? user.total_time : null,
                totalTimeSeconds: user.total_time_seconds
                  ? Number(user.total_time_seconds)
                  : null
              },
              update: {
                name: user.name ? user.name : null,
                role: user.role ? user.role : null,
                enrolledOn: user.enrolled_on
                  ? formatDate(user.enrolled_on)
                  : null,
                enrolledOnTimestamp: user.enrolled_on_timestamp
                  ? formatDate(user.enrolled_on_timestamp)
                  : null,
                completedOn: user.completed_on
                  ? formatDate(user.completed_on)
                  : null,
                completedOnTimestamp: user.completed_on_timestamp
                  ? formatDate(user.completed_on_timestamp)
                  : null,
                completionPercentage: user.completion_percentage
                  ? Number(user.completion_percentage)
                  : null,
                expiredOn: user.expired_on ? formatDate(user.expired_on) : null,
                expiredOnTimestamp: user.expired_on_timestamp
                  ? formatDate(user.expired_on_timestamp)
                  : null,
                totalTime: user.total_time ? user.total_time : null,
                totalTimeSeconds: user.total_time_seconds
                  ? Number(user.total_time_seconds)
                  : null
              }
            });
          }

          for (const unit of changeArrUnits) {
            await this.prisma.lmsCourseUnit.upsert({
              where: {
                courseId_unitId: {
                  courseId: coursesId,
                  unitId: Number(unit.id)
                }
              },
              create: {
                courseId: coursesId,
                unitId: Number(unit.id),
                type: unit.type ? unit.type : null,
                name: unit.name ? unit.name : null,
                url: unit.url ? unit.url : null
              },
              update: {
                type: unit.type ? unit.type : null,
                name: unit.name ? unit.name : null,
                url: unit.url ? unit.url : null
              }
            });
          }

          // ************** Old Code *********************
          // since promise all cause heavey load on db, using batch processing
          // const batchSize = 10; // Adjust the batch size as needed

          // for (let i = 0; i < users.length; i += batchSize) {
          //   const batch = users.slice(i, i + batchSize);
          //   // //Upsert Users
          //   await Promise.all(
          //     batch.map(async (user) => {
          //       await this.prisma.lmsCourseUser.upsert({
          //         where: {
          //           courseId_userId: {
          //             courseId: +coursesId,
          //             userId: Number(user.id)
          //           }
          //         },
          //         create: {
          //           courseId: +coursesId,
          //           userId: Number(user.id),
          //           name: user.name ? user.name : null,
          //           role: user.role ? user.role : null,
          //           enrolledOn: user.enrolled_on
          //             ? formatDate(user.enrolled_on)
          //             : null,
          //           enrolledOnTimestamp: user.enrolled_on_timestamp
          //             ? formatDate(user.enrolled_on_timestamp)
          //             : null,
          //           completedOn: user.completed_on
          //             ? formatDate(user.completed_on)
          //             : null,
          //           completedOnTimestamp: user.completed_on_timestamp
          //             ? formatDate(user.completed_on_timestamp)
          //             : null,
          //           completionPercentage: user.completion_percentage
          //             ? Number(user.completion_percentage)
          //             : null,
          //           expiredOn: user.expired_on
          //             ? formatDate(user.expired_on)
          //             : null,
          //           expiredOnTimestamp: user.expired_on_timestamp
          //             ? formatDate(user.expired_on_timestamp)
          //             : null,
          //           totalTime: user.total_time ? user.total_time : null,
          //           totalTimeSeconds: user.total_time_seconds
          //             ? Number(user.total_time_seconds)
          //             : null
          //         },
          //         update: {
          //           name: user.name ? user.name : null,
          //           role: user.role ? user.role : null,
          //           enrolledOn: user.enrolled_on
          //             ? formatDate(user.enrolled_on)
          //             : null,
          //           enrolledOnTimestamp: user.enrolled_on_timestamp
          //             ? formatDate(user.enrolled_on_timestamp)
          //             : null,
          //           completedOn: user.completed_on
          //             ? formatDate(user.completed_on)
          //             : null,
          //           completedOnTimestamp: user.completed_on_timestamp
          //             ? formatDate(user.completed_on_timestamp)
          //             : null,
          //           completionPercentage: user.completion_percentage
          //             ? Number(user.completion_percentage)
          //             : null,
          //           expiredOn: user.expired_on
          //             ? formatDate(user.expired_on)
          //             : null,
          //           expiredOnTimestamp: user.expired_on_timestamp
          //             ? formatDate(user.expired_on_timestamp)
          //             : null,
          //           totalTime: user.total_time ? user.total_time : null,
          //           totalTimeSeconds: user.total_time_seconds
          //             ? Number(user.total_time_seconds)
          //             : null
          //         }
          //       });
          //     })
          //   );
          // }

          // for (let i = 0; i < units.length; i += batchSize) {
          //   const batch = units.slice(i, i + batchSize);
          //   // //Upsert Units
          //   await Promise.all(
          //     batch.map(async (unit) => {
          //       await this.prisma.lmsCourseUnit.upsert({
          //         where: {
          //           courseId_unitId: {
          //             courseId: coursesId,
          //             unitId: Number(unit.id)
          //           }
          //         },
          //         create: {
          //           courseId: coursesId,
          //           unitId: Number(unit.id),
          //           type: unit.type ? unit.type : null,
          //           name: unit.name ? unit.name : null,
          //           url: unit.url ? unit.url : null
          //         },
          //         update: {
          //           type: unit.type ? unit.type : null,
          //           name: unit.name ? unit.name : null,
          //           url: unit.url ? unit.url : null
          //         }
          //       });
          //     })
          //   );
          // }
          console.log('Unit Progress data loaded: ' + count++);
          // });
        } catch (error) {
          console.error('Error during batch upsert:', error);
          // Optionally rethrow or handle error appropriately
        }
      }

      return courseUnitList;
    } catch (error) {
      console.log('Course error:', error);
      throw new Error(error);
    }
  } //end: processCourses

  async findScoreChanges(oldArr: any, newArr: any, unitId: any) {
    const scoreChanges = [];
    //**** New code line *****

    // Find updates, new entries, and deleted
    const newArrIdSet = new Set(newArr.map((obj) => Number(obj.user_id)));

    newArr.forEach((obj2) => {
      const obj1 = oldArr.find(
        (obj1) => obj1.userId === Number(obj2.user_id) && unitId === obj1.unitId
      );

      const isNew = !oldArr.some(
        (obj1) => obj1.userId === Number(obj2.user_id) && unitId === obj1.unitId
      );

      if (obj1) {
        if (obj1.score !== Number(obj2.score) || obj1.status !== obj2.status) {
          scoreChanges.push({
            user_id: obj2.user_id,
            status: obj2.status,
            score: obj2.score,
            deleted: 0
          });
        }
      } else {
        if (isNew) {
          scoreChanges.push({
            user_id: obj2.user_id,
            status: obj2.status,
            score: obj2.score,
            deleted: 0
          });
        } else if (obj1.status !== obj2.status) {
          scoreChanges.push({
            user_id: obj2.user_id,
            status: obj2.status,
            score: obj2.score
          });
        }
      }
    });

    // Find deleted accounts
    oldArr.forEach((obj1) => {
      if (!newArrIdSet.has(obj1.userId)) {
        scoreChanges.push({
          user_id: obj1.userId,
          status: obj1.status,
          score: obj1.score,
          deleted: 1
        });
      }
    });

    // **** old code should delete after testing****

    // oldArr.forEach((obj1) => {
    //   const obj2 = newArr.find(
    //     (o) => Number(o.user_id) === obj1.userId && unitId === obj1.unitId
    //   );

    //   if (
    //     obj2 &&
    //     (obj1.score !== Number(obj2.score) || obj1.status !== obj2.status)
    //   ) {
    //     if (obj1.score !== obj2.score) {
    //       scoreChanges.push({
    //         user_id: obj2.user_id,
    //         status: obj2.status,
    //         score: obj2.score
    //       });
    //     } else if (obj1.status !== obj2.status) {
    //       scoreChanges.push({
    //         user_id: obj2.user_id,
    //         status: obj2.status,
    //         score: obj2.score
    //       });
    //     }
    //   }
    // });

    // // Find new objects in newArr
    // newArr.forEach((obj2) => {
    //   const isNew = !oldArr.some(
    //     (obj1) => obj1.userId === Number(obj2.user_id) && unitId === obj1.unitId
    //   );
    //   if (isNew) {
    //     scoreChanges.push({
    //       user_id: obj2.user_id,
    //       status: obj2.status,
    //       score: obj2.score
    //     });
    //   }
    // });

    return scoreChanges;
  } //end: findScoreChanges

  async updateUnits(courseUnitList) {
    const username = process.env['NX_LMS_TOKEN'];
    const password = '';
    const batchSize = 10; // Adjust the batch size as needed

    const basicAuth =
      'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    for (const courseUnit of courseUnitList) {
      try {
        const response = await axios.get(
          `${process.env['NX_LMS_API_URL']}/getusersprogressinunits/unit_id:${courseUnit.unitId}`,
          {
            headers: {
              Authorization: basicAuth
            },
            timeout: 100000
          }
        );

        const newArr = response.data;

        const oldArr = await this.prisma.lmsUnitProgress.findMany({
          where: {
            deleted: 0,
            unitId: courseUnit.unitId
          }
        });

        Promise.all(oldArr);

        const changeArr = await this.findScoreChanges(
          oldArr,
          newArr,
          courseUnit.unitId
        );

        // console.log(
        //   'changeArr' +
        //     JSON.stringify(changeArr).substring(0, 1000) +
        //     '-----------'
        // );
        // console.log('changeArr' + JSON.stringify(changeArr.length));

        // since promise all cause heavey load on db, do batch process
        for (let i = 0; i < changeArr.length; i += batchSize) {
          const batch = changeArr.slice(i, i + batchSize);

          await Promise.all(
            batch.map(async (item) => {
              await this.prisma.lmsUnitProgress.upsert({
                where: {
                  courseId_unitId_userId: {
                    courseId: courseUnit.courseId,
                    unitId: courseUnit.unitId,
                    userId: Number(item.user_id)
                  }
                },
                create: {
                  courseId: courseUnit.courseId,
                  unitId: courseUnit.unitId,
                  userId: Number(item.user_id),
                  status: item.status || null,
                  score: item.score ? Number(item.score) : null,
                  deleted: item.deleted
                },
                update: {
                  status: item.status,
                  score: item.score ? Number(item.score) : null,
                  deleted: item.deleted
                }
              });
            })
          );
        } //end: for loop
      } catch (error) {
        console.error(
          `Failed to update unit progress for unitId ${courseUnit.unitId}:`,
          error
        );
      }
    }
  } //end: updateUnits

  async processUnitProgress(courseUnitList: any) {
    try {
      console.log('Waiting1:');
      for (let i = 0; i < courseUnitList.length; i = i + 50) {
        console.log(`Waiting1: ${i}`);
        const chunkSize = Math.min(50, courseUnitList.length - i);
        await this.updateUnits(courseUnitList.slice(i, i + chunkSize));
        if (chunkSize < 50) {
          // Handle the last chunk differently, if needed
          console.log(`Last chunk size: ${chunkSize}`);
        }
        console.log(`Waiting2: ${i}`);
        // await new Promise((resolve: any) => setTimeout(resolve, 5000));
        await setTimeout(5000);
        console.log(`Waiting3: ${i}`);
      }

      return true;
    } catch (error) {
      console.log('Unit Progress error:', error);
      throw new Error(error);
    } finally {
      console.log('Finished: ' + Date());
    }
  } //end: processUnitProgress

  // async appendDataGoogleSpreedSheet(
  //   auth: any,
  //   spreadsheetId: string,
  //   range: string,
  //   values: any[]
  // ) {
  //   const request = {
  //     spreadsheetId: spreadsheetId,
  //     range: range,
  //     valueInputOption: 'USER_ENTERED',
  //     resource: {
  //       values: [values]
  //     },
  //     auth: auth
  //   };

  //   try {
  //     const response = await this.sheets.spreadsheets.values.append(request);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error appending data:', error);
  //     throw error;
  //   }
  // }

  async columnToLetter(column) {
    let letter = '';
    let temp;
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }

  async processGSheetCourses() {
    const spreadsheetId =
      process.env['NX_LMS_G_SHEET_ID'] ??
      '1v2IAz14jOFRdQFX_4U1Btewal2LrWeDkupMCzXUu3QA';

    await this.lmsDataPushGSheet(1182, spreadsheetId, 'GTP-S1');
    await this.lmsDataPushGSheet(1184, spreadsheetId, 'GTP-S2');

    /*
    for (const course of gSheetCourses) {
      await this.lmsDataPushGSheet(
        course.courseIdNo,
        spreadsheetId,
        course.sheetTabName
      );
      await new Promise((resolve: any) => setTimeout(resolve, 30000)); // delay 30 sec
    }
    */

    await this.prisma.hrisIncidentLogTable.create({
      data: {
        createdAt: new Date().toISOString(),
        system: 'gra_lms',
        cron: 'process_lmsDataPushGSheet',
        comment:
          'processUnitProgress - process_lmsDataPushGSheet @ ' +
          process.env.FRONT_URL,
        dataSet:
          'courseIds: ' +
          gSheetCourses.map((course) => course.courseIdNo).join(', ')
      }
    });

    return true;
  } //end: processGSheetCourses

  async lmsDataPushGSheet(
    courseIdNo: number,
    spreadsheetId: string,
    sheetTabName: string
  ) {
    try {
      //Get Units details accourding to courseId
      const units = await this.prisma.lmsCourseUnit.findMany({
        where: {
          courseId: courseIdNo,
          order: { not: -1 },
          type: { not: 'Section' }
        },
        orderBy: {
          order: 'asc'
        },
        select: {
          unitId: true,
          name: true
        }
      });

      const unitIds = units.map((unit) => unit.unitId); // Array of unitIds from the units object
      const unitNames = units.map((unit) => unit.name); // Array of unitIds from the units object
      const totalUnits = unitIds.length; // Total units based on your example
      const displayRows = [
        'tspId',
        'traineeName',
        'userId',
        'userName',
        'email',
        'batch'
      ];
      const displayRowsEnd = [
        'completionPercentage',
        'completedOn',
        'userType',
        'deleted'
      ];

      // Create header row
      const headers = [
        'TSP ID',
        'Trainee Name',
        'tLMS ID',
        'tLMS Name',
        'Email',
        'Training Batch',
        ...unitNames,
        'Overall Completion %',
        'Date when Overall completion (col x) becomes 100%',
        'User Type',
        'Deleted'
      ];

      //------- Set Google Connection ---------------------------------------------------------
      const jwtClient = new JWT({
        email: process.env['NX_LMS_G_CLIENT_EMAIL'],
        key: process.env['NX_LMS_G_PRIVATE_KEY'].replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      const sheets = google.sheets({ version: 'v4', auth: jwtClient });

      //-------Prepare Cell Range --------------------------------------------------------
      const columnLength = headers.length;
      const columnLetter = await this.columnToLetter(columnLength); // Generate Column letter
      const range = sheetTabName + '!A2:' + columnLetter + 2; // range to update

      //header insert
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [headers]
        }
      });
      //start time datetime stamp
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTabName}!A1:A1`.toString(),
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [
            [
              'Updating: ' +
                moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss')
            ]
          ]
        }
      });
      //-------Clear G Sheet --------------------------------------------------------
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetTabName}!A3:ZZ` // clear the entire sheet tab except the first two rows
      });

      //find max lms id avilable
      const lmsUserMaxId = await this.prisma.lmsUser.aggregate({
        _max: {
          id: true
        }
      });
      const batchSize = 750;
      let writtenRowCount = 0;

      for (let i = 0; i <= lmsUserMaxId._max.id; i += batchSize) {
        //------ Data Fetching From DB ------------------------------------
        const response: any = await this.prisma.$queryRaw`
                       SELECT
                          cu.course_id as courseId,
                          cu.unit_id as unitId,
                          cu.name as name,
                            json_arrayagg(json_object(
                                'courseId', up.course_id,
                                'unitId', up.unit_id,
                                'userId', up.user_id,
                                'status', up.status,
                                'score', up.score,
                                'deleted', up.deleted,
                                'lmsUser', json_object(
                                      'deleted', u.deleted,
                                      'userType', u.user_type,
                                      'email', u.email,
                                      'firstName', u.first_name,
                                      'lastName', u.last_name
                                ),
                                'tsgUser',json_object(
                                  'tspId', COALESCE(hp.tsp_id, acd.tsp_id),
                                      'firstName', apd.first_name,
                                      'surname', apd.surname,
                                      'batch', ajr.batch
                                ))) as lmsUnitProgress
                        FROM lms_course_unit as cu
                        LEFT JOIN lms_unit_progress as up 
                          ON cu.unit_id = up.unit_id AND cu.course_id = up.course_id
                        LEFT JOIN lms_user as u 
                          ON up.user_id = u.id
                        LEFT JOIN hris_progress as hp 
                          ON u.email = hp.lms_email
                        LEFT JOIN approved_contact_data as acd 
                          ON u.email = acd.work_email
                        LEFT JOIN approved_personal_data as apd 
                            ON COALESCE(hp.tsp_id, acd.tsp_id) = apd.tsp_id
                        LEFT JOIN approved_job_requisition as ajr 
                            ON COALESCE(hp.tsp_id, acd.tsp_id) = ajr.tsp_id
                          WHERE
                            cu.course_id = ${courseIdNo}
                            AND u.id IS NOT NULL
                            AND u.id BETWEEN ${i} AND ${i + batchSize - 1}
                            -- AND u.user_type = 'Learner-Type'
                        group by 1, 2, 3
                        `;
        // console.log('response _size', JSON.stringify(response).length);
        if (!response.length) {
          continue;
        }

        //Get course users accourding to courseId
        const response2 = await this.prisma.lmsCourseUser.findMany({
          where: {
            lmsUser: {
              id: {
                gte: i,
                lte: i + batchSize - 1
              }
            },
            courseId: courseIdNo
          },
          orderBy: {
            userId: 'desc'
          },
          select: {
            userId: true,
            completionPercentage: true,
            completedOn: true,
            lmsUser: {
              select: {
                deleted: true
              }
            }
          }
        });

        //------ Data Preparation  1 - get dat into indivitual object --------------------------------------
        const preparedListStep1 = [];

        // Loop through each item in the list
        response.forEach((course) => {
          // Loop through each user's progress in lmsUnitProgress
          course.lmsUnitProgress.forEach((progress) => {
            // Find if the user is already added to the result
            let userEntry = preparedListStep1.find(
              (user) => user.userId === progress.userId
            );
            const courseUser = response2.find(
              (courseUser) => courseUser.userId === progress.userId
            );

            if (!userEntry) {
              // If user is not in result, add them
              userEntry = {
                tspId: progress.tsgUser?.tspId,
                traineeName: `${progress.tsgUser?.firstName} ${progress.tsgUser?.surname}`,
                batch: progress.tsgUser?.batch,
                // tspId: '',
                // traineeName: '',
                userId: progress.userId,
                userName: `${progress.lmsUser?.firstName} ${progress.lmsUser?.lastName} `,
                email: progress.lmsUser.email,
                userType: progress.lmsUser.userType,
                deleted: progress.lmsUser.deleted,
                completionPercentage: courseUser?.completionPercentage || 0,
                completedOn: courseUser?.completedOn || '',
                units: []
              };
              preparedListStep1.push(userEntry);
            }

            // Add unit details to the user's entry
            userEntry.units.push({
              unitId: course.unitId,
              score:
                progress.deleted != 1
                  ? progress.score
                  : progress.lmsUser.deleted === 1
                  ? progress.score
                  : '',
              status:
                progress.deleted != 1
                  ? progress.status
                  : progress.lmsUser.deleted === 1
                  ? progress.status
                  : ''
            });
          });

          preparedListStep1.sort((a, b) => a.userId - b.userId); // this line sort user
        });

        //------ Data Preparation  2 - Units score fixed for all the users --------------------------------------
        const preparedListStep2 = preparedListStep1.map((user: any) => {
          // Create a new array for the units that ensures all unitIds are accounted for
          const userUnitsSorted = unitIds.map((id) => {
            const foundUnit = user.units?.find((unit) => unit.unitId === id);
            return foundUnit || {}; // If no unit is found for a particular id, return an empty object
          });

          const updatedUserUnits = userUnitsSorted.reduce((acc, unit) => {
            if (unit.status === 'Not attempted') {
              acc.push({ ...unit, status: '' });
            } else {
              acc.push(unit);
            }
            return acc;
          }, []);

          // Return the user object with the newly sorted units
          return {
            ...user,
            units: updatedUserUnits
          };
        });

        // console.error('preparedListStep1: ' + JSON.stringify(preparedListStep1[1]));
        // console.error('preparedListStep2: ' + JSON.stringify(preparedListStep2[1]));

        //------ Data Preparation 3 - G Sheets --------------------------------------
        // Transform objList to 2D array
        const values = preparedListStep2.map((user) => {
          // Create an array starting with user name and email
          const row = new Array(
            totalUnits + displayRows.length + displayRowsEnd.length
          ).fill('');

          displayRows.forEach((field, index) => {
            row[index] = user[field] ?? '';
          });
          displayRowsEnd.forEach((field, index) => {
            row[index + totalUnits + displayRows.length] =
              field != 'completedOn'
                ? user[field] ?? ''
                : user[field] && moment(user.completedOn).isValid()
                ? moment(user.completedOn).utc().format('DD-MM-YYYY')
                : '';
          });

          // Fill in the unitIds in their respective positions
          user.units.forEach((unit, index) => {
            if (unit.unitId) {
              row[index + displayRows.length] = unit.status; // unit.unitId.toString()
            }
          });
          return row;
        });

        //-------Prepare Cell Range --------------------------------------------------------
        const rowNumber = values.length + writtenRowCount + 2;
        const range =
          sheetTabName +
          '!A' +
          (writtenRowCount + 3).toString() +
          ':' +
          columnLetter +
          rowNumber.toString(); // range to update
        console.log('range:' + range);
        console.log('values.length:' + values.length);

        writtenRowCount += values.length; // set new row count

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'RAW', // or 'USER_ENTERED'
          requestBody: {
            values
          }
        });
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: (sheetTabName + '!A1:B1').toString(),
        valueInputOption: 'RAW', // or 'USER_ENTERED'
        requestBody: {
          values: [
            [
              sheetTabName,
              'Updated: ' +
                moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss')
            ]
          ]
        }
      });
      console.log(sheetTabName + ': rows updated: ' + writtenRowCount); // Log the result
    } catch (err) {
      console.error('The API returned an error: ' + err);
    }

    // Optional garbage collection trigger if necessary and enabled
    if (global.gc) {
      console.log('gc called');
      global.gc();
    }

    return true;
  } //end: lmsDataPushGSheet

  async processCourseAndUnits() {
    const coursesIds = [1182, 1184];
    // const coursesIds = [
    //   1182, 1184, 1167, 1159, 1160, 1156, 1170, 1161, 1162, 1157, 1152, 1056,
    //   1062, 1063, 1057, 1058, 1064, 1059, 1065, 1060, 1066, 1061, 1067, 1188
    // ];

    // console.log('Course data loading for ids:' + coursesIds);
    const courseUnitList = await this.processCourses(coursesIds);
    console.log(
      'Unit Progress data Loading for courseUnitList#....:' +
        courseUnitList.length
    );

    const unitProgressResponse = await this.processUnitProgress(courseUnitList);
    console.log('Unit Progress data loaded: ' + unitProgressResponse);

    return true;
  } //end: processCourseAndUnits

  async addDummyRecordForNotStartedUsers() {
    const coursesIds = [1182, 1184];

    try {
      for (const courseIdIn of coursesIds) {
        //find first unit of selected course
        const firstUnit = await this.prisma.lmsCourseUnit.findFirst({
          select: {
            unitId: true
          },
          where: {
            courseId: courseIdIn,
            type: {
              not: 'Section'
            },
            order: {
              not: -1
            }
          },
          orderBy: {
            order: 'asc'
          },
          take: 1
        });

        //find users that's assigned but not attempted said unit
        const pendingUsers = await this.prisma.lmsCourseUser.findMany({
          select: {
            userId: true
          },
          where: {
            courseId: courseIdIn,
            lmsUser: {
              deleted: 0,
              userType: 'Learner-Type',
              lmsUnitProgress: {
                none: {
                  courseId: courseIdIn
                }
              }
            }
          }
        });

        if (
          firstUnit &&
          firstUnit.unitId &&
          pendingUsers &&
          pendingUsers.length > 0
        ) {
          //inset dummy records
          const preparedData = pendingUsers.map((pendingUser) => ({
            courseId: courseIdIn,
            unitId: firstUnit.unitId,
            userId: pendingUser.userId,
            status: 'Not attempted'
          }));

          await this.prisma.lmsUnitProgress.createMany({
            data: preparedData,
            skipDuplicates: true
          });

          await this.prisma.hrisIncidentLogTable.create({
            data: {
              createdAt: new Date().toISOString(),
              system: 'gra_lms',
              cron: 'process_addDummyRecordForNotStartedUsers',
              comment: 'add dummy records @ ' + process.env.FRONT_URL,
              dataSet: (
                'courseId: ' +
                courseIdIn +
                ' unitId: ' +
                firstUnit.unitId +
                ' userIds: ' +
                pendingUsers.map((pendingUser) => pendingUser.userId).join(', ')
              )
                .toString()
                .substring(0, 9999)
            }
          });
        }
      }
    } catch (error) {
      console.error(
        'Error when processing addDummyRecordForNotStartedUsers: ' + error
      );
    }
  } //addDummyRecordForNotStartedUsers
}
