const request = require('supertest');
const testDb = require('./setup');
const app = require('../server');

beforeAll(async () => {
  await testDb.connect();
});

afterAll(async () => {
  await testDb.closeDatabase();
});

afterEach(async () => {
  await testDb.clearDatabase();
});

test('signup and login flow', async () => {
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({ firstName: 'Alice', lastName: 'Doe', email: 'alice@example.com', password: 'secret123' })
    .expect(201);

  expect(signupRes.body).toHaveProperty('token');
  expect(signupRes.body.user).toMatchObject({ firstName: 'Alice', email: 'alice@example.com' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'secret123' })
    .expect(200);

  expect(loginRes.body).toHaveProperty('token');
  expect(loginRes.body.user.email).toBe('alice@example.com');
});
