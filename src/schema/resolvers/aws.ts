import S3 from 'aws-sdk/clients/s3';
import shortid = require('shortid');
import { Resolver, Args, Ctx, Query, Mutation } from 'type-graphql';
import { SignedImageUrlForInspection } from '@/types/aws/SignedImageUrlForInspection';
import { Context } from '@/helpers/interfaces';
import { ImagesToSignForInspectionArgs } from '@/types/aws/ImagesToSignForInspectionArgs';
import { ImagesToSignArgs } from '@/types/aws/ImagesToSignArgs';
import { SignedImageUrlForWorkOrder } from '@/types/aws/SignedImageUrlForWorkOrder';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { verifyAccess } from '@/helpers/utils';
import { SignedImageUrl } from '@/types/aws/SignedImageUrl';
import moment = require('moment');
import { LogEntry } from '@/types/logEntry/LogEntry';
import { UserReference } from '@/types/user/UserReference';
import { SignedImageUrlForMeterImage } from '@/types/aws/SignedImageUrlForMeterImage';
import { ImagesToSignForMeterImageArgs } from '@/types/aws/ImagesToSignForMeterImageArgs';
import { IdNameReference } from '@/types/common/IdNameReference';

@Resolver()
export class AwsResolver {
  @Mutation(() => [SignedImageUrlForInspection]!)
  async getSignedImageUrlsForInspection(
    @Args() { images, inspectionId, checklistId }: ImagesToSignForInspectionArgs,
    @Ctx() { session, req }: Context
  ): Promise<SignedImageUrlForInspection[]> {
    try {
      const bucket = 'uptimepm-pm';
      const region = 'us-east-2';
      const today = moment();
      const folder = req.user.clientId
        ? `${req.user.clientId}/${today.format('YYYY/MM/DD')}/${inspectionId}/`
        : `Corporate/${today.format('YYYY/MM/DD')}/${inspectionId}/`;

      const s3 = new S3({
        signatureVersion: 'v4',
        region: region,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const response: SignedImageUrlForInspection[] = [];
      const useChecklistId = checklistId ? checklistId : shortid.generate();
      for (const image of images) {
        const documentParams = {
          Bucket: bucket,
          Key: `${folder}${image.fileName}`,
          ContentType: image.fileType,
          ACL: 'public-read',
        };

        const signedUrl = await s3.getSignedUrl('putObject', documentParams);
        const awsWebUrl = `https://${bucket}.s3.amazonaws.com/${documentParams.Key}`;

        response.push({ signedUrl, awsWebUrl, fileName: image.fileName, checklistId: useChecklistId });
      }

      return response;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > AwsResolver > getSignedImageUrlsForInspection',
          {
            images,
            inspectionId,
            checklistId,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw ex.message;
    }
  }

  @Mutation(() => SignedImageUrlForMeterImage!)
  async getSignedImageUrlForMeterImage(
    @Args() { image, inspectionId }: ImagesToSignForMeterImageArgs,
    @Ctx() { session, req }: Context
  ): Promise<SignedImageUrlForMeterImage> {
    try {
      const bucket = 'uptimepm-pm';
      const region = 'us-east-2';
      const today = moment();
      const folder = req.user.clientId
        ? `${req.user.clientId}/${today.format('YYYY/MM/DD')}/${inspectionId}/`
        : `Corporate/${today.format('YYYY/MM/DD')}/${inspectionId}/`;

      const s3 = new S3({
        signatureVersion: 'v4',
        region: region,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const documentParams = {
        Bucket: bucket,
        Key: `${folder}meter.jpg`,
        ContentType: image.fileType,
        ACL: 'public-read',
      };

      const signedUrl = await s3.getSignedUrl('putObject', documentParams);
      const awsWebUrl = `https://${bucket}.s3.amazonaws.com/${documentParams.Key}`;

      return { signedUrl, awsWebUrl, fileName: image.fileName };
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > AwsResolver > getSignedImageUrlsForInspection',
          {
            image,
            inspectionId,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw ex.message;
    }
  }

  @Mutation(() => SignedImageUrlForWorkOrder!)
  async getSignedImageUrlsForWorkOrder(@Args() { images }: ImagesToSignArgs, @Ctx() { session, req }: Context): Promise<SignedImageUrlForWorkOrder> {
    verifyAccess(req, null);
    try {
      const workOrder = await WorkOrder.fromJwtUser(session, req.user!);
      await session.store(workOrder);
      await session.saveChanges();

      const bucket = 'uptimepm-wo';
      const region = 'us-east-2';
      const today = moment();
      const folder = req.user.clientId
        ? `${req.user.clientId}/${today.format('YYYY/MM/DD')}/${workOrder.id}/`
        : `Corporate/${today.format('YYYY/MM/DD')}/${workOrder.id}/`;

      // console.log('args', images);
      // console.log('process.env.AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
      // console.log('process.env.AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);

      const s3 = new S3({
        signatureVersion: 'v4',
        region,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const response: SignedImageUrl[] = [];
      for (const image of images) {
        const documentParams = {
          Bucket: bucket,
          Key: `${folder}${image.fileName}`,
          ContentType: image.fileType,
          ACL: 'public-read',
        };

        const signedUrl = await s3.getSignedUrl('putObject', documentParams);
        const awsWebUrl = `https://${bucket}.s3.amazonaws.com/${documentParams.Key}`;

        response.push({ signedUrl, awsWebUrl, fileName: image.fileName });
        workOrder.photos = workOrder.photos ? workOrder.photos.concat([awsWebUrl]) : [awsWebUrl];
      }

      try {
        await session.store(
          new LogEntry(
            'Resolvers > AwsResolver > getSignedImageUrlsForWorkOrder',
            {
              images,
            },
            '[TRACE]',
            null,
            await IdNameReference.clientFromJwtUser(session, req.user),
            await UserReference.fromJwtUser(session, req.user)
          )
        );
      } catch (err) {
        console.log(err.message);
      }

      await session.saveChanges();
      return { images: response, workOrderId: workOrder.id };
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > AwsResolver > getSignedImageUrlsForWorkOrder',
          {
            images,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw ex.message;
    }
  }
}
