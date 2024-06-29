const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const businessRoutes = require('./routes/businessRoutes');
const userRoutes = require('./routes/userRoutes'); // Assuming you have user routes for registration and login
const connectDB = require('./db'); // Import the connectDB function

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use(businessRoutes);
app.use(userRoutes); // Assuming you have user routes for registration and login

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
