const { EmbedBuilder } = require('discord.js');
const embeds = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    logger.event(`${member.user.tag} joined ${member.guild.name}`);

    // Assign New Member role
    const newMemberRole = member.guild.roles.cache.find(r => r.name === 'New Member');
    if (newMemberRole) {
      await member.roles.add(newMemberRole).catch(() => {});
    }

    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(embeds.BRAND_COLOR)
      .setTitle(`Welcome to ${member.guild.name}! 👋`)
      .setDescription(
        `Hey ${member}, glad you're here!\n\n` +
        `📜 Check out <#${member.guild.channels.cache.find(c => c.name === 'rules')?.id ?? 'rules'}> to get started.\n` +
        `🎭 Grab your roles in the roles channel.\n` +
        `💬 Introduce yourself in **#introductions**!`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Member #${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ content: `${member}`, embeds: [embed] }).catch(() => {});
  },
};
