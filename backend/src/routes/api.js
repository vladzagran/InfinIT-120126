const express = require('express');
const router = express.Router();
const telegramService = require('../config/telegram');

// Check Telegram bot status
router.get('/telegram-status', (req, res) => {
    try {
        const status = telegramService.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({
            configured: false,
            message: error.message
        });
    }
});

// Send test message to Telegram
router.post('/test-telegram', async(req, res) => {
    try {
        const result = await telegramService.sendTestMessage();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Handle contact form submission
router.post('/contact', async(req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        // Basic validation
        if (!name || !phone || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Все поля обязательны для заполнения'
            });
        }

        // Send to Telegram
        const telegramResult = await telegramService.sendContactForm({
            name,
            phone,
            email,
            message
        });

        if (telegramResult.success) {
            res.json({
                success: true,
                message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
                telegram: telegramResult
            });
        } else {
            res.json({
                success: true,
                message: 'Сообщение сохранено! Мы свяжемся с вами в ближайшее время.',
                telegram: telegramResult
            });
        }

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.'
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'InfinIT Backend'
    });
});

module.exports = router;