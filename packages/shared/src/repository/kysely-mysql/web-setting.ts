import { Database, db } from '#dep/db/index';

import { injectable, inject } from 'inversify';
import { TYPES } from '#dep/inversify/types';
import {
  InsertCarousel,
  InsertDepositAccount,
  InsertFrequentlyAskedQuestion,
  InsertReview,
  SelectCarousel,
  SelectContact,
  SelectDepositAccount,
  SelectFrequentlyAskedQuestion,
  SelectLogo,
  SelectReview,
  UpdateCarousel,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestion,
  UpdateReview,
  UpdateWebSetting,
  WebSettingRepository,
  findAllDepositAccountOption,
  findAllFrequentlyAskedQuestionOption,
  findAllReviewOption,
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

    return {
      instagram_handle:
        queryContact.find((q) => q.key === 'instagram_handle')?.value || '',
      tiktok_handle:
        queryContact.find((q) => q.key === 'tiktok_handle')?.value || '',
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

  async findAllFrequentlyAskedQuestion(
    data: findAllFrequentlyAskedQuestionOption
  ) {
    const { page = 1, perPage = 10, sort, question } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectFrequentlyAskedQuestion} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('frequently_asked_questions');

    if (question) {
      query = query.where('question', 'like', `%${question}%`);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [
        fn.count<number>('frequently_asked_questions.id').as('count'),
      ])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  async findAllDepositAccount(data: findAllDepositAccountOption) {
    const { page = 1, perPage = 10, sort, name } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectDepositAccount} ${'asc' | 'desc'}`;

    let query = this._db.selectFrom('deposit_accounts');

    if (name) {
      query = query.where('name', 'like', `%${name}%`);
    }

    const queryData = await query
      .selectAll()
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('deposit_accounts.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
  }

  async findDepositAccountById(id: SelectDepositAccount['id']) {
    const query = await this._db
      .selectFrom('deposit_accounts')
      .where('deposit_accounts.id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return query;
  }

  async findAllReview(data: findAllReviewOption) {
    const { page = 1, perPage = 10, sort, email } = data;

    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectReview} ${'asc' | 'desc'}`;

    let query = this._db
      .selectFrom('reviews')
      .innerJoin('users', 'reviews.user_id', 'users.id');

    if (email) {
      query = query.where('users.email', 'like', `%${email}%`);
    }

    const queryData = await query
      .selectAll('reviews')
      .select(['users.created_at as joined_at', 'name', 'email'])
      .limit(perPage)
      .offset(offset)
      .orderBy(orderBy)
      .execute();

    const queryCount = await query
      .select(({ fn }) => [fn.count<number>('reviews.id').as('count')])
      .executeTakeFirst();

    const pageCount = Math.ceil((queryCount?.count ?? 0) / perPage);

    return {
      data: queryData,
      pageCount: pageCount,
    };
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

  async findAllCarousel() {
    const query = await this._db.selectFrom('carousels').selectAll().execute();

    return query;
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

  async createFrequentlyAskedQuestion(data: InsertFrequentlyAskedQuestion) {
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

  async createCarousel(data: InsertCarousel) {
    try {
      const query = this._db
        .insertInto('carousels')
        .values(data)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to create carousel', result);
        return new Error('Failed to create carousel');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating carousel:', error);
      return new Error('Failed to create carousel');
    }
  }

  async update(data: UpdateWebSetting[]) {
    try {
      await db.transaction().execute(async (trx) => {
        for (const d of data) {
          if (!d.key) {
            continue;
          }
          const query = await trx
            .updateTable('web_settings')
            .set({
              value: d.value,
            })
            .where('web_settings.key', '=', d.key)
            .executeTakeFirst();

          if (query.numUpdatedRows === undefined) {
            console.error('Failed to update web setting', query);
            return new Error('Failed to update web setting');
          }
        }
      });

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

  async updateFrequentlyAskedQuestion(
    data: UpdateFrequentlyAskedQuestion
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

  async updateCarousel(data: UpdateCarousel): Promise<Error | undefined> {
    try {
      const query = await this._db
        .updateTable('carousels')
        .set(data)
        .where('carousels.id', '=', data.id)
        .executeTakeFirst();

      if (query.numUpdatedRows === undefined) {
        console.error('Failed to update carousel', query);
        return new Error('Failed to update carousel');
      }

      return;
    } catch (error) {
      console.error('Error updating carousel:', error);
      return new Error('Failed to update carousel');
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

  async deleteFrequentlyAskedQuestion(id: SelectFrequentlyAskedQuestion['id']) {
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

  async deleteCarousel(id: SelectCarousel['id']) {
    try {
      const query = this._db
        .deleteFrom('carousels')
        .where('carousels.id', '=', id)
        .returningAll()
        .compile();

      const result = await this._db.executeQuery(query);

      if (result.rows[0] === undefined) {
        console.error('Failed to delete carousel', result);
        return new Error('Failed to delete carousel');
      }

      return;
    } catch (error) {
      console.error('Error deleting carousel:', error);
      return new Error('Failed to delete carousel');
    }
  }
}
