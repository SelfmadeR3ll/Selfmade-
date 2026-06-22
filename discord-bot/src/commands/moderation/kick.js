const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the kick').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ embeds: [embeds.error('User not found in this server.')], ephemeral: true });
    if (!target.kickable) return interaction.reply({ embeds: [embeds.error('I cannot kick this user.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [embeds.error("You can't kick yourself.")], ephemeral: true });

    await target.send(
      embeds.error(`You have been **kicked** from **${interaction.guild.name}**.\nReason: ${reason}`)
    ).catch(() => {});

    await target.kick(`${reason} — by ${interaction.user.tag}`);

    const log = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('👢 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.user.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    logChannel?.send({ embeds: [log] }).catch(() => {});

    return interaction.reply({ embeds: [embeds.success('Kicked', `**${target.user.tag}** has been kicked.\nReason: ${reason}`)], ephemeral: true });
  },
};
