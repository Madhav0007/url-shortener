const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static('public'));

// URL store for shortened URLs
const urlStore = {};

// Serve the index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Shorten URL route
app.post('/api/shorten', (req, res) => {
    const { longUrl, expirationDate } = req.body;
    const shortCode = generateShortCode();
    const shortUrl = `http://localhost:${port}/${shortCode}`;

    urlStore[shortCode] = {
        longUrl,
        expirationDate: expirationDate || null,
        clickCount: 0,
        clicks: []
    };

    res.json({ shortUrl });
});

// Redirect shortened URL route
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;
    const urlData = urlStore[shortCode];

    if (urlData) {
        // Check for expiration
        if (urlData.expirationDate && new Date(urlData.expirationDate) < new Date()) {
            return res.status(410).send('This URL has expired.');
        }

        // Track the click
        urlData.clickCount++;
        urlData.clicks.push(new Date().toISOString());
        return res.redirect(urlData.longUrl);
    }

    return res.status(404).send('Not Found');
});

// Dummy user credentials for authentication
const users = {
    'user@example.com': 'password123'
};

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (users[email] && users[email] === password) {
        req.session.user = email;
        return res.status(200).send('Logged in!');
    }

    return res.status(401).send('Invalid credentials.');
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(403).send('Access denied. Please log in.');
};

// URL tracking route (protected)
app.get('/api/tracking/:shortCode', isAuthenticated, (req, res) => {
    const shortCode = req.params.shortCode;
    const urlData = urlStore[shortCode];

    if (urlData) {
        return res.json({
            longUrl: urlData.longUrl,
            clickCount: urlData.clickCount,
            clicks: urlData.clicks
        });
    } else {
        return res.status(404).send('Short URL not found.');
    }
});

// Helper function to generate a short code
function generateShortCode() {
    return Math.random().toString(36).substring(2, 9); // Generates a random short code
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
