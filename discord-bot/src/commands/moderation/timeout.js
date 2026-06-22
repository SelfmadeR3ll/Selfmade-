const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

const DURATIONS = {
  '60s': 60_000,
  '5m': 300_000,
  '10m': 600_000,
  '30m': 1_800_000,
  '1h': 3_600_000,
  '6h': 21_600_000,
  '12h': 43_200_000,
  '1d': 86_400_000,
  '7d': 604_800_000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member temporarily')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to timeout').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duration').setDescription('Duration').setRequired(true)
        .addChoices(
          { name: '60 seconds', value: '60s' },
          { name: '5 minutes', value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '30 minutes', value: '30m' },
          { name: '1 hour', value: '1h' },
          { name: '6 hours', value: '6h' },
          { name: '12 hours', value: '12h' },
          { name: '1 day', value: '1d' },
          { name: '7 days', value: '7d' }
        ))
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const durationKey = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const ms = DURATIONS[durationKey];

    if (!target) return interaction.reply({ embeds: [embeds.error('User not found.')], ephemeral: true });
    if (!target.moderatable) return interaction.reply({ embeds: [embeds.error('I cannot timeout this user.')], ephemeral: true });

    await target.timeout(ms, `${reason} — by ${interaction.user.tag}`);

    const log = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle('⏱️ Member Timed Out')
      .addFields(
        { name: 'User', value: `${target.user.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Duration', value: durationKey, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    logChannel?.send({ embeds: [log] }).catch(() => {});

    return interaction.reply({
      embeds: [embeds.success('Timed Out', `**${target.user.tag}** has been timed out for **${durationKey}**.\nReason: ${reason}`)],
      ephemeral: true,
    });
  },
};
