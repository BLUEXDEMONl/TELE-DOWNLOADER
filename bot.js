const { Telegraf } = require('telegraf');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Your bot's token from BotFather
const token = 'YOUR_BOT_API_TOKEN';

// Create a new bot instance
const bot = new Telegraf(token);

// Command handler for /Facebook <link>
bot.command('Facebook', async (ctx) => {
    const chatId = ctx.chat.id;
    const userInput = ctx.message.text;

    // Extract the link from the user input
    const match = userInput.match(/\/Facebook (https:\/\/www\.facebook\.com\/.*)/);
    if (!match) {
        return ctx.reply('Please provide a valid Facebook video link. Example: /Facebook https://www.facebook.com/watch/?v=123456789');
    }

    const facebookUrl = match[1];
    
    // API URL to fetch the video download link
    const apiUrl = `https://bk9.fun/download/fb?url=${encodeURIComponent(facebookUrl)}`;

    try {
        // Fetch video data from the API
        const response = await axios.get(apiUrl);
        const videoData = response.data;

        // Check if the response is valid
        if (videoData.status) {
            const videoInfo = videoData.BK9;

            // Send video file to the user
            const videoUrl = videoInfo.hd || videoInfo.sd;  // Use HD if available, otherwise SD
            const videoResponse = await fetch(videoUrl);
            const videoBuffer = await videoResponse.buffer();

            const videoFileName = path.basename(videoUrl);

            // Save video temporarily to send it
            const videoPath = path.join(__dirname, videoFileName);
            fs.writeFileSync(videoPath, videoBuffer);

            // Send the video to the user
            await ctx.replyWithVideo({ source: videoPath });

            // Clean up the temporary video file
            fs.unlinkSync(videoPath);
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