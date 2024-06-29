const mongoose = require('mongoose');
require('dotenv').config();


const connectTestDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_TEST_URI, {});
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const closeTestDB = async () => {
    try {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    } catch (err) {
        console.error('MongoDB disconnection error:', err.message);
        process.exit(1);
    }
};

module.exports = { connectTestDB, closeTestDB };
