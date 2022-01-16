import * as Y from 'yjs';
import { ROOT_MAP_NAME } from './index';
import { toSharedType } from './toSharedType';
import { patchYjs } from './patchYjs';

const testPatch = (name: string, a: unknown, b: unknown) => {
  test(name, () => {
    const yDoc = new Y.Doc();
    const rootMap = yDoc.getMap(ROOT_MAP_NAME);
    rootMap.set('stateSliceName', toSharedType(a));

    patchYjs(rootMap, 'stateSliceName', a, b);

    expect(rootMap.toJSON().stateSliceName).toStrictEqual(b);
  });
};

describe('primitive values', () => {
  testPatch('handle null', undefined, null);
  testPatch('add string', undefined, 'foo');
  testPatch('delete string', 'foo', undefined);
  testPatch('equal states', 'foo', 'foo');
  testPatch('update string ', 'foo', 'bar');
  testPatch('update type', 1, 'foo');
});

describe('shallow objects', () => {
  testPatch('add object', undefined, {});
  testPatch('delete object', {}, undefined);
  testPatch('equal states with empty object', {}, {});
  testPatch('equal states with property', { a: 'foo' }, { a: 'foo' });
  testPatch('add property', {}, { a: 'foo' });
  testPatch('remove property', { a: 'foo' }, {});
  testPatch('update property value', { a: 'foo' }, { a: 'bar' });
  testPatch('update property key', { a: 'foo' }, { b: 'foo' });
  testPatch('handle number as key', { 0: 'foo', b: 0 }, { 0: 'bar', b: 0 });
});

describe('shallow arrays', () => {
  testPatch('add array', undefined, []);
  testPatch('delete array', [], undefined);
  testPatch('equal states with empty array', [], []);
  testPatch('equal state with value', ['foo'], ['foo']);
  testPatch('add value', [], ['foo']);
  testPatch('remove value', ['foo'], []);
  testPatch('update value', ['foo'], ['bar']);
  testPatch('reorder value', ['foo', 'bar'], ['bar', 'foo']);
  // testPatch('handle holey array', [, 'bar'], [, 'foo']); // It doesn't...
});

describe('nested objects', () => {
  testPatch('add nested object', {}, { a: {} });
  testPatch('set property in nested object', { a: {} }, { a: { b: 'foo' } });
  testPatch('equal states with nested object', { a: {} }, { a: {} });
  testPatch('equal states with nested array', { a: [] }, { a: [] });
  testPatch('set empty object in nested array', { a: [] }, { a: [{}] });
  testPatch('set object property in nested array', { a: [{}] }, { a: [{ b: 'foo' }] });
  testPatch('update property from object to array', { a: {} }, { a: [] });
  testPatch('update property from array to object', { a: [] }, { a: {} });
  testPatch(
    'update property from object to array with values',
    { a: { b: 'foo' } },
    { a: ['bar'] }
  );
  testPatch(
    'update property from array to object with values',
    { a: ['foo'] },
    { a: { b: 'bar' } }
  );
});
