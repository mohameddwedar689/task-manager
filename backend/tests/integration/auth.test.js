const request = require('supertest');
process.env.JWT_SECRET = 'test_secret_for_jest';
process.env.MONGODB_URI = 'mongodb://placeholder'; // unused; connection handled by setup.js

const app = require('../../src/app');
const { connect, closeDatabase, clearDatabase } = require('./setup');

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

describe('POST /api/auth/register', () => {
  test('creates a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('jane@example.com');
    // password must never be returned
    expect(res.body.data.user.password).toBeUndefined();
  });

  test('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Another Jane',
      email: 'jane@example.com',
      password: 'password456',
    });

    expect(res.status).toBe(409);
  });

  test('rejects invalid input with 422', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'J',
      email: 'not-an-email',
      password: '123',
    });
    expect(res.status).toBe(422);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  test('rejects unknown email with the same generic 401 message as wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
