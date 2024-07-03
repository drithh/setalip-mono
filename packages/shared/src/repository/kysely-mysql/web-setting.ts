import { Database } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestions,
  InsertReview,
  SelectContact,
  SelectDepositAccount,
  SelectFrequencyAskedQuestions,
  SelectLogo,
  SelectReview,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestions,
  UpdateReview,
  UpdateWebSetting,
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

  async findAllDepositAccount() {
    return this._db.selectFrom('deposit_accounts').selectAll().execute();
  }

  async findAllReview() {
    return this._db
      .selectFrom('reviews')
      .innerJoin('users', 'reviews.user_id', 'users.id')
      .selectAll('reviews')
      .select(['users.created_at as joined_at', 'name', 'email'])
      .execute();
  }

  async findTermsAndConditions() {
    const query = await this._db
      .selectFrom('web_settings')
      .where('web_settings.key', '=', 'terms_and_conditions')
      .select('value')
      .executeTakeFirst();

    if (!query) {
      return;
    }

    return query.value;
  }

  async findPrivacyPolicy() {
    const query = await this._db
      .selectFrom('web_settings')
      .where('web_settings.key', '=', 'privacy_policy')
      .select('value')
      .executeTakeFirst();

    if (!query) {
      return;
    }

    return query.value;
  }

  async createDepositAccount(data: InsertDepositAccount) {
    try {
      const query = this._db
        .insertInto('deposit_accounts')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create package', result);
        return new Error('Failed to create package');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating package:', error);
      return new Error('Failed to create package');
    }
  }

  async createReview(data: InsertReview) {
    try {
      const query = this._db
        .insertInto('reviews')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create review', result);
        return new Error('Failed to create review');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating review:', error);
      return new Error('Failed to create review');
    }
  }

  async createFrequentlyAskedQuestions(data: InsertFrequentlyAskedQuestions) {
    try {
      const query = this._db
        .insertInto('frequently_asked_questions')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create FAQ', result);
        return new Error('Failed to create FAQ');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return new Error('Failed to create FAQ');
    }
  }

  async update(data: UpdateWebSetting) {
    try {
      const query = await this._db
        .updateTable('web_settings')
        .set(data)
        .where('web_settings.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update web setting', query);
        return new Error('Failed to update web setting');
      }

      return;
    } catch (error) {
      console.error('Error updating web setting:', error);
      return new Error('Failed to update web setting');
    }
  }

  async updateDepositAccount(
    data: UpdateDepositAccount
  ): Promise<Error | undefined> {
    try {
      const query = await this._db
        .updateTable('deposit_accounts')
        .set(data)
        .where('deposit_accounts.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update deposit account', query);
        return new Error('Failed to update deposit account');
      }

      return;
    } catch (error) {
      console.error('Error updating deposit account:', error);
      return new Error('Failed to update deposit account');
    }
  }

  async updateReview(data: UpdateReview): Promise<Error | undefined> {
    try {
      const query = await this._db
        .updateTable('reviews')
        .set(data)
        .where('reviews.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update review', query);
        return new Error('Failed to update review');
      }

      return;
    } catch (error) {
      console.error('Error updating review:', error);
      return new Error('Failed to update review');
    }
  }

  async updateFrequentlyAskedQuestions(
    data: UpdateFrequentlyAskedQuestions
  ): Promise<Error | undefined> {
    try {
      const query = await this._db
        .updateTable('frequently_asked_questions')
        .set(data)
        .where('frequently_asked_questions.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update FAQ', query);
        return new Error('Failed to update FAQ');
      }

      return;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return new Error('Failed to update FAQ');
    }
  }

  async deleteDepositAccount(id: SelectDepositAccount['id']) {
    try {
      const query = this._db
        .deleteFrom('deposit_accounts')
        .where('deposit_accounts.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete deposit account', result);
        return new Error('Failed to delete deposit account');
      }

      return;
    } catch (error) {
      console.error('Error deleting deposit account:', error);
      return new Error('Failed to delete deposit account');
    }
  }

  async deleteReview(id: SelectReview['id']) {
    try {
      const query = this._db
        .deleteFrom('reviews')
        .where('reviews.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete review', result);
        return new Error('Failed to delete review');
      }

      return;
    } catch (error) {
      console.error('Error deleting review:', error);
      return new Error('Failed to delete review');
    }
  }

  async deleteFrequentlyAskedQuestions(
    id: SelectFrequencyAskedQuestions['id']
  ) {
    try {
      const query = this._db
        .deleteFrom('frequently_asked_questions')
        .where('frequently_asked_questions.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete FAQ', result);
        return new Error('Failed to delete FAQ');
      }

      return;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return new Error('Failed to delete FAQ');
    }
  }
}
