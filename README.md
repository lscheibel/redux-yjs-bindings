# redux-yjs-bindings

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

> Use [Yjs](https://yjs.dev/) to sync your [Redux](https://redux.js.org/) store with other peers!

This very small (roughly 1kB) bridge to connect Redux with a Yjs,
allows you to use the synchronization features of Yjs with the data management capabilities of Redux.
It works with any Redux store, whether you use Redux Toolkit or not, and even supports initial values.
Values that are transmitted over the network can be any JSON serializable value, from primitives to deeply nested object structures.

## Install

```bash
npm i redux-yjs-bindings
```

## Prerequisites

To use this library you will need a [Yjs document](https://docs.yjs.dev) as well as a [Redux store](https://redux.js.org/introduction/getting-started).
Detailed steps on how to set both up can be taken form their respective documentation.
You will need to configure the reducer of the state slice that you want to have synced to accept an action dispatched by this library,
however helper functions are exported to hide this away. Check below for example usage:

## General Usage

```ts
import { bind, enhanceReducer } from 'redux-yjs-bindings';
import { Doc } from 'yjs';
import { createStore } from 'redux';
import { mySharedStateReducer } from './store/reducers';

// Create Yjs document, or use existing one.
const yDoc = new Doc();

const rootReducer = {
  // Set up reducer to handle action dispatched by `redux-yjs-bindings` when remote changes come in.
  mySharedState: enhanceReducer(mySharedStateReducer),
};
const store = createStore(rootReducer);

// Start synchronisation of Redux and Yjs
bind(yDoc, store, 'mySharedState');
```

Internally the `bind` function creates a new `Y.Map()` on the provided document.
This map then contains a property with the provided sliceName, whose value should then always match the one of your store slice.

## Limitations

Despite best efforts to make this library as compatible with existing projects as possible, there are some things to keep in mind.

### Referential Equality

For now referential equality is not kept when changes from a remote peer are applied to the local Redux state.
This may change in the future, however for now you can simply provide a [custom equality function to the useSelector hook](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates)
if performance becomes a problem.

### Undefined in Array (`[undefined]`) Not Supported

As per [Redux guidelines](https://redux.js.org/style-guide/style-guide#do-not-put-non-serializable-values-in-state-or-actions)
values in the store should be JSON serializable. While undefined values are mostly supported by this library,
Yjs currently doesn't support undefined in arrays. However, undefined as a primitive or as object values works
just fine, even though they are technically not a part of JSON.

### Setter Action Must Be Synchronous

When remote changes come in through Yjs changes must be applied to the store immediately.
Since reducers are already required to be synchronous by Redux and the action is dispatched by the library itself,
this should not be a problem in practice. However, in theory it would be possible for a Redux middleware to delay all
dispatched actions, which could potentially lead to data loss.

### Intention Preservation on Array Changes

Internally redux-yjs-bindings subscribes to changes on the Redux store in order to patch the Yjs document.
By calculating the difference between the previous and the next state, intentions behind changes can be
retrieved even though Redux forces immutability. Unfortunately diffing arrays is not trivial and the currently used
algorithm "recursive-diff" by [@cosmicanant](https://github.com/cosmicanant) does not preserve intention for insertions
or deletions that are not at the end of the array. States will still be synced correctly,
but sometimes with more work than necessary.
See [this issue](https://github.com/lscheibel/redux-yjs-bindings/issues/3) for more details.

### Holey Arrays (`[1, , 'a']`) Not Supported

Well this obscure "feature" of JavaScript is simply not supported and will fail almost immediately.

## API

---

### bind(yDoc: Y.Doc, store: Store, sliceName: string): unbind()

#### yDoc

The yjs document changes should be synced with.

#### store

The redux store changes should be synced with.

#### sliceName

The name of the state slice (subtree) that should be synced.

#### unbind()

Returns a function which unbinds the state sync between the YJS doc and redux store

---

### enhanceReducer(currentReducer: Reducer): Reducer

#### currentReducer

The reducer for the slice of the store that is supposed to be synced.

---

### Constants

`ROOT_MAP_NAME` Property name of the map on the provided yDoc. Can be used to persist the yjs values on a server.

`SET_STATE_FROM_YJS_ACTION` Used by `enhanceYjsReducer`. Action type that is dispatched whenever changes to yjs from other peers come in.

---

## Development

### Setup

- clone repo `git clone https://github.com/lscheibel/redux-yjs-bindings`
- install dependencies and start [microbundle](https://github.com/developit/microbundle) in watch mode `npm i && npm dev`
- open new terminal and navigate to example you want to test on (e.g., `cd examples/todo-mvc`)
- follow instructions on how to start example from `README.md` but usually includes `npm i && npm start` plus starting the yjs-webrtc signaling server.

### Inner Workings

Internally this library simply subscribes to changes on both the Redux store and the Yjs document,
while making sure not to react to notifications triggered by itself. The `subscribe` method on the
Redux store can be used to keep track of a previous and current state, from which a difference is calculated
(currently using "recursive-diff" by [@cosmicanant](https://github.com/cosmicanant)).
The returned list of patch operations is then iterated over to apply all changes to the Yjs document.
In the other direction, incoming changes from remote peers through Yjs are handled synchronously in order
to prevent local Redux state updates while currently handling remote changes.
When remote changes are detected, the Yjs state instance is simply turned into a JavaScript object,
which replaces the entire store slice. This comes with the upside, that Yjs is always treated as the source of truth,
however referential equality is lost, potentially impacting performance by effectively circumventing
Redux selector's caching system, that would usually prevent unnecessary rerenders.

## Acknowledgements and Prior Art

Special thanks to Joseph Miles whose [zustand-middleware-yjs](https://github.com/joebobmiles/zustand-middleware-yjs) library was an inspiration.
Also look out for [Sana Labs](https://github.com/sanalabs) upcoming "collaboration-kit".

[downloads-img]: https://img.shields.io/npm/dt/redux-yjs-bindings
[downloads-url]: https://www.npmtrends.com/redux-yjs-bindings
[npm-img]: https://img.shields.io/npm/v/redux-yjs-bindings
[npm-url]: https://www.npmjs.com/package/redux-yjs-bindings
[issues-img]: https://img.shields.io/github/issues/lscheibel/redux-yjs-bindings
[issues-url]: https://github.com/lscheibel/redux-yjs-bindings/issues
