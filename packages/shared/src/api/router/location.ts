'server-only';

import type { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import { TYPES } from '#dep/inversify/types';
import { LocationService } from '#dep/service/index';
import { z } from 'zod';
import {
  deleteLocationAssetSchema,
  deleteLocationSchema,
  deleteFacilitySchema,
  findAllFacilityByIdSchema,
} from '../schema';

export const locationRouter = {
  findAllFacilityById: protectedProcedure
    .input(findAllFacilityByIdSchema)
    .query(async ({ ctx, input }) => {
      const locationService = ctx.container.get<LocationService>(
        TYPES.LocationService
      );

      const findAllFacilityById = await locationService.findAllFacilityById(
        input.id
      );

      return findAllFacilityById;
    }),

  deleteAsset: protectedProcedure
    .input(deleteLocationAssetSchema)
    .mutation(async ({ ctx, input }) => {
      const locationService = ctx.container.get<LocationService>(
        TYPES.LocationService
      );

      const deleteLocationAsset = await locationService.deleteAsset(
        input.assetId
      );

      return deleteLocationAsset;
    }),

  delete: protectedProcedure
    .input(deleteLocationSchema)
    .mutation(async ({ ctx, input }) => {
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
