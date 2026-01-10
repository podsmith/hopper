export const RegEx = {
  SerialId: /^[1-9]\d*$/,
  DigitsOnly: /^\d+$/,
  UtcTimestamp: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/,
  PhoneNumberE164: /^\+[1-9]\d{6,14}$/,
  UtilityName: /^[a-zA-Z][a-zA-Z0-9_)(\s-]*$/,
  PersonName: /^[A-Za-z]+([\s'-][A-Za-z]+)*$/,
} as const;
