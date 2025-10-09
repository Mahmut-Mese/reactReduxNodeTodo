import { Request, Response } from 'express';
import { 
  createTodo, 
  getTodo, 
  getTodosByUser, 
  deleteTodo, 
  updateTodo, 
  getTodosBySearch 
} from '../../controllers/todo';
import Todo from '../../models/todo';
import { IAuthRequest } from '../../types';

// Get the mocked Todo
const mockTodo = Todo as jest.Mocked<typeof Todo>;

// Mock Todo model
jest.mock('../../models/todo', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
}));

// Mock sequelize
jest.mock('../../db', () => ({
  where: jest.fn(),
  fn: jest.fn(),
  col: jest.fn(),
}));

describe('Todo Controller', () => {
  let mockRequest: Partial<IAuthRequest>;
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    mockRequest = {
      userId: 1,
      body: {},
      params: {},
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create a new todo successfully', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
        tags: ['test', 'todo'],
        imageFile: 'base64data'
      };

      mockRequest.body = todoData;
      
      const createdTodo = {
        id: 1,
        ...todoData,
        creator: 1,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockTodo.create.mockResolvedValue(createdTodo as any);

      await createTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockTodo.create).toHaveBeenCalledWith({
        ...todoData,
        creator: 1
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTodo);
    });

    it('should handle database errors during creation', async () => {
      mockRequest.body = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      mockTodo.create.mockRejectedValue(new Error('Database error'));

      await createTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Something went wrong",
        error: "Database error"
      });
    });
  });

  describe('getTodo', () => {
    it('should return a todo when found', async () => {
      mockRequest.params = { id: '1' };
      
      const todoData = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        creator: 1,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockTodo.findByPk.mockResolvedValue(todoData as any);

      await getTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockTodo.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(todoData);
    });

    it('should return 404 when todo not found', async () => {
      mockRequest.params = { id: '999' };
      
      mockTodo.findByPk.mockResolvedValue(null);

      await getTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Todo not found" });
    });

    it('should handle database errors', async () => {
      mockRequest.params = { id: '1' };
      
      mockTodo.findByPk.mockRejectedValue(new Error('Database error'));

      await getTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe('getTodosByUser', () => {
    it('should return paginated todos for a user', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.query = { page: '1' };
      
      const todos = [
        { id: 1, title: 'Todo 1', creator: 1 },
        { id: 2, title: 'Todo 2', creator: 1 }
      ];

      mockTodo.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: todos as any[]
      });

      await getTodosByUser(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockTodo.findAndCountAll).toHaveBeenCalledWith({
        where: { creator: 1 },
        limit: 5,
        offset: 0,
        order: [["created_at", "DESC"]]
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: todos,
        currentPage: 1,
        totalTodos: 2,
        numberOfPages: 1
      });
    });

    it('should handle database errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.query = { page: '1' };
      
      mockTodo.findAndCountAll.mockRejectedValue(new Error('Database error'));

      await getTodosByUser(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      mockRequest.params = { id: '1' };
      
      mockTodo.destroy.mockResolvedValue(1);

      await deleteTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockTodo.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Todo deleted successfully" });
    });

    it('should return 404 when todo not found', async () => {
      mockRequest.params = { id: '999' };
      
      mockTodo.destroy.mockResolvedValue(0);

      await deleteTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "No todo exist with id: 999" });
    });

    it('should handle database errors', async () => {
      mockRequest.params = { id: '1' };
      
      mockTodo.destroy.mockRejectedValue(new Error('Database error'));

      await deleteTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'Updated Todo',
        description: 'Updated Description',
        tags: ['updated']
      };
      
      const updatedTodo = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        tags: ['updated'],
        creator: 1
      };

      mockTodo.update.mockResolvedValue([1] as any);
      mockTodo.findByPk.mockResolvedValue(updatedTodo as any);

      await updateTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockTodo.update).toHaveBeenCalledWith({
        creator: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        tags: ['updated'],
        imageFile: undefined
      }, {
        where: { id: 1 }
      });
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTodo);
    });

    it('should return 404 when todo not found for update', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'Updated Todo' };
      
      mockTodo.update.mockResolvedValue([0] as any);

      await updateTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "No todo exist with id: 999" });
    });

    it('should handle database errors during update', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Todo' };
      
      mockTodo.update.mockRejectedValue(new Error('Database error'));

      await updateTodo(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe('getTodosBySearch', () => {
    it('should return todos matching search query', async () => {
      mockRequest.query = { searchQuery: 'test' };
      
      const searchResults = [
        { id: 1, title: 'Test Todo 1', creator: 1 },
        { id: 2, title: 'Test Todo 2', creator: 1 }
      ];

      mockTodo.findAll.mockResolvedValue(searchResults as any[]);

      await getTodosBySearch(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(searchResults);
    });

    it('should handle empty search query', async () => {
      mockRequest.query = { searchQuery: '' };
      
      mockTodo.findAll.mockResolvedValue([]);

      await getTodosBySearch(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should handle database errors during search', async () => {
      mockRequest.query = { searchQuery: 'test' };
      
      mockTodo.findAll.mockRejectedValue(new Error('Database error'));

      await getTodosBySearch(mockRequest as IAuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });
});
