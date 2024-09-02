'server-only';

import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { z } from 'zod';
import { S3 } from 'aws-sdk';
import { fileUploadSchema } from '../schema';
import { env } from '#dep/env';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import path from 'path';
import { writeFile } from 'fs/promises';

// Configure AWS SDK
const s3 = new S3({
  region: env.AWS_REGION, // Replace with your AWS region
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const fileRouter = {
  upload: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ ctx, input }) => {
      let files = input.files;
      if (!Array.isArray(files)) {
        files = [files];
      }

      const fileInfos = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const timestamp = new Date().getTime();
          const filename = `${timestamp}_${file.name.replaceAll(' ', '_').toLowerCase()}`;
          const filePath = `uploads/${filename}`;
          const s3Params: PutObjectRequest = {
            Bucket: env.AWS_S3_BUCKET,
            Key: filePath,
            Body: buffer,
            ContentLength: buffer.length, // Ensure the correct Content-Length is set
            ContentType: file.type, // Ensure the correct MIME type is set
            ACL: 'public-read', // Make the file publicly accessible
          };

          // Upload the file to S3
          const uploadResult = await s3.upload(s3Params).promise();
          const url = `https://pub-f622985fd92b4796a691361dda9a213a.r2.dev/${uploadResult.Key}`;

          return {
            url: url, // URL of the uploaded file in S3
            name: file.name,
          };
        })
      );

      return fileInfos;
    }),
  uploadLocal: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ ctx, input }) => {
      // const host = ; // Default host

      let files = input.files;
      if (!Array.isArray(files)) {
        files = [files];
      }

      const fileInfos = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const timestamp = new Date().getTime();
          const filename = `${timestamp}_${file.name.replaceAll(' ', '_').toLowerCase()}`;

          let currentPath = '/home/uploads/';
          if (env.WEB_URL === 'http://localhost:3001') {
            // Move up three directories
            currentPath = process.cwd();
            for (let i = 0; i < 2; i++) {
              currentPath = path.dirname(currentPath);
            }
          }

          const fullPath = path.join(currentPath, 'uploads', filename);
          await writeFile(fullPath, buffer);

          return {
            url: `${env.WEB_URL}/uploads/${filename}`,
            name: file.name,
          };
        })
      );

      return fileInfos;
    }),
} satisfies TRPCRouterRecord;
