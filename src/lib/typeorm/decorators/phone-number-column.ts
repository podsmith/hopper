import { Column, type EntityOptions } from 'typeorm';

import { PhoneNumberFieldSchema } from '@/validators/common/field';

type PhoneNumberColumnOptions = Omit<
  EntityOptions,
  'length' | 'type' | 'transformer'
> & {
  minLength?: number;
  maxLength?: number;
};

export function PhoneNumberColumn({
  minLength = 8,
  maxLength = 16,
  ...opts
}: PhoneNumberColumnOptions) {
  return Column({
    ...opts,
    type: 'varchar',
    length: maxLength,
    transformer: {
      to(value?: string): string | null | undefined {
        return PhoneNumberFieldSchema().parse(value);
      },
      from(value?: string | null): string | null | undefined {
        return value;
      },
    },
  });
}
