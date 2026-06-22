require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

// ─── Commands ────────────────────────────────────────────────────────────────
client.commands = new Collection();

const commandDirs = ['moderation', 'music', 'fun', 'utility'];
for (const dir of commandDirs) {
  const dirPath = path.join(__dirname, 'commands', dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(dirPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ─── Music Player ─────────────────────────────────────────────────────────────
const player = new Player(client);
player.extractors.loadMulti(DefaultExtractors).then(() => {
  logger.success(`Loaded ${player.extractors.store.size} audio extractors`);
});

player.events.on('playerStart', (queue, track) => {
  const embed = require('./utils/embeds').music(
    'Now Playing',
    `**[${track.title}](${track.url})**\nby ${track.author} · ${track.duration}`
  ).setThumbnail(track.thumbnail);
  queue.metadata?.channel?.send({ embeds: [embed] }).catch(() => {});
});

player.events.on('disconnect', (queue) => {
  queue.metadata?.channel?.send('Disconnected from voice. Queue cleared.').catch(() => {});
});

player.events.on('error', (queue, err) => {
  logger.error(`Player error: ${err.message}`);
  queue.metadata?.channel?.send(`Music error: ${err.message}`).catch(() => {});
});

client.login(process.env.DISCORD_TOKEN);
