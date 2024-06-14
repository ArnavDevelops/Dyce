//To show that the bot is typing, helpful for say command

/**
 * 
 * @param {string} channel 
 */
let startTyping = async function(channel: any) {
    await channel.sendTyping();
}

export default startTyping