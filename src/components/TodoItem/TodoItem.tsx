import cn from 'classnames';
import { StateTodo } from '../../context/useAppContext';

interface Props {
  todo: StateTodo;
  handleClick?: VoidFunction;
}

export const TodoItem: React.FC<Props> = ({
  todo: {
    title,
    completed,
    isLoading,
  },
  handleClick,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
