const request = require('supertest');
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({ connection: { host: 'mockHost' } }),
  Schema: jest.fn(() => ({
    index: jest.fn(),
    pre: jest.fn(),
    methods: {},
    virtual: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
    })),
  })),
  model: jest.fn(),
}));
const app = require('../index');

describe('GET /api/health', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
}); 