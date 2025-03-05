import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';

const credentials = {
  accessKeyId: process.env.NX_ERP_BUCKET_KEY,
  secretAccessKey: process.env.NX_ERP_BUCKET_SECRET
};

const bucket = process.env.NX_ERP_BUCKET_NAME;
const region = process.env.NX_ERP_BUCKET_REGION;

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  getStemDetails() {
    return this.prisma.stemCriteria.findMany();
  }

  async getSignedUrl(path: string) {
    const s3Configuration: S3ClientConfig = {
      credentials,
      region
    };
    // console.log('s3 -.', s3Configuration);
    const s3 = new S3Client(s3Configuration);
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: path.charAt(0) === '/' ? `${path}`.slice(1) : path
    });
    const signedUrlPromise = getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
    // Create a GET request from S3 url.
    const signedUrl = await signedUrlPromise;

    return signedUrl;
  }
}
