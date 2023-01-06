import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { FilterEnum } from '../app.constants';
import { AuthContext } from '../components/Auth/AuthContext';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type State = {
  todos: null | Todo[],
  filteredTodos: null | Todo[],
  error: null | string,
  filter: FilterEnum,
};

type DispatchAction =
  { type: 'SET_TODOS', payload: Todo[] | null }
  | { type: 'SET_FILTER', payload: FilterEnum }
  | { type: 'SET_FILTERED_TODOS', payload: Todo[] | null }
  | { type: 'CREATE_TODO', payload: Todo }
  | { type: 'UPDATE_TODO', payload: Partial<Todo> & Pick<Todo, 'id'> }
  | { type: 'DELETE_TODO', payload: number }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'CLEAR_ERROR', payload?: undefined };

interface UseAppContextResult {
  state: State,
  actions: {
    loadTodos: () => Promise<void>;
    createTodo: (todo: Pick<Todo, 'title' | 'completed'>) => Promise<void>;
    filterTodos: (filter: FilterEnum) => Promise<void>;
    clearError: VoidFunction;
  },
}

const AppContext = createContext<UseAppContextResult>(
  {} as UseAppContextResult,
);

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useContext(AuthContext);
  const [
    {
      todos, filteredTodos, error, filter,
    },
    dispatch,
  ] = useReducer((
    prev: State,
    { type, payload }: DispatchAction,
  ) => {
    switch (type) {
      case 'SET_TODOS':
        return {
          ...prev,
          todos: payload,
        };

      case 'SET_FILTER':
        return {
          ...prev,
          filter: payload,
        };

      case 'SET_FILTERED_TODOS':
        return {
          ...prev,
          filteredTodos: payload,
        };

      case 'CREATE_TODO':
        return {
          ...prev,
          todos: [...prev.todos ?? [], payload],
        };

      case 'UPDATE_TODO':
        if (!prev.todos) {
          return prev;
        }

        return {
          ...prev,
          todos: prev.todos.map((todo) => (
            todo.id === payload.id
              ? { ...todo, ...payload }
              : todo
          )),
        };

      case 'DELETE_TODO':
        if (!prev.todos) {
          return prev;
        }

        return {
          ...prev,
          todos: prev.todos.filter((todo) => todo.id === payload),
        };

      case 'SET_ERROR':
        return {
          ...prev,
          error: payload,
        };

      case 'CLEAR_ERROR':
        return {
          ...prev,
          error: null,
        };

      default:
        return prev;
    }
  }, {
    todos: null,
    filteredTodos: null,
    error: null,
    filter: FilterEnum.All,
  });

  const loadTodos = useCallback(async () => {
    let newTodos = null;

    if (!user) {
      return newTodos;
    }

    try {
      const todosFromServer = await client.get<Todo[]>(
        `/todos?userId=${user.id}`,
      );

      if (todosFromServer.length) {
        newTodos = todosFromServer;
      }
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Unable to load a todos',
      });
    }

    return newTodos;
  }, [user, filter, dispatch]);

  const appFunctions = {
    loadTodos: async () => (dispatch({
      type: 'SET_TODOS',
      payload: await loadTodos(),
    })),

    createTodo: async (
      todo: Pick<Todo, 'title' | 'completed'>,
    ) => {
      if (!user) {
        return;
      }

      const tempId = new Date().getTime();

      dispatch({
        type: 'CREATE_TODO',
        payload: {
          userId: user.id,
          id: tempId,
          ...todo,
        },
      });
    },

    filterTodos: async (newFilter: FilterEnum) => {
      dispatch({
        type: 'SET_FILTER',
        payload: newFilter,
      });

      dispatch({
        type: 'SET_FILTERED_TODOS',
        payload: todos && todos.filter(({ completed }) => {
          const filterOptions = {
            [FilterEnum.All]: true,
            [FilterEnum.Active]: !completed,
            [FilterEnum.Completed]: completed,
          };

          return filterOptions[newFilter];
        }),
      });
    },

    clearError: () => (dispatch({ type: 'CLEAR_ERROR' })),
  };

  useEffect(() => {
    appFunctions.loadTodos();
  }, [user]);

  useEffect(() => {
    appFunctions.filterTodos(filter);
  }, [todos]);

  return (
    <AppContext.Provider
      value={{
        state: {
          todos,
          filteredTodos,
          error,
          filter,
        },
        actions: appFunctions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => (useContext(AppContext));
