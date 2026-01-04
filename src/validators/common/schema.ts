import * as z from 'zod';

import { ErrorMessage } from '@/constants/error-message';

export const PaginationQuerySchema = z.object({
  page: z.coerce
    .number(ErrorMessage.Fields.KeyMustBeValidT('Page number', 'integer'))
    .min(1, ErrorMessage.Fields.KeyMustHaveMinValue('Page number', 1))
    .default(1),
  limit: z.coerce
    .number(ErrorMessage.Fields.KeyMustBeValidT('Pagination limit', 'integer'))
    .min(10, ErrorMessage.Fields.KeyMustHaveMinValue('Pagination limit', 10))
    .max(50, ErrorMessage.Fields.KeyMaxHaveMaxValue('Pagination limit', 50))
    .default(10),
});

export const SearchPaginationQuerySchema = z
  .object({ search: z.coerce.string().default('') })
  .extend(PaginationQuerySchema.shape);

export const PaginationMetadataSchema = z.object({
  metadata: z.object({
    totalRecords: z.number().int(),
    totalPages: z.number().int(),
    nextPage: z.number().int().nullish(),
    prevPage: z.number().int().nullish(),
    currPage: z.number().int(),
  }),
});

export const PaginationWithSearchQuerySchema = z
  .object({
    search: z
      .string(ErrorMessage.Fields.KeyMustBeValidT('Search query', 'string'))
      .optional()
      .default(''),
  })
  .extend(PaginationQuerySchema.shape);

export const BaseErrorResponseSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  details: z.any().optional(),
});
