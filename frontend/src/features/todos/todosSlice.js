import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client, getTimelineSqueaks } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

const initialState = {
  status: 'idle',
  entities: {}
}

// Thunk functions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  console.log('Fetching todos');
  // const response = await client.get('/fakeApi/todos')
  const response = await getTimelineSqueaks(5);
  console.log(response);
  return response
})

export const saveNewTodo = createAsyncThunk(
  'todos/saveNewTodo',
  async (text) => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    return response.todo
  }
)

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(fetchTodos.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      console.log('Add case');
      console.log(action);
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.getSqueakHash()] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    })
  },
})

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
} = todosSlice.actions

export default todosSlice.reducer

export const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, entities =>
  Object.values(entities)
)

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  todos => {
    console.log(todos);
    return todos.map(todo => todo.getSqueakHash())
  }
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}
