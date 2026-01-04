import { describe, expect, it } from 'vitest';

import { decode, encode } from '@/utils/querystring';

describe('utilities to process query strings', () => {
  it('trying to encode the query string should result in correct encoding', () => {
    expect(encode({ a: 1, b: 2 })).toBe('a=1&b=2');
  });

  it('trying to decode the query string should result in correct data', () => {
    expect(decode('a=1&b=2')).toEqual({ a: '1', b: '2' });
    // oxlint-disable-next-line no-null
    expect(decode(null)).toEqual({});
  });
});
