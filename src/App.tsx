import React from 'react';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Todos } from './components/Todos/Todos';
import { Filter } from './components/Filter/Filter';
import { useAppContext } from './context/useAppContext';

export const App: React.FC = () => {
  const {
    state: {
      todos,
      filteredTodos,
      error,
      filter,
    },
    actions: {
      filterTodos,
      clearError,
    },
  } = useAppContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {filteredTodos && (
          <Todos todos={filteredTodos} />
        )}

        {todos && (
          <Footer
            activeTodos={todos?.filter(todo => !todo.completed).length || 0}
          >
            <Filter
              selectedFilter={filter}
              onFilterChange={filterTodos}
            />
          </Footer>
        )}
      </div>

      {error && (
        <ErrorNotification
          message={error}
          onClose={clearError}
          key={error}
        />
      )}
    </div>
  );
};
