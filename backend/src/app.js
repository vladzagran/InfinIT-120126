const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Serve specific files with correct MIME types
app.use('/style', express.static(path.join(__dirname, '../../frontend/style')));
app.use('/script', express.static(path.join(__dirname, '../../frontend/script')));

// Routes
app.use('/api', require('./routes/api'));

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/services.html'));
});

app.get('/test-telegram.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/test-telegram.html'));
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Telegram bot integration: ${process.env.TELEGRAM_BOT_TOKEN ? 'Enabled' : 'Disabled'}`);
});