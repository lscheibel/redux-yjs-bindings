import { Map as YMap } from 'yjs';
import { Store } from 'redux';
import { SET_STATE_FROM_YJS_ACTION } from './index';

export const setStateAction = (newState: unknown) => ({
  type: SET_STATE_FROM_YJS_ACTION,
  payload: newState,
});

export const patchStore = (store: Store, rootMap: YMap<unknown>, sliceName: string) => {
  store.dispatch(setStateAction(rootMap.toJSON()[sliceName]));
};
