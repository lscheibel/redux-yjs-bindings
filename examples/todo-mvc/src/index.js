import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { WebrtcProvider } from 'y-webrtc';
import { Doc as YDoc } from 'yjs'
import { setup } from 'redux-yjs-bindings'


export const yDoc = new YDoc();

// clients connected to the same room-name share document updates
const provider = new WebrtcProvider('your-room-name', yDoc, {
    signaling: ['ws://localhost:4444'],
});

const store = createStore(reducer)

setup(yDoc, store, 'todos');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
