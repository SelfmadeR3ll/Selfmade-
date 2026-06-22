const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.isPlaying()) {
      return interaction.reply({ embeds: [embeds.error('Nothing is playing right now.')], ephemeral: true });
    }

    const current = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10);

    const upcoming = tracks.length
      ? tracks.map((t, i) => `\`${i + 1}.\` **${t.title}** — ${t.author} (${t.duration})`).join('\n')
      : '*Queue is empty*';

    const embed = embeds.music('Queue', upcoming)
      .setFields(
        { name: '🎵 Now Playing', value: `**[${current.title}](${current.url})**\n${current.author} · ${current.duration}` }
      );

    if (queue.tracks.size > 10) {
      embed.setFooter({ text: `...and ${queue.tracks.size - 10} more tracks` });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
