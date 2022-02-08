import { combineReducers } from 'redux';
import todos from './todos';
import visibilityFilter from './visibilityFilter';
import { enhanceReducer } from 'redux-yjs-bindings';

const rootReducer = combineReducers({
  todos: enhanceReducer(todos),
  visibilityFilter,
});

export default rootReducer;
