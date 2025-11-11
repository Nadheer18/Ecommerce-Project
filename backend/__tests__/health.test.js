const request = require('supertest');
const app = require('../index'); // Make sure index.js exports your Express app

describe('Health Check API', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('OK');
  });
});

