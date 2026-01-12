const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
    constructor() {
        this.bot = null;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.isConfigured = false;
        this.botInfo = null;

        this.init();
    }

    init() {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.log('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
            return;
        }

        if (!this.chatId) {
            console.log('❌ TELEGRAM_CHAT_ID not found in environment variables');
            return;
        }

        try {
            this.bot = new TelegramBot(token, { polling: false });
            this.isConfigured = true;
            console.log('✅ Telegram bot initialized successfully');

            // Test bot connection
            this.testConnection();
        } catch (error) {
            console.error('❌ Error initializing Telegram bot:', error.message);
        }
    }

    async testConnection() {
        if (!this.isConfigured) return;

        try {
            this.botInfo = await this.bot.getMe();
            console.log(`✅ Bot connected: @${this.botInfo.username}`);
        } catch (error) {
            console.error('❌ Error testing bot connection:', error.message);
            this.isConfigured = false;
        }
    }

    async sendMessage(message, options = {}) {
        if (!this.isConfigured || !this.bot) {
            console.log('❌ Telegram bot not configured');
            return { success: false, message: 'Telegram bot not configured' };
        }

        try {
            const sentMessage = await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'HTML',
                ...options
            });

            console.log('✅ Message sent to Telegram');
            return { success: true, message: 'Message sent successfully', data: sentMessage };
        } catch (error) {
            console.error('❌ Error sending message to Telegram:', error.message);
            return { success: false, message: error.message };
        }
    }

    async sendContactForm(data) {
        const message = `
📧 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
💬 <b>Сообщение:</b> ${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
        `;

        return await this.sendMessage(message);
    }

    async sendTestMessage() {
        const message = `
🧪 <b>Тестовое сообщение</b>

Это тестовое сообщение от бота InfinIT.
Если вы видите это сообщение, значит интеграция с Telegram работает корректно.

✅ <b>Статус:</b> Система функционирует нормально
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
        `;

        return await this.sendMessage(message);
    }

    getStatus() {
        return {
            configured: this.isConfigured,
            botInfo: this.botInfo,
            message: this.isConfigured ? 'Bot is ready' : 'Bot is not configured'
        };
    }
}

module.exports = new TelegramService();