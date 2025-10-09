import { Request, Response } from 'express';
import { signin, signup } from '../../controllers/user';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// Mock User model
jest.mock('../../models/user');
const mockUser = User as jest.Mocked<typeof User>;

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup User model mocks
    (mockUser.findOne as jest.Mock) = jest.fn();
    (mockUser.create as jest.Mock) = jest.fn();
  });

  describe('signin', () => {
    it('should return 404 when user does not exist', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUser.findOne.mockResolvedValue(null);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User doesn't exist" });
    });

    it('should return 400 when password is incorrect', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUserData = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      mockUser.findOne.mockResolvedValue(mockUserData as any);
      mockedBcrypt.compare.mockResolvedValue(false);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 200 with token when credentials are valid', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'correctpassword'
      };

      const mockUserData = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      mockUser.findOne.mockResolvedValue(mockUserData as any);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as any);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { email: 'test@example.com', id: 1 },
        'test',
        { expiresIn: '1h' }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        result: mockUserData,
        token: 'mock-jwt-token'
      });
    });

    it('should handle database errors', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
  });

  describe('signup', () => {
    it('should return 400 when user already exists', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const existingUser = {
        id: 1,
        email: 'existing@example.com',
        name: 'Existing User'
      };

      mockUser.findOne.mockResolvedValue(existingUser as any);

      await signup(mockRequest as Request, mockResponse as Response);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should create new user and return token', async () => {
      mockRequest.body = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const newUser = {
        id: 2,
        email: 'newuser@example.com',
        name: 'John Doe',
        password: 'hashedpassword'
      };

      mockUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword');
      mockUser.create.mockResolvedValue(newUser as any);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as any);

      await signup(mockRequest as Request, mockResponse as Response);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'hashedpassword',
        name: 'John Doe'
      });
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { email: 'newuser@example.com', id: 2 },
        'test',
        { expiresIn: '1h' }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        result: newUser,
        token: 'mock-jwt-token'
      });
    });

    it('should handle database errors during signup', async () => {
      mockRequest.body = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockUser.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword');
      mockUser.create.mockRejectedValue(new Error('Database error'));

      await signup(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
  });
});
