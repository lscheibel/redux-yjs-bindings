export const clamp = (v: number, l: number, u: number) => (v < l ? l : v > u ? u : v);

export const isObject = (val: unknown): val is Record<string, unknown> =>
  Object.prototype.toString.call(val) === '[object Object]';

export const isArray = (val: unknown): val is Array<unknown> => Array.isArray(val);

export const isString = (val: unknown): val is string =>
  typeof val === 'string' || val instanceof String;

export const isInteger = (val: unknown): val is number => Number.isInteger(val);
