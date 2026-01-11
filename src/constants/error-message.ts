import type * as z from 'zod';

export const ErrorMessage = {
  Generic: {
    SomethingWentWrong: 'Something went wrong',
    PayloadSizeExceeds: 'Payload exceeded maximum body limit',
    InvalidPayload: 'The payload contains invalid or missing information',
    IncorrectResponse: "Your request succeeded, but we couldn't finalize the response",
    RequestTimeout: (ms: number) => `Request timed out after ${ms}ms`,
  },
  Fields: {
    KeyMustBeValidT: (key: string, type: string) => `${key} must be a valid ${type}`,
    KeyMustHaveMinLength: (key: string, length: number) =>
      `${key} must have at least ${length} character(s)`,
    KeyMustHaveMaxLength: (key: string, length: number) =>
      `${key} can have at most ${length} character(s)`,
    KeyMustHaveMinValue: (key: string, value: number) => `${key} must be at least ${value}`,
    KeyMaxHaveMaxValue: (key: string, value: number) => `${key} can be at most ${value}`,
    KeyNotFound: (key: string) => `The ${key} could not be found`,
    KeyMustContainT: (key: string, t: string) => `${key} must contain ${t}`,
    KeyMustBeIncludedInValues: (key: string, values: Parameters<typeof z.enum>[0]) =>
      `${key} must be one of the following: ${Object.values(values)
        .map((v) => v.toString())
        .join(', ')}`,
  },
} as const;
