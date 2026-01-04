import z from 'zod';

import { ListSortOrder } from '@/constants/common';
import { CountryListSortKey } from '@/constants/country';
import { ErrorMessage } from '@/constants/error-message';
import type { InferZodOrNull } from '@/types/utils';
import {
  ListSortKeyFieldSchema,
  ListSortOderFieldSchema,
  SerialIdFieldSchema,
  StringBooleanFieldSchema,
  TimestampFieldSchema,
} from '@/validators/common/field';
import {
  PaginationMetadataSchema,
  SearchPaginationQuerySchema,
} from '@/validators/common/schema';

export const ListCountryMetadataRequestQuerySchema = z
  .object({
    withDeleted: StringBooleanFieldSchema(),
    sortKey: ListSortKeyFieldSchema(CountryListSortKey).default(
      CountryListSortKey.Name,
    ),
    sortOrder: ListSortOderFieldSchema().default(ListSortOrder.Asc),
  })
  .extend(SearchPaginationQuerySchema.shape);
export type ListCountryMetadataRequestQuerySchema = InferZodOrNull<
  typeof ListCountryMetadataRequestQuerySchema
>;

export const CountrySchema = z.object({
  name: z.coerce.string().trim().nonempty(),
  iso3: z.coerce
    .string()
    .trim()
    .nonempty()
    .toUpperCase()
    .min(3, ErrorMessage.Fields.KeyMustHaveMinLength('Country code', 3))
    .max(3, ErrorMessage.Fields.KeyMustHaveMaxLength('Country code', 3)),
});

export const CountryWithIdSchema = z
  .object({ id: SerialIdFieldSchema() })
  .extend(CountrySchema.shape);

export const CreateCountryMetadataRequestBodySchema = z.object({
  country: CountrySchema,
});
export type CreateCountryMetadataRequestBodySchema = InferZodOrNull<
  typeof CreateCountryMetadataRequestBodySchema
>;

export const CreateCountryMetadataResponseSchema = z.object({
  country: CountryWithIdSchema,
});

export const ListCountryMetadataResponseSchema = z
  .object({
    countries: z.array(
      z
        .object({ deletedAt: TimestampFieldSchema().nullable() })
        .extend(CountryWithIdSchema.shape),
    ),
  })
  .extend(PaginationMetadataSchema.shape);
