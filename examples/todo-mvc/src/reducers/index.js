import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import { enhanceYjsReducer } from 'redux-yjs-bindings'

const rootReducer = combineReducers({
  todos: enhanceYjsReducer(todos),
  visibilityFilter
})

export default rootReducer
