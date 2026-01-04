import type * as z from 'zod';

export type Primitive = string | number | bigint | boolean | null | undefined;
export type FlatPrimitiveRecord = Record<string, Primitive | Primitive[]>;
export type FlatNestedPrimitiveRecord = Record<
  string,
  FlatPrimitiveRecord | FlatPrimitiveRecord[] | Primitive | Primitive[]
>;
export type ObjectType =
  | FlatNestedPrimitiveRecord
  | FlatNestedPrimitiveRecord[];
export type InferZodOrNull<T> = T extends z.ZodType ? z.infer<T> : null;
export type NonEmptyArray<T> = [T, ...T[]];
