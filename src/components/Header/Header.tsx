/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/useAppContext';

export const Header = () => {
  const {
    state: {
      tempTodo,
    },
    actions: {
      createTodo,
    },
  } = useAppContext();

  const newTodoField = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    createTodo({
      title: newTodoField.current?.value || '',
      completed: false,
    });

    form.current?.reset();
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
        ref={form}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={Boolean(tempTodo)}
        />
      </form>
    </header>
  );
};
