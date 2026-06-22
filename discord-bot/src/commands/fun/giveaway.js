const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const embeds = require('../../utils/embeds');
const fs = require('fs');
const path = require('path');

const GIVEAWAY_FILE = path.join(__dirname, '../../../data/giveaways.json');
const ENTER_EMOJI = '🎉';

function loadGiveaways() {
  if (!fs.existsSync(GIVEAWAY_FILE)) return {};
  return JSON.parse(fs.readFileSync(GIVEAWAY_FILE, 'utf8'));
}

function saveGiveaways(data) {
  fs.writeFileSync(GIVEAWAY_FILE, JSON.stringify(data, null, 2));
}

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const [, n, unit] = match;
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return parseInt(n) * multipliers[unit];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Manage giveaways')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub.setName('start')
        .setDescription('Start a giveaway')
        .addStringOption(opt => opt.setName('prize').setDescription('What are you giving away?').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 1h, 30m, 2d)').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(10).setRequired(false))
    )
    .addSubcommand(sub =>
      sub.setName('end')
        .setDescription('End a giveaway early')
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('reroll')
        .setDescription('Reroll winners for a giveaway')
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the ended giveaway').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'start') {
      const prize = interaction.options.getString('prize');
      const durationStr = interaction.options.getString('duration');
      const winnerCount = interaction.options.getInteger('winners') ?? 1;
      const ms = parseDuration(durationStr);

      if (!ms) {
        return interaction.reply({ embeds: [embeds.error('Invalid duration. Use formats like `1h`, `30m`, `2d`.')], ephemeral: true });
      }

      const endsAt = new Date(Date.now() + ms);

      const embed = new EmbedBuilder()
        .setColor(embeds.BRAND_COLOR)
        .setTitle(`🎉 GIVEAWAY — ${prize}`)
        .setDescription(
          `React with ${ENTER_EMOJI} to enter!\n\n` +
          `**Prize:** ${prize}\n` +
          `**Winners:** ${winnerCount}\n` +
          `**Ends:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>\n` +
          `**Hosted by:** ${interaction.user}`
        )
        .setFooter({ text: `Ends at` })
        .setTimestamp(endsAt);

      await interaction.reply({ embeds: [embeds.success('Giveaway Started', `Good luck everyone! React ${ENTER_EMOJI} to enter.`)], ephemeral: true });
      const msg = await interaction.channel.send({ embeds: [embed] });
      await msg.react(ENTER_EMOJI);

      const giveaways = loadGiveaways();
      giveaways[msg.id] = {
        prize, winnerCount, endsAt: endsAt.toISOString(),
        channelId: interaction.channel.id, guildId: interaction.guild.id,
        hostId: interaction.user.id, ended: false,
      };
      saveGiveaways(giveaways);

      setTimeout(() => endGiveaway(msg, interaction.client), ms);
    }

    if (sub === 'end') {
      const msgId = interaction.options.getString('message_id');
      const giveaways = loadGiveaways();
      const gw = giveaways[msgId];
      if (!gw) return interaction.reply({ embeds: [embeds.error('Giveaway not found.')], ephemeral: true });

      const channel = interaction.guild.channels.cache.get(gw.channelId);
      const msg = await channel?.messages.fetch(msgId).catch(() => null);
      if (!msg) return interaction.reply({ embeds: [embeds.error('Could not find the giveaway message.')], ephemeral: true });

      await interaction.reply({ embeds: [embeds.success('Ending', 'Ending giveaway now...')], ephemeral: true });
      await endGiveaway(msg, interaction.client);
    }

    if (sub === 'reroll') {
      const msgId = interaction.options.getString('message_id');
      const giveaways = loadGiveaways();
      const gw = giveaways[msgId];
      if (!gw || !gw.ended) return interaction.reply({ embeds: [embeds.error('No ended giveaway found with that ID.')], ephemeral: true });

      const channel = interaction.guild.channels.cache.get(gw.channelId);
      const msg = await channel?.messages.fetch(msgId).catch(() => null);
      if (!msg) return interaction.reply({ embeds: [embeds.error('Could not find the giveaway message.')], ephemeral: true });

      const winners = await pickWinners(msg, gw.winnerCount, interaction.client);
      const winnerMentions = winners.length ? winners.map(w => `<@${w}>`).join(', ') : 'No valid entries.';

      await interaction.reply({ content: `🎉 New winners for **${gw.prize}**: ${winnerMentions}!` });
    }
  },
};

async function pickWinners(msg, count, client) {
  await msg.reactions.cache.get(ENTER_EMOJI)?.users.fetch();
  const users = msg.reactions.cache.get(ENTER_EMOJI)?.users.cache
    .filter(u => !u.bot)
    .map(u => u.id) ?? [];

  const winners = [];
  const pool = [...users];
  while (winners.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    winners.push(pool.splice(idx, 1)[0]);
  }
  return winners;
}

async function endGiveaway(msg, client) {
  const giveaways = loadGiveaways();
  const gw = giveaways[msg.id];
  if (!gw || gw.ended) return;

  const winners = await pickWinners(msg, gw.winnerCount, client);
  const winnerMentions = winners.length ? winners.map(w => `<@${w}>`).join(', ') : 'No valid entries.';

  const endEmbed = new EmbedBuilder()
    .setColor(0x95a5a6)
    .setTitle(`🎉 GIVEAWAY ENDED — ${gw.prize}`)
    .setDescription(
      `**Prize:** ${gw.prize}\n` +
      `**Winner(s):** ${winnerMentions}\n` +
      `**Hosted by:** <@${gw.hostId}>`
    )
    .setTimestamp();

  await msg.edit({ embeds: [endEmbed] }).catch(() => {});
  if (winners.length) {
    await msg.channel.send(`🎉 Congratulations ${winnerMentions}! You won **${gw.prize}**!`);
  } else {
    await msg.channel.send(`No valid entries for **${gw.prize}**. Better luck next time!`);
  }

  giveaways[msg.id].ended = true;
  saveGiveaways(giveaways);
}
