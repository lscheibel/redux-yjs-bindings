import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

const TodoList = ({ filteredTodos, actions }) => (
  <ul className="todo-list">
    {filteredTodos
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((todo) => (
        <TodoItem key={todo.id} todo={todo} {...actions} />
      ))}
  </ul>
);

TodoList.propTypes = {
  filteredTodos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  actions: PropTypes.object.isRequired,
};

export default TodoList;
