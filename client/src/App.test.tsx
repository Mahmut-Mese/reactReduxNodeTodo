import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authReducer from './redux/features/authSlice';
import todoReducer from './redux/features/todoSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      todo: todoReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        error: '',
        loading: false,
      },
      todo: {
        todo: null,
        todos: [],
        userTodos: [],
        searches: [],
        currentPage: 1,
        numberOfPages: null,
        error: '',
        loading: false,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // Just check that the app renders without errors
  expect(document.body).toBeInTheDocument();
});

afterEach(() => {
  cleanup();
});
