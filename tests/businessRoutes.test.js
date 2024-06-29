const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const connectTestDB = require('../testDb').connectTestDB;
const closeTestDB = require('../testDb').closeTestDB;
const businessRoutes = require('../routes/businessRoutes');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');
const Business = require('../models/Business');
const { MESSAGES } = require('../constants');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(businessRoutes);

let token;
let businessId;

beforeAll(async () => {
    await connectTestDB();

    // Create a user and get a token
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' });
    await user.save();
    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
    await closeTestDB();
});

describe('Business Routes', () => {
    it('should create a new business', async () => {
        const res = await request(app)
            .post('/business')
            .set('Authorization', `Bearer ${token}`)
            .send({
                fein: '123456789',
                name: 'Example Business'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('business');
        expect(res.body.business).toHaveProperty('createdAt');
        expect(res.body.business).toHaveProperty('updatedAt');
        expect(res.body).toHaveProperty('nextStep', MESSAGES.INDUSTRY_REQUIRED);
        expect(res.body).toHaveProperty('requiredFields');
        businessId = res.body.business._id;
    });

    it('should progress business to Market Approved', async () => {
        const res = await request(app)
            .post(`/business/${businessId}/progress`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                industry: 'restaurants'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.business.status).toEqual('Market Approved');
        expect(res.body.business).toHaveProperty('updatedAt'); // Check updatedAt field
        expect(res.body).toHaveProperty('nextStep', MESSAGES.PROVIDE_CONTACT_INFO);
        expect(res.body).toHaveProperty('requiredFields');
    });

    it('should progress business to Sales Approved', async () => {
        const res = await request(app)
            .post(`/business/${businessId}/progress`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                contact: {
                    name: 'Jane Doe',
                    phone: '123-456-7890'
                }
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.business.status).toEqual('Sales Approved');
        expect(res.body.business).toHaveProperty('updatedAt'); // Check updatedAt field
        expect(res.body).toHaveProperty('nextStep', MESSAGES.DECIDE_WON_OR_LOST);
        expect(res.body).toHaveProperty('requiredFields');
    });

    it('should progress business to Won', async () => {
        const res = await request(app)
            .post(`/business/${businessId}/progress`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                result: 'Won'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.business.status).toEqual('Won');
        expect(res.body.business).toHaveProperty('updatedAt'); // Check updatedAt field
        expect(res.body).toHaveProperty('nextStep', null);
        expect(res.body).toHaveProperty('message', MESSAGES.BUSINESS_MARKED('Won'));
    });
});
