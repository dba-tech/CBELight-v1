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

async function signupAndGetToken() {
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({ firstName: 'Sam', lastName: 'Lee', email: 'sam@example.com', password: 'pw12345' });
  return signupRes.body.token;
}

test('GET and PUT /api/users/me', async () => {
  const token = await signupAndGetToken();

  const meRes = await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(meRes.body).toHaveProperty('email', 'sam@example.com');

  const updateRes = await request(app)
    .put('/api/users/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Samuel' })
    .expect(200);

  expect(updateRes.body).toHaveProperty('firstName', 'Samuel');
});
