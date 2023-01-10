import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAppContext } from '../../context/useAppContext';
import { TodoItem } from '../TodoItem/TodoItem';

export const Todos = () => {
  const {
    state: {
      filteredTodos,
      tempTodo,
    },
    actions: {
      deleteTodo,
    },
  } = useAppContext();

  const [parent] = useAutoAnimate<HTMLElement>({
    duration: 150,
    easing: 'ease-out',
  });

  return (
    <section
      ref={parent}
      className="todoapp__main"
      data-cy="TodoList"
    >
      {filteredTodos && filteredTodos.map((todo) => (
        <TodoItem
          handleClick={() => deleteTodo(todo.id)}
          todo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
