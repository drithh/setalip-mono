import 'reflect-metadata';

import { Auth, lucia } from '#dep/auth/index';
import { Container } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { Database, db } from '#dep/db/index';
import { UserRepository } from '#dep/repository/user';
import { KyselyMySqlUserRepository } from '#dep/repository/kysely-mysql/index';

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);
container.bind<Auth>(TYPES.Auth).toConstantValue(lucia);
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(KyselyMySqlUserRepository);

export { container };
