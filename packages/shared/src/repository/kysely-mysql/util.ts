import { Query } from '#dep/db/index';
import { DB } from '#dep/db/schema';
import { entriesFromObject } from '#dep/util/index';
import {
  ExpressionBuilder,
  ReferenceExpression,
  SelectQueryBuilder,
  OrderByExpression,
  Expression,
  SqlBool,
} from 'kysely';

export function applyFilters<T extends keyof DB, F>(
  filters: Partial<F> | undefined,
  customFilters?: Expression<SqlBool>[]
) {
  return (eb: ExpressionBuilder<any, T>) => {
    // const empty = eb.and([]);
    const transformFilters = (filters?: Partial<F>) => {
      if (!filters) {
        return [];
      }
      return entriesFromObject(filters).flatMap(([key, value]) =>
        value !== undefined
          ? eb(key as ReferenceExpression<DB, T>, '=', value)
          : []
      );
    };

    const transformedFilters = [
      ...transformFilters(filters),
      ...(customFilters ?? []),
    ];

    return eb.and(transformedFilters);
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
