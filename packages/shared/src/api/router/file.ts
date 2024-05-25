import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import path from 'path';
import { writeFile } from 'fs/promises';

const fileUploadSchema = z.object({
  files: z.custom<File[] | File>((data) => {
    if (!Array.isArray(data)) {
      return data instanceof File;
    }
    for (const file of data) {
      if (!(file instanceof File)) {
        return false;
      }
    }
    return true;
  }, 'Data is not an instance of a File'),
});

export const fileRouter = {
  upload: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const host = 'localhost:3000'; // Default host
      const protocol = 'http';

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
            url: `${protocol}://${host}/uploads/${filename}`,
            name: file.name,
          };
        })
      );

      return fileInfos;
    }),
} satisfies TRPCRouterRecord;