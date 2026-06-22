const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show information about this server'),

  async execute(interaction) {
    const { guild } = interaction;
    await guild.members.fetch();

    const owner = await guild.fetchOwner();
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humans = guild.memberCount - bots;
    const online = guild.members.cache.filter(m => m.presence?.status !== 'offline' && !m.user.bot).size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;

    const embed = new EmbedBuilder()
      .setColor(embeds.BRAND_COLOR)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👑 Owner', value: owner.user.tag, inline: true },
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Members', value: `${humans} humans · ${bots} bots · ${online} online`, inline: false },
        { name: '💬 Channels', value: `${textChannels} text · ${voiceChannels} voice`, inline: true },
        { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🚀 Boost Level', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`, inline: true },
      )
      .setFooter({ text: 'SelfmadeR3ll' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
