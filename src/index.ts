import { Doc as YDoc, transact } from 'yjs';
import { Reducer, Store } from 'redux';
import { patchStore, SET_STATE_FROM_YJS_ACTION } from './patchRedux';
import { valueToYValue } from './valueToYValue';
import { patchYjs } from './patchYjs';

// Setup Yjs like this:
// const rootMap = yDoc.getMap('__ReduxMiddlewareRootMap');
//
// When registering new state slice the name must be given: reduxMiddlewareYjs('mySharedState', state)
// // Maybe wait for synchronisation to happen, so that we don't override existing state.
// Then get the current state: currentState = state['mySharedState'];
// And save it into our rootMap: rootMap.set('mySharedState', currentState);
// This way the state slice may contain objects but also arrays or primitive values are supported.
// Also, multiple slices are supported!
// Another benefit is, that the YDoc can be used for other purposes than the redux store. (except for the "__ReduxYjsBindingsRootMap" map).
//

export { SET_STATE_FROM_YJS_ACTION } from './patchRedux';

/** @desc This is the name of the yMap that is used on the yDoc that passed to the setup function. Can be used to persist the values on a server. */
export const ROOT_MAP_NAME = '__ReduxYjsBindingsRootMap';

/**
 * @desc Initialises the bindings and registers listeners on yjs and teh redux store.
 * @param yDoc The y-document that is used to sync with other peers.
 * @param store The redux store containing the values that should be synced.
 * @param sliceName The name of the redux-subtree (slice) that contains the values.
 * */
export const setup = (yDoc: YDoc, store: Store, sliceName: string) => {
  const rootMap = yDoc.getMap(ROOT_MAP_NAME);
  const state = store.getState()[sliceName];

  // Todo: Do we have to wait before setting? Maybe yjs will already populate the map...
  rootMap.set(sliceName, valueToYValue(state));

  // Prevent reacting to our own changes.
  let currentlyPatchingYjs = false;
  let currentlyPatchingStore = false;

  let currentState = store.getState()[sliceName];
  store.subscribe(() => {
    const prevState = currentState;
    currentState = store.getState()[sliceName];

    if (currentlyPatchingStore) return;

    currentlyPatchingYjs = true;
    transact(yDoc, () => {
      patchYjs(rootMap, sliceName, prevState, currentState);
    });
    currentlyPatchingYjs = false;
  });

  rootMap.observeDeep(() => {
    if (currentlyPatchingYjs) return;

    currentlyPatchingStore = true;
    patchStore(store, rootMap, sliceName);
    currentlyPatchingStore = false;
  });
};

/** @desc This is a utility function to enhance an existing reducer to react to the actions dispatched that are meant to set the state of the redux slice on incoming changes from yjs. */
export const enhanceYjsReducer =
  (currentReducer: Reducer): Reducer =>
  (state, action) => {
    if (action?.type === SET_STATE_FROM_YJS_ACTION) {
      return action.payload;
    } else {
      return currentReducer(state, action);
    }
  };
