import { agendaRouter } from './router/agenda';
import { authRouter } from './router/auth';
import { creditRouter } from './router/credit';
import { fileRouter } from './router/file';
import { locationRouter } from './router/location';
import { loyaltyRouter } from './router/loyalty';
import { cronRouter } from './router/cron';
import { packageRouter } from './router/package';
import { statisticRouter } from './router/statistic';
import { userRouter } from './router/user';
import { voucherRouter } from './router/voucher';
import { webSettingRouter } from './router/web-settings';
import { createTRPCRouter } from './trpc';
import { classRouter } from './router/class';
import { reportFormRouter } from './router/report-form';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  class: classRouter,
  location: locationRouter,
  file: fileRouter,
  package: packageRouter,
  user: userRouter,
  agenda: agendaRouter,
  credit: creditRouter,
  loyalty: loyaltyRouter,
  webSetting: webSettingRouter,
  voucher: voucherRouter,
  statistic: statisticRouter,
  cron: cronRouter,
  reportForm: reportFormRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
