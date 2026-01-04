import qs from 'qs';

export const encode = (data: unknown) => {
  return qs.stringify(data, {
    skipNulls: true,
    arrayFormat: 'indices',
    encodeValuesOnly: false,
    allowEmptyArrays: false,
    strictNullHandling: true,
  });
};

export const decode = (s: string | null | undefined) => {
  return s ? qs.parse(s) : {};
};
