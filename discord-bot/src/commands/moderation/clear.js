const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages from this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of messages to delete (1–100)').setMinValue(1).setMaxValue(100).setRequired(true))
    .addUserOption(opt =>
      opt.setName('user').setDescription('Only delete messages from this user').setRequired(false)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: 100 });

    if (targetUser) {
      messages = messages.filter(m => m.author.id === targetUser.id);
    }

    // Discord bulk delete only works on messages < 14 days old
    const bulkable = messages.filter(m => Date.now() - m.createdTimestamp < 12096e5);
    const toDelete = [...bulkable.values()].slice(0, amount);

    if (toDelete.length === 0) {
      return interaction.editReply({ embeds: [embeds.error('No eligible messages found (messages must be under 14 days old).')] });
    }

    await interaction.channel.bulkDelete(toDelete, true);

    return interaction.editReply({
      embeds: [embeds.success('Cleared', `Deleted **${toDelete.length}** message(s)${targetUser ? ` from ${targetUser.tag}` : ''}.`)],
    });
  },
};
