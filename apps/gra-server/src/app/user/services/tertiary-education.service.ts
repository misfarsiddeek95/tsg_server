import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import * as moment from 'moment';
import { MailService } from '../../mail/mail.service';
import { CreateTertiaryEducationDto } from '../dtos/tertiary-education.dto';
import { EducationService } from './education.service';

@Injectable()
export class TertiaryEducationService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private educaion: EducationService
  ) {}

  async tertiaryEducationDetails(
    { userId }: { userId: number },
    details: CreateTertiaryEducationDto
  ) {
    try {
      // TO DO: insert to hris_qualifications_data a record & get auto increment id,
      // insert multiple qualifications to dtb xother_quali_data

      const qualification = await this.prisma.hrisQualificationsData.create({
        data: {
          tspId: userId
        }
      });

      const allData: Prisma.XotherQualiDataCreateManyInput[] =
        details.educations.map((education) => {
          return {
            tspId: userId,
            qId: qualification.id,
            courseType: education.hqCourseType,
            mainInst: education.hqMainInst,
            fieldStudy: education.hqFieldStudy,
            startYear: new Date(education.hqStartDate).toISOString(),
            completionYear: new Date(education.hqCompletionDate).toISOString(),
            hasMathStat: education.hasMathStat
          };
        });

      await this.prisma.xotherQualiData.createMany({
        data: allData
      });

      const tertiary = await this.prisma.xotherQualiData.findMany({
        where: {
          tspId: userId
        }
      });

      // if secondary education is completed then check for conditions to send emails
      const result = await this.educaion.checkSTEM({ userId });

      return { success: true, data: tertiary, result };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getTertiaryEducationDetails({
    userId
  }: {
    username: string;
    userId: number;
  }) {
    try {
      const tertiary = await this.prisma.hrisQualificationsData.findFirst({
        where: {
          tspId: userId
        },
        orderBy: {
          id: 'desc'
        },
        include: {
          xother_quali_data: true
        }
      });
      return { success: true, data: tertiary.xother_quali_data };
    } catch (error) {
      return { success: false, error };
    }
  }
}
