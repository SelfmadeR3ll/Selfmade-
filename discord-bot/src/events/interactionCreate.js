const logger = require('../utils/logger');
const embeds = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
      logger.event(`/${interaction.commandName} used by ${interaction.user.tag}`);
    } catch (err) {
      logger.error(`Command /${interaction.commandName}: ${err.message}`);
      const errEmbed = embeds.error(err.message || 'Something went wrong. Try again.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
      }
    }
  },
};
