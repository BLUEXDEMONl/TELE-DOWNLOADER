const { Telegraf } = require('telegraf');
const axios = require('axios');

// Your bot's token from BotFather
const token = '7278588122:AAG2Joa9TT7pOjPb-nDw5LJUBl8Oi9OoGwQ';

// Create a new bot instance
const bot = new Telegraf(token);

// Command handler for /Facebook
bot.command('Facebook', async (ctx) => {
    const chatId = ctx.chat.id;
    
    // Example API URL (Replace with actual API endpoint)
    const apiUrl = 'https://bk9.fun/download/fb?url=https://www.facebook.com/watch/?v=322884916560598';
    
    try {
        // Fetch video data from the API
        const response = await axios.get(apiUrl);
        const videoData = response.data;

        // Check if the response is valid
        if (videoData.status) {
            const videoInfo = videoData.BK9;

            // Prepare the message with video info
            const message = `
            📹 **Video Title:** ${videoInfo.title || "No video title"}
            📝 **Description:** ${videoInfo.desc || "No video description..."}
            🎥 **Download SD Video:** [SD Link](${videoInfo.sd})
            🎥 **Download HD Video:** [HD Link](${videoInfo.hd})
            🔗 **Video Thumbnail:** ![Thumbnail](${videoInfo.thumb})
            `;
            
            // Send the video thumbnail
            await ctx.telegram.sendPhoto(chatId, videoInfo.thumb);

            // Send the video info message
            await ctx.reply(message);
        } else {
            await ctx.reply('Sorry, there was an issue retrieving the video.');
        }
    } catch (error) {
        console.error(error);
        await ctx.reply('Failed to fetch the video data.');
    }
});

// Start the bot
bot.launch().then(() => {
    console.log('Bot is running...');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));