import { Map as YMap, Array as YArray } from 'yjs';
import { isArray, isObject } from './utils';

/** @desc Recursively transforms arrays and maps into their respective Yjs class. */
export const toSharedType = <Value = unknown>(val: Value) => {
  if (isArray(val)) {
    const yArray = new YArray();

    const yValues = val.map((v) => toSharedType(v));
    yArray.push(yValues); // yArray.push takes an array of values.

    return yArray;
  } else if (isObject(val)) {
    const yMap = new YMap();

    Object.entries(val).forEach(([key, v]) => {
      yMap.set(key, toSharedType(v));
    });

    return yMap;
  } else {
    return val;
  }
};
