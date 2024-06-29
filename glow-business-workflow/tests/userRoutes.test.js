const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const connectTestDB = require('../testDb').connectTestDB;
const closeTestDB = require('../testDb').closeTestDB;
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');
const { MESSAGES } = require('../constants');

const app = express();
app.use(express.json());
app.use(userRoutes);

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe('User Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
    });

    it('should not register an existing user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(MESSAGES.USER_ALREADY_EXISTS);
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual(MESSAGES.INVALID_CREDENTIALS);
    });
});
