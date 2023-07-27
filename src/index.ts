import { Doc as YDoc, transact } from 'yjs';
import { Reducer, Store } from 'redux';
import { patchStore, SET_STATE_FROM_YJS_ACTION } from './patchRedux';
import { toSharedType } from './toSharedType';
import { patchYjs } from './patchYjs';
import { isArray, isObject } from './utils';

export { SET_STATE_FROM_YJS_ACTION } from './patchRedux';

/** @desc This is the name of the yMap that is used on the yDoc that passed to the setup function. Can be used to persist the values on a server. */
export const ROOT_MAP_NAME = '__ReduxYjsBindingsRootMap';

/**
 * @desc Initialises the bindings and registers listeners on yjs and teh redux store.
 * @param yDoc The y-document that is used to sync with other peers.
 * @param store The redux store containing the values that should be synced.
 * @param sliceName The name of the redux-subtree (slice) that contains the values.
 * */
export const bind = <S extends { [P in keyof S]: S[P] }, K extends keyof S & string>(
  yDoc: YDoc,
  store: Store<S>,
  sliceName: K
) => {
  const rootMap = yDoc.getMap(ROOT_MAP_NAME);
  const state = store.getState()[sliceName];

  // Set initial values from store, while preventing overriding remote states.
  if (isObject(state)) {
    transact(yDoc, () => {
      rootMap.set(sliceName, toSharedType({}));
      patchYjs(rootMap, sliceName, {}, state);
    });
  }

  if (isArray(state)) {
    transact(yDoc, () => {
      rootMap.set(sliceName, toSharedType([]));
      patchYjs(rootMap, sliceName, [], state);
    });
  }

  // Prevent reacting to our own changes.
  let currentlyPatchingYjs = false;
  let currentlyPatchingStore = false;

  let currentState = store.getState()[sliceName];
  const reduxUnsubscribe = store.subscribe(() => {
    const prevState = currentState;
    currentState = store.getState()[sliceName];

    if (currentlyPatchingStore) return;

    currentlyPatchingYjs = true;
    transact(yDoc, () => {
      patchYjs(rootMap, sliceName, prevState, currentState);
    });
    currentlyPatchingYjs = false;
  });

  const handleYjsStoreChange = () => {
    if (currentlyPatchingYjs) return;

    currentlyPatchingStore = true;
    patchStore(store, rootMap, sliceName);
    currentlyPatchingStore = false;
  }

  rootMap.observeDeep(handleYjsStoreChange);

  return () => {
    reduxUnsubscribe()
    rootMap.unobserveDeep(handleYjsStoreChange)
  }
};

/** @desc This is a utility function to enhance an existing reducer to react to the actions dispatched that are meant to set the state of the redux slice on incoming changes from yjs. */
export const enhanceReducer =
  <S>(currentReducer: Reducer<S>): Reducer<S> =>
  (state, action) => {
    if (action?.type === SET_STATE_FROM_YJS_ACTION) {
      return {...state, ...action.payload};
    } else {
      return currentReducer(state, action);
    }
  };
