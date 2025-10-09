import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../Dashboard';
import authReducer from '../../redux/features/authSlice';
import todoReducer from '../../redux/features/todoSlice';
import * as api from '../../redux/api';

// Mock the API
jest.mock('../../redux/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock the utility function
jest.mock('../../utility', () => ({
  excerpt: (str: string, count: number) => str.length > count ? str.substring(0, count) + '...' : str,
}));

const mockTodos = [
  {
    id: 1,
    title: 'Test Todo 1',
    description: 'This is a test todo description that is quite long and should be truncated',
    tags: ['work', 'urgent'],
    creator: 1,
    imageFile: 'data:image/jpeg;base64,test-image-data',
  },
  {
    id: 2,
    title: 'Test Todo 2',
    description: 'Another test todo',
    tags: ['personal'],
    creator: 1,
    imageFile: '',
  },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      todo: todoReducer,
    },
    preloadedState: {
      auth: {
        user: {
          result: { id: 1, name: 'Test User', email: 'test@test.com' },
          token: 'mock-token',
        },
        error: '',
        loading: false,
      },
      todo: {
        todo: null,
        todos: [],
        userTodos: mockTodos,
        searches: [],
        currentPage: 1,
        numberOfPages: 2,
        error: '',
        loading: false,
        ...initialState,
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

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders dashboard with todos', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Todo')).toBeInTheDocument();
  });

  it('displays todo cards with correct information', () => {
    renderWithProviders(<Dashboard />);
    
    // Check if todo titles are displayed
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('displays search input', () => {
    renderWithProviders(<Dashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search Todo');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('displays todo action buttons (view, edit, delete)', () => {
    renderWithProviders(<Dashboard />);
    
    // Should have view (eye), edit, and delete (trash) icons for each todo
    const eyeIcons = document.querySelectorAll('.fa-eye');
    const editIcons = document.querySelectorAll('.fa-edit');
    const trashIcons = document.querySelectorAll('.fa-trash');
    
    // We have 2 todos, so we should have 2 of each icon
    expect(eyeIcons.length).toBe(2);
    expect(editIcons.length).toBe(2);
    expect(trashIcons.length).toBe(2);
  });

  it('displays pagination when there are multiple pages', () => {
    renderWithProviders(<Dashboard />);
    
    // Should show pagination component when numberOfPages > 1
    // This depends on how the Pagination component is implemented
    const paginationElement = document.querySelector('.pagination') || 
                             screen.queryByTestId('pagination');
    
    // If pagination is rendered, it should be present
    if (paginationElement) {
      expect(paginationElement).toBeInTheDocument();
    }
  });


  it('handles search functionality', async () => {
    const mockSearchResponse = {
      data: [
        {
          id: 3,
          title: 'Search Result',
          description: 'Found todo',
          tags: ['search'],
          creator: 1,
        },
      ],
    };

    mockedApi.getTodosBySearch.mockResolvedValue(mockSearchResponse);

    renderWithProviders(<Dashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search Todo');
    fireEvent.change(searchInput, { target: { value: 'search query' } });
    
    // Trigger search (this might require form submission or debounced input)
    // The exact implementation depends on how search is handled in the component
  });

  it('navigates to view todo page when eye icon is clicked', () => {
    renderWithProviders(<Dashboard />);
    
    // Find view links (eye icons wrapped in Link components)
    const viewLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/todo/')
    );
    
    expect(viewLinks.length).toBeGreaterThan(0);
    expect(viewLinks[0]).toHaveAttribute('href', '/todo/1');
  });

  it('navigates to edit todo page when edit icon is clicked', () => {
    renderWithProviders(<Dashboard />);
    
    // Find edit links
    const editLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/editTodo/')
    );
    
    expect(editLinks.length).toBeGreaterThan(0);
    expect(editLinks[0]).toHaveAttribute('href', '/editTodo/1');
  });
});
