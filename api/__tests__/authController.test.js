
const { register } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

// Mock dependencies
jest.mock('../models/User', () => {
    const mockUser = jest.fn();
    mockUser.findOne = jest.fn();
    mockUser.comparePassword = jest.fn(); // Added back comparePassword
    return mockUser;
});
jest.mock('jsonwebtoken');
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => true),
        array: jest.fn(() => [])
    }))
}));

describe('Auth Controller - Register', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        req.body = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'jobseeker'
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        // Mock User.findOne to return null (user doesn't exist)
        User.findOne.mockResolvedValue(null);

        // Mock User constructor
        const mockSave = jest.fn();
        User.mockImplementation(() => ({
            save: mockSave,
            _id: 'mockUserId',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'jobseeker'
        }));

        // Mock jwt.sign
        jwt.sign.mockReturnValue('mockToken');

        await register(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            success: true,
            message: 'User registered successfully',
            token: 'mockToken',
            user: expect.objectContaining({
                email: 'john@example.com'
            })
        });
    });

    it('should return 400 if user already exists', async () => {
        // Mock User.findOne to return an existing user
        User.findOne.mockResolvedValue({ email: 'john@example.com' });

        await register(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            success: false,
            message: 'User with this email already exists'
        });
    });
});
