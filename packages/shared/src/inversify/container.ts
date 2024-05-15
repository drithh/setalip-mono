import 'reflect-metadata';

import { Container } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { Database, db } from '#dep/db/index';
import { UserRepository } from '#dep/repository/user';
import { KyselyMySqlUserRepository } from '#dep/repository/kysely-mysql/index';
import {
  NotificationService,
  WhatsappNotificationService,
} from '#dep/notification/index';
import { AuthServiceImpl } from '#dep/service/auth.impl';
import { AuthService } from '#dep/service/auth';
import { OtpRepository } from '#dep/repository/otp';
import { KyselyMySqlOtpRepository } from '#dep/repository/kysely-mysql/otp';
import { OtpServiceImpl } from '#dep/service/otp.impl';
import { OtpService } from '#dep/service/otp';

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);
container
  .bind<NotificationService>(TYPES.NotificationService)
  .to(WhatsappNotificationService);
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(KyselyMySqlUserRepository);
container.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
container.bind<OtpRepository>(TYPES.OtpRepository).to(KyselyMySqlOtpRepository);
container.bind<OtpService>(TYPES.OtpService).to(OtpServiceImpl);

export { container };
