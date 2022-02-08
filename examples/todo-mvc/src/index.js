import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import reducer from './reducers';
import 'todomvc-app-css/index.css';
import { Doc as YDoc } from 'yjs';
import { bind } from 'redux-yjs-bindings';
import { RTC } from './YjsWebRTCProvider';

export const yDoc = new YDoc();
export const rtc = new RTC(yDoc);

const store = createStore(reducer);

bind(yDoc, store, 'todos');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
