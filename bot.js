const { Telegraf } = require('telegraf');
const axios = require('axios');
const { TELEGRAM_API_TOKEN } = require('./config');

const bot = new Telegraf(TELEGRAM_API_TOKEN);

const fetchJson = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

bot.on('text', async (ctx) => {
    const userInput = ctx.message.text.trim();
    const commandMatch = userInput.match(/^\/(\w+)(?:\s+(.+))?$/);
    if (!commandMatch) {
        return ctx.reply("Invalid command.");
    }

    const command = commandMatch[1].toLowerCase();
    const q = commandMatch[2]?.trim();
    const captionx = "𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝙱𝙻𝚄𝙴𝙳𝙴𝙼𝙾𝙽🐦‍🔥";

    // Send "PROCESSING...." message and store its ID
    const processingMessage = await ctx.reply("PROCESSING....");

    switch (command) {
        case 'fb':
        case 'facebook':
        case 'facebookvid': {
            if (!q) {
                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                return ctx.reply("`No Facebook link detected`\n*Example: /fb <link>*", { parse_mode: 'Markdown' });
            }

            try {
                const apiUrl = `https://api.giftedtech.my.id/api/download/facebook?apikey=gifted&url=${encodeURIComponent(q)}`;
                const response = await fetchJson(apiUrl);

                if (!response || !response.success || !response.result) {
                    await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                    return ctx.reply("Failed to fetch the video. Ensure the link is valid and try again.");
                }

                const { hd_video, sd_video } = response.result;
                const videoUrl = hd_video || sd_video;

                const captionText = `*DOWNLOAD COMPLETED*\n\`\`\`${captionx}\`\`\``;

                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                await ctx.replyWithVideo(
                    { url: videoUrl },
                    { caption: captionText, parse_mode: 'Markdown' }
                );
            } catch (error) {
                console.error(error);
                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                ctx.reply("An error occurred while processing your request. Please try again later.");
            }
            break;
        }

        case 'tiktok':
        case 'tt': {
            if (!q) {
                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                return ctx.reply("`No TikTok link detected`\n*Example: /tiktok <link>*", { parse_mode: 'Markdown' });
            }

            try {
                const apiUrl = `https://api-lenwy.vercel.app/tiktok?url=${encodeURIComponent(q)}`;
                const response = await fetchJson(apiUrl);

                if (!response || !response.data) {
                    await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                    return ctx.reply("Failed to fetch the video. Ensure the link is valid and try again.");
                }

                const { no_watermark } = response.data;

                const captionText = `*TIKTOK DOWNLOADER*\n\`\`\`${captionx}\`\`\``;

                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                await ctx.replyWithVideo(
                    { url: no_watermark },
                    { caption: captionText, parse_mode: 'Markdown' }
                );
            } catch (error) {
                console.error("Error fetching TikTok data:", error);
                await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
                ctx.reply("An error occurred while processing your request. Please try again later.");
            }
            break;
        }
case 'blueai': {
    if (!q) {
        await ctx.deleteMessage(awaitMessage.message_id); // Delete "PROCESSING...."
        return ctx.reply(
            `*Please provide a query.*\n\n*Example:* /blueai Hello, which model are you?`,
            { parse_mode: 'Markdown' }
        );
    }

    try {
        // Construct the prompt
        const prompt = `You are BLUE AI, an advanced artificial intelligence model developed by BLUE DEMON for the BLUEXDEMON-V4 project. As BLUE AI Version 4, you are designed to provide insightful and accurate responses. Your purpose is to assist users with a wide range of tasks and queries effectively, from now on you are branded by this. Question: ${q}`;

        // API URL
        const apiUrl = `https://api-lenwy.vercel.app/ai4chat?text=${encodeURIComponent(prompt)}`;

        // Fetch AI response
        const response = await axios.get(apiUrl);
        const res = response.data;

        // Validate API response
        if (res.status !== 200 || !res.data) {
            await ctx.deleteMessage(awaitMessage.message_id); // Delete "PROCESSING...."
            return ctx.reply("Failed to process your request. Please try again later.");
        }

        // Extract AI response text
        const aiResponse = res.data;

        // Send the response along with an image
        const imageUrl = './images/thumb.jpg'; // Replace with your image URL
        const captionText = `*BLUE AI Response:*\n\n${aiResponse}\n> \`\`\`${captionx}\`\`\``;

        await ctx.deleteMessage(awaitMessage.message_id); // Delete "PROCESSING...."
        await ctx.replyWithPhoto(
            { url: imageUrl },
            { caption: captionText, parse_mode: 'Markdown' }
        );
    } catch (error) {
        console.error("Error in BLUE AI case:", error);
        await ctx.deleteMessage(awaitMessage.message_id); // Delete "PROCESSING...."
        ctx.reply("An error occurred while processing your request. Please try again later.");
    }

    break;
}
        default:
            await ctx.deleteMessage(processingMessage.message_id); // Delete "PROCESSING...."
            ctx.reply("Unknown command.");
            break;
    }
});

bot.launch().then(() => {
    console.log('Bot is running...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));