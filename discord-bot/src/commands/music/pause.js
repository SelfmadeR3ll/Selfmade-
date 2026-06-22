const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause or resume the current song'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.isPlaying()) {
      return interaction.reply({ embeds: [embeds.error('Nothing is playing right now.')], ephemeral: true });
    }

    const paused = queue.node.isPaused();
    paused ? queue.node.resume() : queue.node.pause();

    return interaction.reply({
      embeds: [embeds.music(paused ? 'Resumed' : 'Paused', paused ? 'Music resumed.' : 'Music paused. Use `/pause` to resume.')],
    });
  },
};
