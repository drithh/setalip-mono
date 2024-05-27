import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { container } from '#dep/inversify/index';
import { TYPES } from '#dep/inversify/types';
import { LocationService } from '#dep/service/location';
import { z } from 'zod';

const deleteLocationAssetSchema = z.object({
  assetId: z.coerce.number().refine((data) => data > 0),
});

const deleteFacilityImageSchema = z.object({
  facilityId: z.coerce.number(),
});

export const locationRouter = {
  deleteLocationAsset: protectedProcedure
    .input(deleteLocationAssetSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const locationService = container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteLocationAsset = await locationService.deleteAsset(
        input.assetId
      );

      return deleteLocationAsset;
    }),
  deleteFacilityImage: protectedProcedure
    .input(deleteFacilityImageSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const locationService = container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteFacilityImage = await locationService.deleteFacilityImage(
        input.facilityId
      );

      return deleteFacilityImage;
    }),
} satisfies TRPCRouterRecord;
