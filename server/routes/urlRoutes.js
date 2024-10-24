const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getUrlStats } = require('../controllers/urlController');

router.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener API! Use the /shorten endpoint to shorten URLs.');
});

// Route to shorten URL
router.post('/shorten', shortenUrl);

// Route to handle redirection
router.get('/:shortUrl', redirectUrl);

// Route to get stats for a URL
router.get('/stats/:shortUrl', getUrlStats);

module.exports = router;
