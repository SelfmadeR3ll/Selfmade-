/**
 * SelfmadeR3ll Discord Server Setup
 *
 * Run once with:  npm run setup
 *
 * This script creates all roles, categories, channels, and
 * permissions for the SelfmadeR3ll brand server. It is safe
 * to re-run — it skips anything that already exists.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

const TOKEN   = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !GUILD_ID) {
  console.error('❌  DISCORD_TOKEN and GUILD_ID must be set in .env');
  process.exit(1);
}

// ─── Server Blueprint ─────────────────────────────────────────────────────────

const ROLES = [
  { name: 'Owner',       color: 0xc9a84c, hoist: true,  position: 10, permissions: [PermissionFlagsBits.Administrator] },
  { name: 'Admin',       color: 0xe74c3c, hoist: true,  position: 9,  permissions: [PermissionFlagsBits.Administrator] },
  { name: 'Moderator',   color: 0xe67e22, hoist: true,  position: 8,  permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages] },
  { name: 'VIP',         color: 0x9b59b6, hoist: true,  position: 7,  permissions: [] },
  { name: 'Supporter',   color: 0x3498db, hoist: true,  position: 6,  permissions: [] },
  { name: 'Member',      color: 0x2ecc71, hoist: false, position: 5,  permissions: [] },
  { name: 'New Member',  color: 0x95a5a6, hoist: false, position: 4,  permissions: [] },
  { name: 'Muted',       color: 0x636e72, hoist: false, position: 3,  permissions: [] },
];

// Categories and their channels.
// Channels with `readOnly: true` deny @everyone from sending.
// Channels with `staffOnly: true` deny @everyone from viewing.
const STRUCTURE = [
  {
    name: '📌 INFORMATION',
    channels: [
      { name: '📜│rules',         readOnly: true  },
      { name: '📢│announcements', readOnly: true  },
      { name: '🎭│roles',         readOnly: true  },
      { name: '📋│welcome',       readOnly: true  },
    ],
  },
  {
    name: '💬 COMMUNITY',
    channels: [
      { name: '💬│general'        },
      { name: '👋│introductions'  },
      { name: '😂│off-topic'      },
      { name: '📸│media'          },
    ],
  },
  {
    name: '🎨 THE BRAND',
    channels: [
      { name: '🎨│portfolio',          readOnly: true  },
      { name: '🔥│drops',              readOnly: true  },
      { name: '🎬│behind-the-scenes'              },
      { name: '🤝│collabs'                        },
    ],
  },
  {
    name: '💼 NETWORKING',
    channels: [
      { name: '💼│opportunities'     },
      { name: '🔍│find-talent'       },
      { name: '💡│ideas'             },
    ],
  },
  {
    name: '🎵 MUSIC & VIBES',
    channels: [
      { name: '🎵│music-commands'                          },
      { name: '🔊 Lounge',         type: ChannelType.GuildVoice  },
      { name: '🔊 Music Room',     type: ChannelType.GuildVoice  },
      { name: '🔊 Private',        type: ChannelType.GuildVoice  },
    ],
  },
  {
    name: '🛡️ STAFF ONLY',
    staffOnly: true,
    channels: [
      { name: '📝│mod-log',      readOnly: true, staffOnly: true },
      { name: '💬│staff-chat',                    staffOnly: true },
      { name: '🤖│bot-testing',                   staffOnly: true },
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`\n🤖  Logged in as ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('❌  Guild not found. Check your GUILD_ID in .env');
    process.exit(1);
  }

  console.log(`\n📋  Setting up: ${guild.name}\n`);

  // ── Roles ─────────────────────────────────────────────────────────────────
  console.log('Creating roles...');
  const roleMap = {};
  for (const roleDef of ROLES) {
    let role = guild.roles.cache.find(r => r.name === roleDef.name);
    if (!role) {
      role = await guild.roles.create({
        name: roleDef.name,
        color: roleDef.color,
        hoist: roleDef.hoist,
        permissions: roleDef.permissions,
        reason: 'SelfmadeR3ll server setup',
      });
      console.log(`  ✅  Created role: ${role.name}`);
    } else {
      console.log(`  ⏩  Skipped (exists): ${role.name}`);
    }
    roleMap[roleDef.name] = role;
  }

  const everyoneRole = guild.roles.everyone;
  const staffRoles   = [roleMap['Owner'], roleMap['Admin'], roleMap['Moderator']].filter(Boolean);
  const mutedRole    = roleMap['Muted'];

  // ── Categories & Channels ─────────────────────────────────────────────────
  console.log('\nCreating channels...');
  const channelIds = {};

  for (const cat of STRUCTURE) {
    // Find or create category
    let category = guild.channels.cache.find(
      c => c.type === ChannelType.GuildCategory && c.name === cat.name
    );

    const categoryPerms = cat.staffOnly
      ? [
          { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...staffRoles.map(r => ({ id: r.id, allow: [PermissionFlagsBits.ViewChannel] })),
        ]
      : [];

    if (!category) {
      category = await guild.channels.create({
        name: cat.name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: categoryPerms,
        reason: 'SelfmadeR3ll server setup',
      });
      console.log(`  📁  Created category: ${cat.name}`);
    } else {
      console.log(`  ⏩  Skipped category: ${cat.name}`);
    }

    for (const ch of cat.channels) {
      const channelType = ch.type ?? ChannelType.GuildText;
      const chName = ch.name;

      let existing = guild.channels.cache.find(
        c => c.parentId === category.id && c.name === chName.toLowerCase().replace(/[│ ]/g, '-').replace(/[^a-z0-9-🎵🔊📸📜📢📋💬👋😂🎨🔥🎬🤝💼🔍💡📝🤖]/g, '')
      );

      if (!existing) {
        const permOverwrites = [];

        if (ch.staffOnly) {
          permOverwrites.push({ id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] });
          staffRoles.forEach(r => permOverwrites.push({ id: r.id, allow: [PermissionFlagsBits.ViewChannel] }));
        }

        if (ch.readOnly && !ch.staffOnly) {
          permOverwrites.push({ id: everyoneRole.id, deny: [PermissionFlagsBits.SendMessages] });
        }

        if (mutedRole) {
          permOverwrites.push({
            id: mutedRole.id,
            deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.Speak],
          });
        }

        existing = await guild.channels.create({
          name: chName,
          type: channelType,
          parent: category.id,
          permissionOverwrites: permOverwrites,
          reason: 'SelfmadeR3ll server setup',
        });
        console.log(`    ✅  #${chName}`);
      } else {
        console.log(`    ⏩  #${chName} (exists)`);
      }

      // Track key channels
      const cleanName = chName.toLowerCase();
      if (cleanName.includes('welcome'))         channelIds.WELCOME_CHANNEL_ID = existing.id;
      if (cleanName.includes('mod-log'))         channelIds.LOG_CHANNEL_ID = existing.id;
      if (cleanName.includes('music-commands'))  channelIds.MUSIC_CHANNEL_ID = existing.id;
    }
  }

  channelIds.NEW_MEMBER_ROLE_ID = roleMap['New Member']?.id ?? '';
  channelIds.MEMBER_ROLE_ID     = roleMap['Member']?.id ?? '';
  channelIds.MUTED_ROLE_ID      = mutedRole?.id ?? '';

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n✅  Server setup complete!\n');
  console.log('─── Add these to your .env ──────────────────────────────');
  for (const [key, val] of Object.entries(channelIds)) {
    if (val) console.log(`${key}=${val}`);
  }
  console.log('─────────────────────────────────────────────────────────\n');
  console.log('Next steps:');
  console.log('  1. Copy the IDs above into your .env file');
  console.log('  2. Run: npm run deploy   (registers slash commands)');
  console.log('  3. Run: npm start        (starts the bot)\n');

  client.destroy();
  process.exit(0);
});

client.login(TOKEN);
