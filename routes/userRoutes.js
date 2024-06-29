const express = require('express');
const UserService = require('../services/userService');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const { user, token } = await UserService.registerUser(name, email, password);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await UserService.loginUser(email, password);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
