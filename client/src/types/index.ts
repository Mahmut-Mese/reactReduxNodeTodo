// User types
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  error: string;
  loading: boolean;
}

export interface AuthUser {
  result: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Todo types
export interface Todo {
  id: number;
  title: string;
  description: string;
  name?: string;
  creator: number;
  tags: string[] | string;
  imageFile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoState {
  todo: Todo | null;
  todos: Todo[];
  userTodos: Todo[];
  searches: Todo[];
  currentPage: number;
  numberOfPages: number | null;
  error: string;
  loading: boolean;
}

export interface CreateTodoData {
  title: string;
  description: string;
  tags: string[];
  imageFile?: string;
  name?: string;
}

export interface UpdateTodoData extends CreateTodoData {
  id: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalTodos: number;
  numberOfPages: number;
}

// Form types
export interface TodoFormData {
  title: string;
  description: string;
  tags: string[];
  imageFile?: string;
}

// Navigation types
export interface NavigateFunction {
  (to: string): void;
}

// Redux action types
export interface AsyncThunkConfig {
  rejectValue: string;
}
