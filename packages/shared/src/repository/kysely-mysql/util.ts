import { Query } from '#dep/db/index';
import { DB } from '#dep/db/schema';
import { entriesFromObject } from '#dep/util/index';
import {
  ExpressionBuilder,
  ReferenceExpression,
  SelectQueryBuilder,
  OrderByExpression,
} from 'kysely';

export function applyFilters<T extends keyof DB, F>(
  filters: Partial<F> | undefined
) {
  return (eb: ExpressionBuilder<DB, T>) => {
    if (!filters) {
      return eb.and([]);
    }
    const appliedFilters = entriesFromObject(filters).flatMap(([key, value]) =>
      value !== undefined
        ? eb(key as ReferenceExpression<DB, T>, '=', value)
        : []
    );
    return eb.and(appliedFilters);
  };
}

export function applyModifiers<T extends keyof DB, F>(
  query: SelectQueryBuilder<DB, T, {}>,
  data?: Query<F>
) {
  if (data?.offset) {
    query = query.offset(data.offset);
  }
  if (data?.perPage) {
    query = query.limit(data.perPage);
  }
  if (data?.orderBy) {
    query = query.orderBy(data.orderBy as any);
  }
  return query;
}
