const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    fein: { type: String, required: true },
    name: { type: String, required: true },
    industry: { type: String, enum: ['restaurants', 'stores', 'wholesale', 'services'], default: null },
    contact: {
        name: { type: String, default: null },
        phone: { type: String, default: null }
    },
    status: { type: String, enum: ['New', 'Market Approved', 'Market Declined', 'Sales Approved', 'Won', 'Lost'], default: 'New' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
}, { timestamps: true }); // Enable timestamps

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
