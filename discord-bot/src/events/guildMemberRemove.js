const { EmbedBuilder } = require('discord.js');
const embeds = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    logger.event(`${member.user.tag} left ${member.guild.name}`);

    const channelId = process.env.GOODBYE_CHANNEL_ID || process.env.WELCOME_CHANNEL_ID;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setDescription(`**${member.user.tag}** has left the server. We'll miss them.`)
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(() => {});
  },
};
