import { Column, type EntityOptions } from 'typeorm';
import z from 'zod';

import { ErrorMessage } from '@/constants/error-message';

type EmailColumnOptions = Omit<
  EntityOptions,
  'length' | 'type' | 'transformer'
>;

export function EmailColumn(opts?: EmailColumnOptions) {
  return Column({
    ...opts,
    type: 'citext',
    transformer: {
      to(value?: string): string | null | undefined {
        return z
          .email(ErrorMessage.Fields.KeyMustBeValidT('Email address', 'email'))
          .nullish()
          .parse(value);
      },
      from(value?: string): string | null | undefined {
        return value;
      },
    },
  });
}
