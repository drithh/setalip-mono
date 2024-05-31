import { Container } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { Database, db } from '#dep/db/index';
import {
  UserRepository,
  OtpRepository,
  LocationRepository,
  ResetPasswordRepository,
  PackageRepository,
  ClassTypeRepository,
} from '#dep/repository/index';
import {
  KyselyMySqlUserRepository,
  KyselyMySqlOtpRepository,
  KyselyMySqlLocationRepository,
  KyselyMySqlResetPasswordRepository,
  KyselyMySqlPackageRepository,
  KyselyMySqlClassTypeRepository,
} from '#dep/repository/kysely-mysql/index';
import {
  NotificationService,
  WhatsappNotificationService,
} from '#dep/notification/index';
import {
  AuthServiceImpl,
  OtpServiceImpl,
  ResetPasswordServiceImpl,
  LocationServiceImpl,
  PackageServiceImpl,
  ClassTypeServiceImpl,
} from '#dep/service/index.impl';
import {
  AuthService,
  OtpService,
  ResetPasswordService,
  LocationService,
  PackageService,
  ClassTypeService,
} from '#dep/service/index';

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
container
  .bind<PackageRepository>(TYPES.PackageRepository)
  .to(KyselyMySqlPackageRepository);
container.bind<PackageService>(TYPES.PackageService).to(PackageServiceImpl);
container
  .bind<ClassTypeRepository>(TYPES.ClassTypeRepository)
  .to(KyselyMySqlClassTypeRepository);
container
  .bind<ClassTypeService>(TYPES.ClassTypeService)
  .to(ClassTypeServiceImpl);

export { container };
