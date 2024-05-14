import 'reflect-metadata';

import { Auth, lucia } from '#dep/auth/index';
import { Container } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { Database, db } from '#dep/db/index';
import { UserRepository } from '#dep/repository/user';
import { KyselyMySqlUserRepository } from '#dep/repository/kysely-mysql/index';
import {
  NotificationService,
  WhatsappNotificationService,
} from '#dep/notification/index';
import { UserServiceImpl } from '#dep/service/user.impl';
import { UserService } from '#dep/service/user';

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);
container.bind<Auth>(TYPES.Auth).toConstantValue(lucia);
container
  .bind<NotificationService>(TYPES.NotificationService)
  .to(WhatsappNotificationService);
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(KyselyMySqlUserRepository);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);

export { container };
