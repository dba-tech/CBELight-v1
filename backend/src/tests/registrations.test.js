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

async function createUserAndGetToken() {
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({ firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', password: 'pw12345' });
  return signupRes.body.token;
}

test('create registration and get stats', async () => {
  const token = await createUserAndGetToken();

  const regRes = await request(app)
    .post('/api/registrations')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', phone: '123456', program: 'Business Intelligence with Technology', department: 'Accountancy' })
    .expect(201);

  expect(regRes.body).toHaveProperty('_id');
  expect(regRes.body.firstName).toBe('Bob');

  const listRes = await request(app)
    .get('/api/registrations')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.length).toBe(1);

  const statsRes = await request(app)
    .get('/api/registrations/stats')
    .expect(200);

  expect(statsRes.body).toHaveProperty('total');
  expect(statsRes.body.total).toBe(1);
});

test('get registration by id', async () => {
  const token = await createUserAndGetToken();

  const regRes = await request(app)
    .post('/api/registrations')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', phone: '123456', department: 'ICT & Mathematics' })
    .expect(201);

  const regId = regRes.body._id;

  const getRes = await request(app)
    .get(`/api/registrations/${regId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(getRes.body._id).toBe(regId);
  expect(getRes.body.firstName).toBe('Bob');
});

test('update registration by id', async () => {
  const token = await createUserAndGetToken();

  const regRes = await request(app)
    .post('/api/registrations')
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', phone: '123456', department: 'Marketing' })
    .expect(201);

  const regId = regRes.body._id;

  const updateRes = await request(app)
    .put(`/api/registrations/${regId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ firstName: 'Robert', phone: '999999' })
    .expect(200);

  expect(updateRes.body._id).toBe(regId);
  expect(updateRes.body.firstName).toBe('Robert');
  expect(updateRes.body.phone).toBe('999999');
  expect(updateRes.body.lastName).toBe('Smith'); // unchanged
});
