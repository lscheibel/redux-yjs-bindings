# redux-yjs-bindings

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

> Use [yjs](https://yjs.dev/) to sync your [redux](https://redux.js.org/) store across peers!

## Install

```bash
npm install redux-yjs-bindings
```

## Usage

```ts
import { setup, enhanceYjsReducer } from 'redux-yjs-bindings';
import { Doc } from 'yjs';
import { createStore } from 'redux';

const rootReducer = {
  mySharedState: enhanceYjsReducer(mySharedState),
};

const yDoc = new Doc();
const store = createStore(rootReducer);

setup(yDoc, store, 'mySharedState');
```

The setup function creates a new Y.Map() on the provided document. This map then contains a property with the provided sliceName. The value should then always match the on eof your store slice.

## API

---

### setup(yDoc: Y.Doc, store: Store, sliceName: string): void

#### yDoc

The yjs document changes should be synced with.

#### store

The redux store changes should be synced with.

#### sliceName

The name of the state slice (subtree) that should be synced.

---

### enhanceYjsReducer(currentReducer: Reducer): Reducer

#### currentReducer

The reducer for the slice of the store that is supposed to be synced.

---

### Constants

`ROOT_MAP_NAME` Property name of the map on the provided yDoc. Can be used to persist the yjs values on a server.

`SET_STATE_FROM_YJS_ACTION` Used by `enhanceYjsReducer`. Action type that is dispatched whenever changes to yjs from other peers come in.

---

[build-img]: https://github.com/lscheibel/redux-yjs-bindings/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/lscheibel/redux-yjs-bindings/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/redux-yjs-bindings
[downloads-url]: https://www.npmtrends.com/redux-yjs-bindings
[npm-img]: https://img.shields.io/npm/v/redux-yjs-bindings
[npm-url]: https://www.npmjs.com/package/redux-yjs-bindings
[issues-img]: https://img.shields.io/github/issues/lscheibel/redux-yjs-bindings
[issues-url]: https://github.com/lscheibel/redux-yjs-bindings/issues
