const { SlashCommandBuilder, GuildMember } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption(opt =>
      opt.setName('query').setDescription('Song name or URL (YouTube, Spotify, SoundCloud)').setRequired(true)),

  async execute(interaction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return interaction.reply({ embeds: [embeds.error('You must be in a voice channel to play music.')], ephemeral: true });
    }

    const query = interaction.options.getString('query');
    const player = useMainPlayer();

    await interaction.deferReply();

    const { track } = await player.play(interaction.member.voice.channel, query, {
      nodeOptions: {
        metadata: { channel: interaction.channel },
        selfDeaf: true,
        volume: 70,
      },
    });

    return interaction.editReply({
      embeds: [
        embeds.music('Added to Queue', `**[${track.title}](${track.url})**\nby ${track.author} · ${track.duration}`)
          .setThumbnail(track.thumbnail),
      ],
    });
  },
};
