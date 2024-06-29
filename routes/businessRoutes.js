const express = require('express');
const { validateBusiness } = require('../middleware/validation');
const auth = require('../middleware/auth');
const BusinessService = require('../services/businessService');
const { MESSAGES } = require('../constants');

const router = express.Router();

router.post('/business', [auth, validateBusiness], async (req, res) => {
    const { fein, name } = req.body;

    try {
        const business = await BusinessService.createBusiness(fein, name, req.user._id);
        res.status(201).send({ business, nextStep: MESSAGES.INDUSTRY_REQUIRED, requiredFields: ['industry'] });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/business/:id/progress', auth, async (req, res) => {
    const { industry, contact, result } = req.body;

    try {
        const { business, nextStep, requiredFields, message } = await BusinessService.progressBusiness(req.params.id, industry, contact, result);
        res.send({ business, nextStep, requiredFields, message });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
