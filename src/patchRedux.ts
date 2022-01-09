import { Map as YMap } from 'yjs';
import { Store } from 'redux';

/** @desc Action type that is dispatched when yjs state changes from other peers come in. */
export const SET_STATE_FROM_YJS_ACTION = 'YJS_INCOMING_CHANGES';

export const setStateAction = (newState: unknown) => ({
  type: SET_STATE_FROM_YJS_ACTION,
  payload: newState,
});

export const patchStore = (store: Store, rootMap: YMap<unknown>, sliceName: string) => {
  store.dispatch(setStateAction(rootMap.toJSON()[sliceName]));
};
