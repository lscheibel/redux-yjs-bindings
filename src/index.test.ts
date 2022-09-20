import * as Y from 'yjs';
import { enhanceReducer, ROOT_MAP_NAME, SET_STATE_FROM_YJS_ACTION, bind } from './index';
import { applyMiddleware, combineReducers, createStore } from 'redux';

const resolvers: Array<() => void> = [];

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const counter = enhanceReducer((state: number = 0, action: any) => {
  switch (action?.type) {
    case 'INC':
      return state + 1;
    default:
      return state;
  }
});

const asyncPatchMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action?.type === SET_STATE_FROM_YJS_ACTION) {
    let resolve = null;
    const p = new Promise((r) => (resolve = r));
    p.then(() => next(action));
    resolvers.push(resolve as unknown as () => void); // TypeScript doesn't seem to recognise the resolve is set in the promise callback.
  } else {
    return next(action);
  }
};

const sleep = (t: number) => new Promise<void>((r) => setTimeout(() => r(), t));
const tick = () => sleep(0);

describe('Async failure', () => {
  test('Data loss when actions resolve asynchronously', async () => {
    const yDoc1 = new Y.Doc();
    const yDoc2 = new Y.Doc();

    yDoc1.on('update', (update: Uint8Array) => {
      Y.applyUpdate(yDoc2, update);
    });
    yDoc2.on('update', (update: Uint8Array) => {
      Y.applyUpdate(yDoc1, update);
    });

    const store = createStore(combineReducers({ counter }), applyMiddleware(asyncPatchMiddleware));
    bind(yDoc1, store, 'counter');

    store.dispatch({ type: 'INC' });

    expect(yDoc1.getMap(ROOT_MAP_NAME).get('counter')).toBe(1);
    expect(yDoc2.getMap(ROOT_MAP_NAME).get('counter')).toBe(1);

    yDoc2.getMap(ROOT_MAP_NAME).set('counter', 99); // Remote changes state

    expect(yDoc1.getMap(ROOT_MAP_NAME).get('counter')).toBe(99);
    expect(store.getState().counter).toBe(1); // Changes still pending due to the asyncPatchMiddleware in Redux.

    store.dispatch({ type: 'INC' });

    expect(store.getState().counter).toBe(2);
    expect(yDoc1.getMap(ROOT_MAP_NAME).get('counter')).toBe(2);
    expect(yDoc2.getMap(ROOT_MAP_NAME).get('counter')).toBe(2);

    yDoc2.getMap(ROOT_MAP_NAME).set('counter', 3); // resolvers = [set(99), set(3)]

    expect(yDoc1.getMap(ROOT_MAP_NAME).get('counter')).toBe(3);
    expect(store.getState().counter).toBe(2);

    resolvers.pop()?.(); // Race condition can lead to loss of remote data
    await tick(); // Wait for event loop to cycle

    expect(store.getState().counter).toBe(3);

    resolvers.pop()?.(); // Apply updates to store
    await tick(); // Wait for event loop to cycle

    expect(store.getState().counter).toBe(99);
    expect(yDoc1.getMap(ROOT_MAP_NAME).get('counter')).toBe(99);
    expect(yDoc2.getMap(ROOT_MAP_NAME).get('counter')).toBe(99);
  });
});
