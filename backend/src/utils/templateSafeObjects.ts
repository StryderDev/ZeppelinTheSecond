import {
  Emoji,
  Guild,
  GuildChannel,
  GuildMember,
  PartialGuildMember,
  Role,
  Snowflake,
  StageInstance,
  Sticker,
  ThreadChannel,
  User,
} from "discord.js";
import { UnknownUser } from "src/utils";
import { GuildPluginData } from "knub";
import { TemplateSafeValueContainer, TypedTemplateSafeValueContainer } from "../templateFormatter";
import {
  ISavedMessageAttachmentData,
  ISavedMessageData,
  ISavedMessageEmbedData,
  ISavedMessageStickerData,
  SavedMessage,
} from "../data/entities/SavedMessage";
import { Case } from "../data/entities/Case";

type Props<T> = {
  [K in keyof T]: T[K];
};

export class TemplateSafeGuild extends TemplateSafeValueContainer {
  id: Snowflake;
  name: string;

  constructor(data: Props<TemplateSafeGuild>) {
    super(data);
  }
}

export class TemplateSafeUser extends TemplateSafeValueContainer {
  id: Snowflake | string;
  username: string;
  discriminator: string;
  mention: string;
  tag: string;
  avatarURL?: string;
  bot?: boolean;
  createdAt?: number;

  constructor(data: Props<TemplateSafeUser>) {
    super(data);
  }
}

export class TemplateSafeUnknownUser extends TemplateSafeValueContainer {
  id: Snowflake;
  username: string;
  discriminator: string;

  constructor(data: Props<TemplateSafeUnknownUser>) {
    super(data);
  }
}

export class TemplateSafeRole extends TemplateSafeValueContainer {
  id: Snowflake;
  name: string;
  createdAt: number;
  hexColor: string;
  hoist: boolean;

  constructor(data: Props<TemplateSafeRole>) {
    super(data);
  }
}

export class TemplateSafeMember extends TemplateSafeUser {
  user: TemplateSafeUser;
  nick: string;
  roles: TemplateSafeRole[];
  joinedAt?: number;
  // guildAvatarURL: string, Once DJS supports per-server avatars
  guildName: string;

  constructor(data: Props<TemplateSafeMember>) {
    super(data);
  }
}

export class TemplateSafeUnknownMember extends TemplateSafeUnknownUser {
  user: TemplateSafeUnknownUser;

  constructor(data: Props<TemplateSafeUnknownMember>) {
    super(data);
  }
}

export class TemplateSafeChannel extends TemplateSafeValueContainer {
  id: Snowflake;
  name: string;
  mention: string;
  parentId?: Snowflake;

  constructor(data: Props<TemplateSafeChannel>) {
    super(data);
  }
}

export class TemplateSafeStage extends TemplateSafeValueContainer {
  channelId: Snowflake;
  channelMention: string;
  createdAt: number;
  discoverable: boolean;
  topic: string;

  constructor(data: Props<TemplateSafeStage>) {
    super(data);
  }
}

export class TemplateSafeEmoji extends TemplateSafeValueContainer {
  id: Snowflake;
  name: string;
  createdAt?: number;
  animated: boolean;
  identifier: string;
  mention: string;

  constructor(data: Props<TemplateSafeEmoji>) {
    super(data);
  }
}

export class TemplateSafeSticker extends TemplateSafeValueContainer {
  id: Snowflake;
  guildId?: Snowflake;
  packId?: Snowflake;
  name: string;
  description: string;
  tags: string;
  format: string;
  animated: boolean;
  url: string;

  constructor(data: Props<TemplateSafeSticker>) {
    super(data);
  }
}

export class TemplateSafeSavedMessage extends TemplateSafeValueContainer {
  id: string;
  guild_id: string;
  channel_id: string;
  user_id: string;
  is_bot: boolean;
  data: TemplateSafeSavedMessageData;

  constructor(data: Props<TemplateSafeSavedMessage>) {
    super(data);
  }
}

export class TemplateSafeSavedMessageData extends TemplateSafeValueContainer {
  attachments?: Array<TypedTemplateSafeValueContainer<ISavedMessageAttachmentData>>;
  author: TypedTemplateSafeValueContainer<{
    username: string;
    discriminator: string;
  }>;
  content: string;
  embeds?: Array<TypedTemplateSafeValueContainer<ISavedMessageEmbedData>>;
  stickers?: Array<TypedTemplateSafeValueContainer<ISavedMessageStickerData>>;
  timestamp: number;

