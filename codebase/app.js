import { Client } from 'discord.js';
import { config } from 'dotenv';
import { startChosenGame, pauseGame, unpauseGame } from './games/gameUtils.js';
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

  if (content.startsWith("!start")) {
    message.channel.send('Initialising...');
    startChosenGame(content, message.channel);
  }

  if (content.startsWith("!pause")) {
    pauseGame();
  }

  if (content.startsWith("!unpause")) {
    unpauseGame();
  }
});

client.login(process.env.TOKEN);
