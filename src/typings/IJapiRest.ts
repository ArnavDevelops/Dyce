export interface JapiDiscordUserResponse {
  cache_expiry: number;
  cached: boolean;

  data: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: number | null;
    global_name: string | null;
    avatar_decoration_data: unknown | null;
    collectibles: unknown | null;
    display_name_styles: unknown | null;
    banner_color: string | null;

    clan?: {
      identity_guild_id: string;
      identity_enabled: boolean;
      tag: string;
      badge: string;
    };

    primary_guild?: {
      identity_guild_id: string;
      identity_enabled: boolean;
      tag: string;
      badge: string;
    };

    tag: string;
    createdAt: string;
    createdTimestamp: number;
    public_flags_array: string[];

    defaultAvatarURL: string;
    avatarURL: string;
    bannerURL: string;
  };

  presence: {
    error?: string;
  };

  connections: {
    error?: string;
  };
}