  constructor(data: Props<TemplateSafeSavedMessageData>) {
    super(data);
  }
}

export class TemplateSafeCase extends TemplateSafeValueContainer {
  id: number;
  guild_id: string;
  case_number: number;
  user_id: string;
  user_name: string;
  mod_id: string | null;
  mod_name: string | null;
  type: number;
  audit_log_id: string | null;
  created_at: string;
  is_hidden: boolean;
  pp_id: string | null;
  pp_name: string | null;
  log_message_id: string | null;

  constructor(data: Props<TemplateSafeCase>) {
    super(data);
  }
}

// ===================
// CONVERTER FUNCTIONS
// ===================

export function guildToTemplateSafeGuild(guild: Guild): TemplateSafeGuild {
  return new TemplateSafeGuild({
    id: guild.id,
    name: guild.name,
  });
}

export function userToTemplateSafeUser(user: User | UnknownUser): TemplateSafeUser {
  if (user instanceof UnknownUser) {
    return new TemplateSafeUser({
      id: user.id,
      username: "Unknown",
      discriminator: "0000",
      mention: `<@${user.id}>`,
      tag: "Unknown#0000",
    });
  }

  return new TemplateSafeUser({
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
    mention: `<@${user.id}>`,
    tag: user.tag,
    avatarURL: user.displayAvatarURL({ dynamic: true }),
    bot: user.bot,
    createdAt: user.createdTimestamp,
  });
}

export function roleToTemplateSafeRole(role: Role): TemplateSafeRole {
  return new TemplateSafeRole({
    id: role.id,
    name: role.name,
    createdAt: role.createdTimestamp,
    hexColor: role.hexColor,
    hoist: role.hoist,
  });
}

export function memberToTemplateSafeMember(member: GuildMember | PartialGuildMember): TemplateSafeMember {
  const templateSafeUser = userToTemplateSafeUser(member.user!);

  return new TemplateSafeMember({
    ...templateSafeUser,
    user: templateSafeUser,
    nick: member.nickname ?? "*None*",
    roles: [...member.roles.cache.mapValues(r => roleToTemplateSafeRole(r)).values()],
    joinedAt: member.joinedTimestamp ?? undefined,
    guildName: member.guild.name,
  });
}

export function channelToTemplateSafeChannel(channel: GuildChannel | ThreadChannel): TemplateSafeChannel {
  return new TemplateSafeChannel({
    id: channel.id,
    name: channel.name,
    mention: `<#${channel.id}>`,
    parentId: channel.parentId ?? undefined,
  });
}

export function stageToTemplateSafeStage(stage: StageInstance): TemplateSafeStage {
  return new TemplateSafeStage({
    channelId: stage.channelId,
    channelMention: `<#${stage.channelId}>`,
    createdAt: stage.createdTimestamp,
    discoverable: !stage.discoverableDisabled,
    topic: stage.topic,
  });
}

