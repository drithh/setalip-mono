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
  AgendaRepository,
  CoachRepository,
  ClassRepository,
} from '#dep/repository/index';
import {
  KyselyMySqlUserRepository,
  KyselyMySqlOtpRepository,
  KyselyMySqlLocationRepository,
  KyselyMySqlResetPasswordRepository,
  KyselyMySqlPackageRepository,
  KyselyMySqlClassTypeRepository,
  KyselyMySqlAgendaRepository,
  KyselyMySqlCoachRepository,
  KyselyMySqlClassRepository,
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
  UserServiceImpl,
  AgendaServiceImpl,
  CoachServiceImpl,
  ClassServiceImpl,
} from '#dep/service/index.impl';
import {
  AuthService,
  OtpService,
  ResetPasswordService,
  LocationService,
  PackageService,
  ClassTypeService,
  UserService,
  AgendaService,
  CoachService,
  ClassService,
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
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container
  .bind<AgendaRepository>(TYPES.AgendaRepository)
  .to(KyselyMySqlAgendaRepository);
container.bind<AgendaService>(TYPES.AgendaService).to(AgendaServiceImpl);
container.bind<ClassService>(TYPES.ClassService).to(ClassServiceImpl);
container
  .bind<ClassRepository>(TYPES.ClassRepository)
  .to(KyselyMySqlClassRepository);
container
  .bind<CoachRepository>(TYPES.CoachRepository)
  .to(KyselyMySqlCoachRepository);
container.bind<CoachService>(TYPES.CoachService).to(CoachServiceImpl);

export { container };

// pretty query
