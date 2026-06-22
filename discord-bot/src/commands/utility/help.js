const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

const CATEGORIES = {
  '🛡️ Moderation': [
    { cmd: '/ban', desc: 'Ban a member' },
    { cmd: '/kick', desc: 'Kick a member' },
    { cmd: '/timeout', desc: 'Timeout a member (60s → 7d)' },
    { cmd: '/clear', desc: 'Bulk delete messages' },
  ],
  '🎵 Music': [
    { cmd: '/play', desc: 'Play a song or playlist (YouTube, Spotify, SoundCloud)' },
    { cmd: '/pause', desc: 'Pause / resume playback' },
    { cmd: '/skip', desc: 'Skip the current song' },
    { cmd: '/stop', desc: 'Stop music & clear queue' },
    { cmd: '/queue', desc: 'View the current queue' },
  ],
  '🎉 Fun': [
    { cmd: '/poll', desc: 'Create a reaction poll (up to 5 options)' },
    { cmd: '/giveaway start', desc: 'Start a giveaway' },
    { cmd: '/giveaway end', desc: 'End a giveaway early' },
    { cmd: '/giveaway reroll', desc: 'Reroll giveaway winners' },
  ],
  '🔧 Utility': [
    { cmd: '/ping', desc: 'Check bot latency' },
    { cmd: '/serverinfo', desc: 'View server statistics' },
    { cmd: '/help', desc: 'Show this message' },
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(embeds.BRAND_COLOR)
      .setTitle('SelfmadeR3ll Bot — Commands')
      .setDescription('All commands are slash commands. Type `/` to get started.')
      .setTimestamp();

    for (const [category, commands] of Object.entries(CATEGORIES)) {
      embed.addFields({
        name: category,
        value: commands.map(c => `\`${c.cmd}\` — ${c.desc}`).join('\n'),
      });
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
