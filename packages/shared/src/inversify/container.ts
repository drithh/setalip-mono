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
import { ResetPasswordRepository } from '#dep/repository/resetPassword';
import { KyselyMySqlResetPasswordRepository } from '#dep/repository/kysely-mysql/resetPassword';
import { ResetPasswordServiceImpl } from '#dep/service/resetPassword.impl';
import { ResetPasswordService } from '../service';
import { LocationRepository } from '#dep/repository/location';
import { KyselyMySqlLocationRepository } from '#dep/repository/kysely-mysql/locations';
import { LocationService } from '#dep/service/location';
import { LocationServiceImpl } from '#dep/service/location.impl';

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
container
  .bind<ResetPasswordRepository>(TYPES.ResetPasswordRepository)
  .to(KyselyMySqlResetPasswordRepository);
container
  .bind<ResetPasswordService>(TYPES.ResetPasswordService)
  .to(ResetPasswordServiceImpl);
container
  .bind<LocationRepository>(TYPES.LocationRepository)
  .to(KyselyMySqlLocationRepository);
container.bind<LocationService>(TYPES.LocationService).to(LocationServiceImpl);

export { container };
