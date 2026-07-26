const request = require('supertest');
process.env.JWT_SECRET = 'test_secret_for_jest';
process.env.MONGODB_URI = 'mongodb://placeholder';

const app = require('../../src/app');
const { connect, closeDatabase, clearDatabase } = require('./setup');

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

async function registerAndGetToken(email) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email, password: 'password123' });
  return res.body.data.token;
}

describe('Task CRUD', () => {
  test('creates a task for the authenticated user', async () => {
    const token = await registerAndGetToken('owner@example.com');

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write tests', priority: 'High' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Write tests');
    expect(res.body.data.status).toBe('To Do'); // default
  });

  test('rejects task creation without auth', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'No auth' });
    expect(res.status).toBe(401);
  });

  test('rejects an invalid status value with 422', async () => {
    const token = await registerAndGetToken('owner@example.com');
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Bad status', status: 'Not A Status' });
    expect(res.status).toBe(422);
  });

  test('a user cannot read another user\'s task (404, not 403)', async () => {
    const tokenA = await registerAndGetToken('alice@example.com');
    const tokenB = await registerAndGetToken('bob@example.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: "Alice's private task" });

    const taskId = createRes.body.data._id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  test('a user cannot delete another user\'s task', async () => {
    const tokenA = await registerAndGetToken('alice2@example.com');
    const tokenB = await registerAndGetToken('bob2@example.com');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: "Alice's task" });

    const taskId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(deleteRes.status).toBe(404);

    // Confirm it still exists for the real owner
    const getRes = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(getRes.status).toBe(200);
  });

  test('search, filter, and pagination work together', async () => {
    const token = await registerAndGetToken('search@example.com');
    const titles = ['Buy milk', 'Buy bread', 'Clean house', 'Buy eggs'];
    for (const title of titles) {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title, priority: 'Low' });
    }

    const res = await request(app)
      .get('/api/tasks')
      .query({ search: 'Buy', limit: 2, page: 1 })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.meta.total).toBe(3); // 3 tasks match "Buy"
    expect(res.body.meta.totalPages).toBe(2);
  });

  test('updates a task and validates enum fields on update', async () => {
    const token = await registerAndGetToken('update@example.com');
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original title' });

    const taskId = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Done' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('Done');
    expect(updateRes.body.data.title).toBe('Original title'); // unchanged
  });
});
