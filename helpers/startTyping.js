//To show that the bot is typing, helpful for say command

/**
 * 
 * @param {string} channel 
 */
module.exports.startTyping = async function(channel) {
    await channel.sendTyping();
}