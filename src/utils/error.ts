import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import type { $ZodIssue } from 'zod/v4/core';

import { ErrorMessage } from '@/constants/error-message';
import { HttpStatus } from '@/constants/http-status';

type CustomErrorDetail =
  | Record<
      string,
      | $ZodIssue
      | $ZodIssue[]
      | string
      | number
      | boolean
      | string[]
      | number[]
      | boolean[]
      | Record<string, unknown>
      | undefined
    >
  | undefined;

type ZodErrorDetail =
  | {
      inline: true;
      source: 'request_body' | 'request_param' | 'request_query';
      issues: $ZodIssue[];
    }
  | {
      inline: false;
      source?: 'request_body' | 'request_param' | 'request_query';
      issues: Record<string, string | number | boolean | string[] | number[] | boolean[]>;
    };

type CustomErrorResponse = {
  status: HttpStatus;
  message: string;
  details?: CustomErrorDetail;
  stack?: string;
};

export class CustomError extends Error {
  status: HttpStatus;
  details: CustomErrorDetail;

  constructor(message: string, status: HttpStatus, details?: CustomErrorDetail) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, details?: CustomErrorDetail) {
    super(message, HttpStatus.NotFound, details);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, details?: ZodErrorDetail) {
    super(message, HttpStatus.BadRequest, details);
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor(message: string, details?: ZodErrorDetail) {
    super(message, HttpStatus.UnprocessableEntity, details);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string, details?: CustomErrorDetail) {
    super(message, HttpStatus.Forbidden, details);
  }
}

export const formatErrorResponse = (
  error: Error | HTTPException | ZodError,
): CustomErrorResponse => {
  if (error instanceof CustomError) {
    const { message, details, status, stack } = error;
    return { status: status, message, details, stack };
  }

  if (error instanceof HTTPException) {
    const { message, status, stack } = error;
    // oxlint-disable-next-line no-unsafe-type-assertion
    return { status: status as HttpStatus, message, stack };
  }

  if (error instanceof ZodError) {
    const { stack, issues } = error;
    return {
      status: HttpStatus.BadRequest,
      message: ErrorMessage.Generic.InvalidPayload,
      details: { inline: false, source: 'unknown', issues },
      stack,
    };
  }

  return {
    status: HttpStatus.InternalServerError,
    message: ErrorMessage.Generic.SomethingWentWrong,
    stack: error.stack,
  };
};
