import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL_TODOS,
  CLEAR_COMPLETED,
} from '../constants/ActionTypes';
import { v4 as uuid } from 'uuid';

const initialState = {
  initialTodo: {
    id: 'initialTodo',
    text: 'Use Redux',
    completed: false,
    createdAt: 1404000000000,
  },
};

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO: {
      const id = uuid();
      return {
        ...state,
        [id]: {
          id,
          createdAt: new Date().getTime(),
          completed: false,
          text: action.text,
        },
      };
    }

    case DELETE_TODO: {
      const { [action.id]: _, ...rest } = state;
      return rest;
    }

    case EDIT_TODO: {
      const todo = state[action.id];

      return {
        ...state,
        [action.id]: { ...todo, text: action.text },
      };
    }

    case COMPLETE_TODO: {
      const todo = state[action.id];

      return {
        ...state,
        [action.id]: { ...todo, completed: !todo.completed },
      };
    }

    case COMPLETE_ALL_TODOS: {
      const areAllMarked = Object.values(state).every((todo) => todo.completed);

      return Object.fromEntries(
        Object.entries(state).map(([id, todo]) => {
          return [id, { ...todo, completed: !areAllMarked }];
        })
      );
    }

    case CLEAR_COMPLETED: {
      return Object.fromEntries(
        Object.entries(state).filter(([, todo]) => todo.completed === false)
      );
    }

    default:
      return state;
  }
}