export function emojiToTemplateSafeEmoji(emoji: Emoji): TemplateSafeEmoji {
  return new TemplateSafeEmoji({
    id: emoji.id!,
    name: emoji.name!,
    createdAt: emoji.createdTimestamp ?? undefined,
    animated: emoji.animated ?? false,
    identifier: emoji.identifier,
    mention: emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`,
  });
}

export function stickerToTemplateSafeSticker(sticker: Sticker): TemplateSafeSticker {
  return new TemplateSafeSticker({
    id: sticker.id,
    guildId: sticker.guildId ?? undefined,
    packId: sticker.packId ?? undefined,
    name: sticker.name,
    description: sticker.description ?? "",
    tags: sticker.tags?.join(", ") ?? "",
    format: sticker.format,
    animated: sticker.format === "PNG" ? false : true,
    url: sticker.url,
  });
}

export function savedMessageToTemplateSafeSavedMessage(savedMessage: SavedMessage): TemplateSafeSavedMessage {
  return new TemplateSafeSavedMessage({
    id: savedMessage.id,
    channel_id: savedMessage.channel_id,
    guild_id: savedMessage.guild_id,
    is_bot: savedMessage.is_bot,
    user_id: savedMessage.user_id,

    data: new TemplateSafeSavedMessageData({
      attachments: (savedMessage.data.attachments ?? []).map(
        att =>
          new TemplateSafeValueContainer({
            id: att.id,
            contentType: att.contentType,
            name: att.name,
            proxyURL: att.proxyURL,
            size: att.size,
            spoiler: att.spoiler,
            url: att.url,
            width: att.width,
          }) as TypedTemplateSafeValueContainer<ISavedMessageAttachmentData>,
      ),

      author: new TemplateSafeValueContainer({
        username: savedMessage.data.author.username,
        discriminator: savedMessage.data.author.discriminator,
      }) as TypedTemplateSafeValueContainer<ISavedMessageData["author"]>,

      content: savedMessage.data.content,

      embeds: (savedMessage.data.embeds ?? []).map(
        embed =>
          new TemplateSafeValueContainer({
            title: embed.title,
            description: embed.description,
            url: embed.url,
            timestamp: embed.timestamp,
            color: embed.color,

            fields: (embed.fields ?? []).map(
              field =>
                new TemplateSafeValueContainer({
                  name: field.name,
                  value: field.value,
                  inline: field.inline,
                }),
            ),

            author: embed.author
              ? new TemplateSafeValueContainer({
                  name: embed.author?.name,
                  url: embed.author?.url,
                  iconURL: embed.author?.iconURL,
                  proxyIconURL: embed.author?.proxyIconURL,
                })
              : undefined,

            thumbnail: embed.thumbnail
              ? new TemplateSafeValueContainer({
                  url: embed.thumbnail?.url,
                  proxyURL: embed.thumbnail?.url,
                  height: embed.thumbnail?.height,
                  width: embed.thumbnail?.width,
                })
              : undefined,

            image: embed.image
              ? new TemplateSafeValueContainer({
                  url: embed.image?.url,
                  proxyURL: embed.image?.url,
                  height: embed.image?.height,
                  width: embed.image?.width,
                })
              : undefined,

            video: embed.video
              ? new TemplateSafeValueContainer({
                  url: embed.video?.url,
                  proxyURL: embed.video?.url,
                  height: embed.video?.height,
                  width: embed.video?.width,
                })
              : undefined,

            footer: embed.footer
              ? new TemplateSafeValueContainer({
                  text: embed.footer.text,
                  iconURL: embed.footer.iconURL,
                  proxyIconURL: embed.footer.proxyIconURL,
                })
              : undefined,
          }) as TypedTemplateSafeValueContainer<ISavedMessageEmbedData>,
      ),

      stickers: (savedMessage.data.stickers ?? []).map(
        sticker =>
          new TemplateSafeValueContainer({
            format: sticker.format,
            guildId: sticker.guildId,
            id: sticker.id,
            name: sticker.name,
            description: sticker.description,
            available: sticker.available,
            type: sticker.type,
          }) as TypedTemplateSafeValueContainer<ISavedMessageStickerData>,
      ),

      timestamp: savedMessage.data.timestamp,
    }),
  });
}

export function caseToTemplateSafeCase(theCase: Case): TemplateSafeCase {
  return new TemplateSafeCase({
    id: theCase.id,
    guild_id: theCase.guild_id,
    case_number: theCase.case_number,
    user_id: theCase.user_id,
    user_name: theCase.user_name,
    mod_id: theCase.mod_id,
    mod_name: theCase.mod_name,
    type: theCase.type,
    audit_log_id: theCase.audit_log_id,
    created_at: theCase.created_at,
    is_hidden: theCase.is_hidden,
    pp_id: theCase.pp_id,
    pp_name: theCase.pp_name,
    log_message_id: theCase.log_message_id,
  });
}

export function getTemplateSafeMemberLevel(pluginData: GuildPluginData<any>, member: TemplateSafeMember): number {
  if (member.id === pluginData.guild.ownerId) {
    return 99999;
  }

  const levels = pluginData.fullConfig.levels ?? {};
  for (const [id, level] of Object.entries(levels)) {
    if (member.id === id || member.roles?.find(r => r.id === id)) {
      return level as number;
    }
  }

  return 0;
}