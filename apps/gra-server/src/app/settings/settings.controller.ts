import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  S3Client,
  GetObjectCommand,
  S3ClientConfig,
  PutObjectCommand
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const credentials = {
  accessKeyId: process.env.NX_ERP_BUCKET_KEY,
  secretAccessKey: process.env.NX_ERP_BUCKET_SECRET
};

const bucket = process.env.NX_ERP_BUCKET_NAME;
const region = process.env.NX_ERP_BUCKET_REGION;

@ApiTags('GRA Setting Controller')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('stem-criteria')
  @ApiOperation({ summary: 'Get Stem criteria' })
  @ApiResponse({
    status: 200,
    description: 'Successful'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden'
  })
  getStemDetails() {
    return this.settingsService.getStemDetails();
  }

  @UseGuards(JwtAuthGuard)
  @Post('presigned-urls')
  async createPresignedUrls(
    @Body()
    { paths, userType }: { paths: { [key: string]: string }; userType: string },
    @Request() req: any
  ) {
    const [keys, signedPathsPromise, filePaths] = Object.entries(paths).reduce(
      (prev, [key, path]: any) => {
        // const [_, extension] = path.slice('.');
        // const s3ObjectUrl = parseUrl(
        //   `https://${bucket}.s3.${region}.amazonaws.com/${Date.now()}.${extension}`
        // );
        // const presigner = new S3RequestPresigner({
        //   credentials,
        //   region,
        //   expires: 20 * 60,
        //   sha256: Hash.bind(null, 'sha256') // In Node.js
        //   //sha256: Sha256 // In browsers
        // });

        const s3Configuration: S3ClientConfig = {
          credentials,
          region
        };
        const tspId =
          userType === 'candidate' ? req.user.userId : path.split('/')[0] ?? 0;

        let tempPath =
          userType === 'candidate' ? `${req.user.userId}/${path}` : `${path}`; // made according to candidate or auditor

        // custom file path logics based on various criterias
        if (
          tempPath.includes('hris_profile_picture_bk') &&
          tempPath.includes('pro_pic.png')
        ) {
          //custom logic for profile picture uploads (dupliate file saving)
          tempPath = `hris-profile-pictures/${tspId}.png`;
        } else if (tempPath.includes('nthris_profile_picture_bk')) {
          //custom logic for profile picture uploads in nthris
          tempPath = `hris-profile-pictures/${tspId}.png`;
        } else if (
          tempPath.includes('hris-resource-documents') &&
          userType !== 'candidate'
        ) {
          //custom logic for resource docs to be saved in a common folder rather than auditor's
          tempPath = tempPath.replace(`${tspId}/`, '');
        }

        // console.log('path', path);
        // console.log('userType', userType);
        // console.log('tspId', tspId);
        // console.log('tempPath', tempPath);

        const s3 = new S3Client(s3Configuration);
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: tempPath
        });
        const signedUrlPromise = getSignedUrl(s3, command, {
          expiresIn: 15 * 60
        }); // expires in seconds
        // Create a GET request from S3 url.
        prev[0].push(key);
        prev[1].push(signedUrlPromise);
        prev[2].push(`/${tempPath}`);

        return prev;
      },
      [[], [], []]
    );

    const signedPaths = await Promise.all(signedPathsPromise);
    return signedPaths.reduce((prev, path, index) => {
      prev[keys[index]] = { signedUrl: path, path: filePaths[index] };
      return prev;
    }, {} as any);
  }

  @Post('presigned-url')
  async presignedUrlForReading(@Body() { path }: { path: string }) {
    const s3Configuration: S3ClientConfig = {
      credentials,
      region
    };
    // console.log('s3 -.', s3Configuration);
    const s3 = new S3Client(s3Configuration);
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: path && path.charAt(0) === '/' ? `${path}`.slice(1) : path ?? 'NA'
    });
    const signedUrlPromise = getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
    // Create a GET request from S3 url.
    const signedUrl = await signedUrlPromise;

    return signedUrl;
  }
}
