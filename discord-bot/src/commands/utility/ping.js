const { SlashCommandBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;

    return interaction.editReply({
      content: '',
      embeds: [
        embeds.info('🏓 Pong!', `**Roundtrip:** ${roundtrip}ms\n**WebSocket:** ${client.ws.ping}ms`),
      ],
    });
  },
};
