const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MESSAGES } = require('../constants');

class UserService {
    static async registerUser(name, email, password) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error(MESSAGES.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return { user, token };
    }

    static async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(MESSAGES.INVALID_CREDENTIALS);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error(MESSAGES.INVALID_CREDENTIALS);
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return { user, token };
    }
}

module.exports = UserService;
