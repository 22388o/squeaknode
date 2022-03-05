import React from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

import { selectTodoIds } from './todosSlice'

const TodoList = () => {
  const todoIds = useSelector(selectTodoIds)
  const loadingStatus = useSelector((state) => state.todos.status)

  console.log(todoIds);

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
