const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to ban').setRequired(true))
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the ban').setRequired(false))
    .addIntegerOption(opt =>
      opt.setName('days').setDescription('Delete message history (days, 0–7)').setMinValue(0).setMaxValue(7).setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;

    if (!target) return interaction.reply({ embeds: [embeds.error('User not found in this server.')], ephemeral: true });
    if (!target.bannable) return interaction.reply({ embeds: [embeds.error('I cannot ban this user. They may have a higher role than me.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [embeds.error("You can't ban yourself.")], ephemeral: true });

    await target.send(
      embeds.error(`You have been **banned** from **${interaction.guild.name}**.\nReason: ${reason}`)
    ).catch(() => {});

    await target.ban({ deleteMessageDays: days, reason: `${reason} — by ${interaction.user.tag}` });

    const log = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.user.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    logChannel?.send({ embeds: [log] }).catch(() => {});

    return interaction.reply({ embeds: [embeds.success('Banned', `**${target.user.tag}** has been banned.\nReason: ${reason}`)], ephemeral: true });
  },
};
