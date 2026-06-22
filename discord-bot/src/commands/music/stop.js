const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music and disconnect from voice'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ embeds: [embeds.error('Nothing is playing right now.')], ephemeral: true });
    }

    queue.delete();

    return interaction.reply({
      embeds: [embeds.music('Stopped', 'Music stopped and queue cleared. See you next time!')],
    });
  },
};
