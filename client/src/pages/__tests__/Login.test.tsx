import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
import authReducer from '../../redux/features/authSlice';
import todoReducer from '../../redux/features/todoSlice';
import * as api from '../../redux/api';

// Mock the API
jest.mock('../../redux/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const createMockStore = (initialState = {}) => {
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
        ...initialState,
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

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders login form elements', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account ? Sign Up")).toBeInTheDocument();
  });



  it('does not submit form with empty fields', () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    expect(mockedApi.signIn).not.toHaveBeenCalled();
  });



  it('displays error message when login fails', () => {
    const { toast } = require('react-toastify');
    
    renderWithProviders(<Login />, { error: 'Invalid credentials' });
    
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });


  it('has link to register page', () => {
    renderWithProviders(<Login />);
    
    const registerLink = screen.getByRole('link', { name: /don't have an account/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });


});
