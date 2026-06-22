const { EmbedBuilder } = require('discord.js');

const BRAND_COLOR = 0xc9a84c;   // gold — matches selfmade brand
const ERROR_COLOR  = 0xe74c3c;
const SUCCESS_COLOR = 0x2ecc71;
const INFO_COLOR   = 0x3498db;

const base = () => new EmbedBuilder().setTimestamp().setFooter({ text: 'SelfmadeR3ll' });

module.exports = {
  brand: (title, description) =>
    base().setColor(BRAND_COLOR).setTitle(title).setDescription(description),

  success: (title, description) =>
    base().setColor(SUCCESS_COLOR).setTitle(`✅ ${title}`).setDescription(description),

  error: (description) =>
    base().setColor(ERROR_COLOR).setTitle('❌ Error').setDescription(description),

  info: (title, description) =>
    base().setColor(INFO_COLOR).setTitle(title).setDescription(description),

  music: (title, description) =>
    base().setColor(BRAND_COLOR).setTitle(`🎵 ${title}`).setDescription(description),

  BRAND_COLOR,
};
