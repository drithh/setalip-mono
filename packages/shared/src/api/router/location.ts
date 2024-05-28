import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { TYPES } from '#dep/inversify/types';
import { LocationService } from '#dep/service/location';
import { z } from 'zod';

const deleteLocationSchema = z.object({
  locationId: z.coerce.number().refine((data) => data > 0),
});

const deleteLocationAssetSchema = z.object({
  assetId: z.coerce.number().refine((data) => data > 0),
});

const deleteFacilitySchema = z.object({
  facilityId: z.coerce.number(),
});

export const locationRouter = {
  deleteLocationAsset: protectedProcedure
    .input(deleteLocationAssetSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const locationService = ctx.container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteLocationAsset = await locationService.deleteAsset(
        input.assetId
      );

      return deleteLocationAsset;
    }),
  deleteLocation: protectedProcedure
    .input(deleteLocationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error('Unauthorized');
      }

      const locationService = ctx.container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteLocation = await locationService.delete(input.locationId);

      return deleteLocation;
    }),
  deleteFacility: protectedProcedure
    .input(deleteFacilitySchema)
    .mutation(async ({ ctx, input }) => {
      const locationService = ctx.container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteFacility = await locationService.deleteFacility(
        input.facilityId
      );

      if (deleteFacility instanceof Error) {
        throw deleteFacility;
      }

      return deleteFacility;
    }),
} satisfies TRPCRouterRecord;
