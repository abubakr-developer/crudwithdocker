import request from 'supertest';
import app from './server.js';

describe('Backend API', () => {
  // Test 1: basic health-check route
  it('GET / should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // Test 2: input validation, no DB required
  it('POST /api/users without name/email should return 400', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});