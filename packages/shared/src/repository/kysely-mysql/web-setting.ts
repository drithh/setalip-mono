import { Database } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  SelectContact,
  SelectLogo,
  WebSettingRepository,
} from '../web-setting';
import { sql } from 'kysely';
import { SelectUser } from '../user';

@injectable()
export class KyselyMySqlWebSettingRepository implements WebSettingRepository {
  private _db: Database;

  constructor(@inject(TYPES.Database) db: Database) {
    this._db = db;
  }

  async findLogo() {
    const query = await this._db
      .selectFrom('web_settings')
      .where('web_settings.key', '=', 'logo')
      .select('value')
      .executeTakeFirst();

    if (!query) {
      return;
    }

    return {
      logo: query.value,
    };
  }
  async findContact() {
    const contact = ['instagram_handle', 'tiktok_handle'];
    const queryContact = await this._db
      .selectFrom('web_settings')
      .where('web_settings.key', 'in', contact)
      .select(['key', 'value'])
      .execute();

    if (!queryContact) {
      return;
    }

    const queryFAQ = await this._db
      .selectFrom('frequently_asked_questions')
      .selectAll()
      .execute();

    return {
      instagram:
        queryContact.find((q) => q.key === 'instagram_handle')?.value || '',
      tiktok: queryContact.find((q) => q.key === 'tiktok_handle')?.value || '',
      frequenly_asked_questions: queryFAQ,
    };
  }

  async findAllReview() {
    return this._db
      .selectFrom('reviews')
      .innerJoin('users', 'reviews.user_id', 'users.id')
      .selectAll('reviews')
      .select(['users.created_at as joined_at', 'name', 'email'])
      .execute();
  }
}
