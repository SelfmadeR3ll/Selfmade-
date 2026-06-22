const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.isPlaying()) {
      return interaction.reply({ embeds: [embeds.error('Nothing is playing right now.')], ephemeral: true });
    }

    const current = queue.currentTrack;
    queue.node.skip();

    return interaction.reply({
      embeds: [embeds.music('Skipped', `**${current?.title ?? 'current track'}** was skipped.`)],
    });
  },
};
