import React from 'react'
import PropTypes from 'prop-types'
import TodoTextInput from './TodoTextInput'

const Header = ({ addTodo }) => (
  <header className="header">
    <h1>todos</h1>
    <small style={{
        position: 'absolute',
        top: '-40px',
        width: '100%',
        textAlign: 'center'
    }}>Stolen from <a href={'https://github.com/reduxjs/redux/tree/master/examples/todomvc'}>https://github.com/reduxjs/redux/tree/master/examples/todomvc</a></small>
    <TodoTextInput
      newTodo
      onSave={(text) => {
        if (text.length !== 0) {
          addTodo(text)
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
)

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default Header
