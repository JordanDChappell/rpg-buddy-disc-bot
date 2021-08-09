import { Client } from 'discord.js';
import { config } from 'dotenv';
import { extractDiceRollResponse } from './utils/diceUtils.js';

config(); // required to ensure our .env file variables are created

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {

  const member = await message.guild.member(message.author);
  const username = member ? member.nickname : message.author.username;
  const content = message.content.trim().toLowerCase();

  if (content.startsWith("!roll")) {
    const response = extractDiceRollResponse(username, content);
    if (response) message.channel.send(response);
  }
});

client.login(process.env.TOKEN);
