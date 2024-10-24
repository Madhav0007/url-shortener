const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrlCode: { type: String, required: true, unique: true },
    accessCount: { type: Number, default: 0 },
    expirationDate: { type: Date }, // Optional expiration date
    password: { type: String }, // Optional password for protected URLs
    qrCode: { type: String }, // Optional QR code data URL
});

module.exports = mongoose.model('Url', UrlSchema);
