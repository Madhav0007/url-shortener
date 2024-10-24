const Url = require('../models/url');
const shortid = require('shortid');
const validUrl = require('valid-url');
const QRCode = require('qrcode');

// Shorten URL controller
exports.shortenUrl = async (req, res) => {
    const { longUrl, expirationDate, password } = req.body;

    // Validate the long URL
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ error: 'Invalid long URL' });
    }

    // Generate short URL code
    const shortUrlCode = shortid.generate();

    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/${shortUrlCode}`);

    // Save URL data in the database
    const newUrl = new Url({
        longUrl,
        shortUrlCode,
        expirationDate: expirationDate || null, // Optional expiration
        password: password || null, // Optional password
        qrCode: qrCodeUrl, // Store the generated QR code
    });

    await newUrl.save();

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortUrlCode}`;
    res.json({ shortUrl, qrCode: qrCodeUrl });
};

// Redirect to original URL
exports.redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const { password } = req.body; // Password if needed

    // Find the URL by short code
    const url = await Url.findOne({ shortUrlCode: shortUrl });

    if (url) {
        // Check expiration
        if (url.expirationDate && new Date() > new Date(url.expirationDate)) {
            return res.status(410).json({ error: 'URL expired' });
        }

        // Check password if set
        if (url.password && url.password !== password) {
            return res.status(403).json({ error: 'Incorrect password' });
        }

        // Increment the access count and redirect to the long URL
        url.accessCount++;
        await url.save();

        res.redirect(url.longUrl);
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
};

// Get URL stats
exports.getUrlStats = async (req, res) => {
    const { shortUrl } = req.params;

    const url = await Url.findOne({ shortUrlCode: shortUrl });

    if (url) {
        res.json({
            longUrl: url.longUrl,
            shortUrlCode: url.shortUrlCode,
            accessCount: url.accessCount,
            expirationDate: url.expirationDate,
            passwordProtected: !!url.password,
        });
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
};
