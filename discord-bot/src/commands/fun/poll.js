const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embeds = require('../../utils/embeds');

const EMOJI_MAP = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a reaction poll')
    .addStringOption(opt =>
      opt.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option3').setDescription('Option 3').setRequired(false))
    .addStringOption(opt =>
      opt.setName('option4').setDescription('Option 4').setRequired(false))
    .addStringOption(opt =>
      opt.setName('option5').setDescription('Option 5').setRequired(false)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = [1, 2, 3, 4, 5]
      .map(n => interaction.options.getString(`option${n}`))
      .filter(Boolean);

    const optionLines = options.map((o, i) => `${EMOJI_MAP[i]} ${o}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(embeds.BRAND_COLOR)
      .setTitle(`📊 ${question}`)
      .setDescription(optionLines)
      .setFooter({ text: `Poll by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    const msg = await interaction.fetchReply();

    for (let i = 0; i < options.length; i++) {
      await msg.react(EMOJI_MAP[i]);
    }
  },
};
