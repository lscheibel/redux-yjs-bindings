import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { bind, enhanceReducer } from 'redux-yjs-bindings';
import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const store = configureStore({
  reducer: {
    counter: enhanceReducer(counterReducer),
  },
});

const yDoc = new Doc();

const webrtcOptions = {
  signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
};

new WebrtcProvider(
  'redux-yjs-bindings-cra-redux-typescript-example',
  yDoc,
  // All fields are actually optional, this is currently typed wrong in yjs
  webrtcOptions as any
);

bind(yDoc, store, 'counter');

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
