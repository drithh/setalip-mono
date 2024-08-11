'server-only';

import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import path from 'path';
import { writeFile } from 'fs/promises';
import { fileUploadSchema } from '../schema';
import { env } from '#dep/env';

export const fileRouter = {
  upload: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const host = env.ADMIN_URL; // Default host

      let files = input.files;
      if (!Array.isArray(files)) {
        files = [files];
      }

      const fileInfos = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const timestamp = new Date().getTime();
          const filename = `${timestamp}_${file.name.replaceAll(' ', '_').toLowerCase()}`;
          const fullPath = path.join(
            process.cwd(),
            'public',
            'uploads',
            filename
          );
          await writeFile(fullPath, buffer);

          return {
            url: `${host}/uploads/${filename}`,
            name: file.name,
          };
        })
      );

      return fileInfos;
    }),
} satisfies TRPCRouterRecord;
