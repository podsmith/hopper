import * as z from 'zod';

import { ListSortOrder } from '@/constants/common';
import { ErrorMessage } from '@/constants/error-message';
import { RegEx } from '@/constants/regex';
import { datetime } from '@/utils/datetime';

export const SerialIdFieldSchema = (label = 'ID') =>
  z
    .string(ErrorMessage.Fields.KeyMustBeValidT(label, 'string'))
    .trim()
    .regex(
      RegEx.SerialId,
      ErrorMessage.Fields.KeyMustBeValidT(
        label,
        'positive integer with no leading zero',
      ),
    )
    .min(1)
    // Limit to the max based on PostgreSQL DB (https://www.postgresql.org/docs/current/datatype-numeric.html)
    .refine((v) => BigInt(v) <= 9_223_372_036_854_775_807n);

export const StringBooleanFieldSchema = (label = 'Flag') =>
  z.coerce
    .string(ErrorMessage.Fields.KeyMustBeValidT(label, 'string'))
    .trim()
    .lowercase()
    .transform((v) => ['true', '1', 'yes'].includes(v));

export const TimestampFieldSchema = (label = 'Timestamp') =>
  z
    .union([
      z.coerce
        .string(ErrorMessage.Fields.KeyMustBeValidT(label, 'timestamp'))
        .regex(
          RegEx.UtcTimestamp,
          ErrorMessage.Fields.KeyMustBeValidT(label, 'timestamp'),
        ),
      z.coerce.date(ErrorMessage.Fields.KeyMustBeValidT(label, 'timestamp')),
    ])
    .transform((v) => datetime(v, { utc: true }).toDate());

export const PasswordFieldSchema = (label = 'Password') =>
  z
    .string(ErrorMessage.Fields.KeyMustBeValidT(label, 'string'))
    .trim()
    .min(10, ErrorMessage.Fields.KeyMustHaveMinLength(label, 10))
    .max(30, ErrorMessage.Fields.KeyMustHaveMaxLength(label, 30))
    .refine(
      (v) => /[a-z]/.test(v),
      `${label} must have at least 1 lowercase letter`,
    )
    .refine(
      (v) => /[A-Z]/.test(v),
      `${label} must have at least 1 uppercase letter`,
    )
    .refine((v) => /\d/.test(v), `${label} must have at least 1 digit`)
    .refine(
      (v) => /[*=\-;:<>^!@#$%&()[\]]/.test(v),
      `${label} must have at least 1 special character`,
    )
    .refine((v) => !/\s/.test(v), `${label} must must not have any space(s)`);

export const EmailFieldSchema = (label = 'Email address') =>
  z.email({
    pattern: z.regexes.html5Email,
    error: ErrorMessage.Fields.KeyMustBeValidT(label, 'email'),
  });

export const ListSortOderFieldSchema = (label = 'Sort order') =>
  z.enum(
    ListSortOrder,
    ErrorMessage.Fields.KeyMustBeIncludedInValues(label, ListSortOrder),
  );

export const ListSortKeyFieldSchema = (
  values: Parameters<typeof z.enum>[0],
  label = 'Sort key',
) =>
  z.enum(values, ErrorMessage.Fields.KeyMustBeIncludedInValues(label, values));

export const PhoneNumberFieldSchema = (label = 'Phone number') =>
  z.coerce
    .string()
    .min(8, ErrorMessage.Fields.KeyMustHaveMinLength('Phone number', 8))
    .max(16, ErrorMessage.Fields.KeyMustHaveMaxLength('Phone number', 16))
    .regex(
      RegEx.PhoneNumberE164,
      ErrorMessage.Fields.KeyMustBeValidT(
        label,
        'phone number with E.164 format',
      ),
    );
