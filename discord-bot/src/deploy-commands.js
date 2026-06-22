require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const commands = [];
const dirs = ['moderation', 'music', 'fun', 'utility'];

for (const dir of dirs) {
  const files = fs.readdirSync(path.join(__dirname, 'commands', dir)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(__dirname, 'commands', dir, file));
    if (cmd.data) commands.push(cmd.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    logger.info(`Registering ${commands.length} slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    logger.success('Slash commands registered successfully.');
  } catch (err) {
    logger.error(err.message);
  }
})();
