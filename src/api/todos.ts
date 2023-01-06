import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const sendTodo = (options: {
  title: string,
  userId: number,
  completed: false,
}) => {
  return client.post<Todo>('/todos', options);
};
