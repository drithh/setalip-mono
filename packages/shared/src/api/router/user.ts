'server-only';

import { TYPES } from '#dep/inversify/types';
import { UserService } from '#dep/service/user';
import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import { findAllUserSchema, findCreditsByUserIdSchema } from '../schema';
import { SelectUser } from '#dep/repository/index';

export const userRouter = {
  findAll: protectedProcedure
    .input(findAllUserSchema)
    .query(async ({ ctx, input }) => {
      const roles = input.role
        ?.split('.')
        .map((role) => role) as SelectUser['role'][];

      const userService = ctx.container.get<UserService>(TYPES.UserService);

      const users = await userService.findAll({
        page: input.page,
        perPage: input.per_page,
        sort: input.sort,
        name: input.name,
        roles: roles,
      });

      return users;
    }),
  findAllMember: protectedProcedure.query(async ({ ctx }) => {
    const userService = ctx.container.get<UserService>(TYPES.UserService);

    const users = await userService.findAllMember();

    return users;
  }),
} satisfies TRPCRouterRecord;
