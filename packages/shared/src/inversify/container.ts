import 'reflect-metadata';

import { Container } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import { Database, db } from '#dep/db/database';
import { UserRepository } from '#dep/repository/user';
import { KyselyMySqlUserRepository } from '#dep/repository/kysely-mysql/index';

const container = new Container();

container.bind<Database>(TYPES.Database).toConstantValue(db);
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(KyselyMySqlUserRepository);

export { container };
