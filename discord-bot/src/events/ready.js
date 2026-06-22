const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.success(`Logged in as ${client.user.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);

    client.user.setPresence({
      activities: [{ name: 'SelfmadeR3ll | /help', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
