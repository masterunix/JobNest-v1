import axios from 'axios';
import authService from '../authService';

jest.mock('axios');

describe('Auth Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        const mockData = { token: 'mockToken', user: { id: 1, name: 'John' } };
        axios.post.mockResolvedValue({ data: mockData });

        const userData = { email: 'test@test.com', password: 'password' };
        const result = await authService.register(userData);

        expect(axios.post).toHaveBeenCalledWith('/api/auth/register', userData);
        expect(result).toEqual(mockData);
    });

    it('should login a user successfully', async () => {
        const mockData = { token: 'mockToken', user: { id: 1, name: 'John' } };
        axios.post.mockResolvedValue({ data: mockData });

        const userData = { email: 'test@test.com', password: 'password' };
        const result = await authService.login(userData);

        expect(axios.post).toHaveBeenCalledWith('/api/auth/login', userData);
        expect(result).toEqual(mockData);
    });

    it('should logout a user', () => {
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
        authService.logout();
        expect(removeItemSpy).toHaveBeenCalledWith('user');
        expect(removeItemSpy).toHaveBeenCalledWith('token');
    });
});
