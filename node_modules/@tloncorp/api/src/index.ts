// =============================================================================
// @tloncorp/api - Standalone Urbit API Client
// =============================================================================

// Re-export all public API functions
export * from './api';

// Re-export HTTP client
export { Urbit, AuthError } from './http-api';
export type { ChannelStatus, Poke, Scry, PokeHandlers } from './http-api';

// Re-export logging utilities
export { createDevLogger, type Logger } from './debug';

// =============================================================================
// Database Types (Core data models)
// =============================================================================
export type {
  // Core entities
  Contact,
  Group,
  Channel,
  Post,
  Settings,
  Pin,
  Reaction,
  ActivityEvent,
  ChatMember,
  GroupRole,

  // Enums/Unions
  ChannelType,
  PostType,
  PostDeliveryStatus,
  PinType,
  GroupPrivacy,
  GroupJoinStatus,
  ActivityBucket,

  // Unreads
  ChannelUnread,
  ThreadUnreadState,
  GroupUnread,
  BaseUnread,

  // Metadata
  ClientMeta,
  PostMetadata,
  PostFlags,
  ReplyMeta,

  // Group structures
  GroupNavSection,
  GroupFlaggedPosts,
  GroupMemberInvite,
  GroupMemberBan,
  GroupJoinRequest,

  // Volume/Settings
  VolumeSettings,

  // Chat
  Chat,
  GroupedChats,

  // App info
  AppInfo,

  // Init
  ActivityInit,
  ChangesResult,
} from './db';

// DB constants
export { SETTINGS_SINGLETON_KEY, BASE_UNREADS_SINGLETON_KEY } from './db';

// =============================================================================
// Domain Types
// =============================================================================
export type {
  // Attachments
  Attachment,
  FinalizedAttachment,
  LinkAttachment,
  ImageAttachment,
  FileAttachment,
  TextAttachment,
  ReferenceAttachment,
  LinkMetadata,
  PageMetadata,
  FileMetadata,
} from './domain/attachment';

export { Attachment as AttachmentUtils } from './domain/attachment';

export type { UploadState } from './domain/uploads';

// Constants configuration
export { getConstants, configureConstants, isOpenRouterConfigured } from './domain/constants';
export type { Constants } from './domain/constants';

export type {
  ContentReference,
  ChannelReference,
  GroupReference,
  AppReference,
} from './domain/references';

// =============================================================================
// Urbit Protocol Types (for advanced usage)
// =============================================================================
export type {
  // Content
  Inline,
  Block,
  Story,
  Verse,
  Cite,

  // Messages
  Writ,
  WritEssay,
  Post as UrbitPost,
  Reply,
  Memo,

  // Groups
  Group as UrbitGroup,
  Cordon,
  GroupMeta,

  // Contacts
  Contact as UrbitContact,
  ContactRolodex,

  // Activity
  NotificationLevel,
  Volume,
  Source,
} from './urbit';

// Urbit utility functions
export {
  preSig,
  desig,
  checkNest,
  nestToFlag,
  getChannelType,
  getTextContent,
  whomIsDm,
  whomIsMultiDm,
} from './urbit';
