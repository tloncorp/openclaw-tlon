// =============================================================================
// PUBLIC API - Core Client
// =============================================================================
export {
  poke,
  pokeNoun,
  scry,
  scryNoun,
  subscribe,
  subscribeOnce,
  unsubscribe,
  thread,
  request,
  client,
  getCurrentUserId,
  getCurrentUserIsHosted,
  configureClient,
  checkIsNodeBusy,
  BadResponseError,
  TimeoutError,
  type PokeParams,
  type NounPokeParams,
  type ClientParams,
} from './urbit';

// =============================================================================
// PUBLIC API - Initialization
// =============================================================================
export { getInitData, type InitData } from './initApi';

// =============================================================================
// PUBLIC API - Groups
// =============================================================================
export {
  // CRUD
  createGroup,
  getGroup,
  getGroups,
  updateGroupMeta,
  deleteGroup,
  updateGroupPrivacy,
  // Membership
  inviteGroupMembers,
  acceptGroupJoin,
  rejectGroupJoin,
  cancelGroupJoin,
  leaveGroup,
  requestGroupInvitation,
  rescindGroupInvitationRequest,
  kickUsersFromGroup,
  banUsersFromGroup,
  unbanUsersFromGroup,
  // Roles
  addGroupRole,
  updateGroupRole,
  deleteGroupRole,
  addMembersToRole,
  removeMembersFromRole,
  // Navigation
  addNavSection,
  updateNavSection,
  deleteNavSection,
  addChannelToNavSection,
  updateGroupNavigation,
  // Channels in groups
  addChannelToGroup,
  updateChannel,
  deleteChannel,
  // Queries
  getPinnedItems,
  pinItem,
  unpinItem,
  getGroupPreview,
  getChannelPreview,
  findGroupsHostedBy,
} from './groupsApi';

// =============================================================================
// PUBLIC API - Channels
// =============================================================================
export {
  createChannel,
  updateChannelMeta,
  setupChannelFromTemplate,
  createNewGroupDefaultChannel,
  joinChannel,
  leaveChannel,
  addChannelWriters,
  removeChannelWriters,
  searchChannel,
  getChannelHooksPreview,
  setOrder,
  subscribeToChannelsUpdates,
  type ChannelsUpdate,
  type ChannelInit,
} from './channelsApi';

// =============================================================================
// PUBLIC API - Posts & Messages
// =============================================================================
export {
  sendPost,
  sendReply,
  editPost,
  deletePost,
  deleteReply,
  hidePost,
  showPost,
  reportPost,
  addReaction,
  removeReaction,
  getChannelPosts,
  getInitialPosts,
  getLatestPosts,
  getChangedPosts,
  getPostWithReplies,
  getPostReference,
  getHiddenPosts,
  getHiddenDMPosts,
  toContentReference,
  type Cursor,
  type PostContent,
} from './postsApi';

// =============================================================================
// PUBLIC API - Direct Messages
// =============================================================================
export {
  markChatRead,
  createGroupDm,
  respondToDMInvite,
  updateDMMeta,
  type ChatEvent,
} from './chatApi';

// =============================================================================
// PUBLIC API - Contacts
// =============================================================================
export {
  getContacts,
  updateContactMetadata,
  removeContactSuggestion,
  addContactSuggestions,
  syncUserProfiles,
} from './contactsApi';

// =============================================================================
// PUBLIC API - Activity & Unreads
// =============================================================================
export {
  getGroupAndChannelUnreads,
  getThreadUnreadsByChannel,
  getVolumeSettings,
  getInitialActivity,
  getPagedActivityByBucket,
  subscribeToActivity,
  ACTIVITY_SOURCE_PAGESIZE,
} from './activityApi';

// =============================================================================
// PUBLIC API - Settings
// =============================================================================
export {
  getSettings,
  setSetting,
  subscribeToSettings,
  getAppInfo,
  type SettingsUpdate,
} from './settingsApi';

// =============================================================================
// PUBLIC API - Storage
// =============================================================================
export {
  getStorageConfiguration,
  getStorageCredentials,
  subscribeToStorageUpdates,
  uploadFile,
  type StorageUpdate,
  type UploadFileParams,
  type UploadResult,
} from './storageApi';

// =============================================================================
// PUBLIC API - Connection Status
// =============================================================================
export {
  getLastConnectionStatus,
  checkConnectionStatus,
  type ConnectionStatus,
  type ConnectionState,
} from './vitalsApi';

// =============================================================================
// PUBLIC API - Invites
// =============================================================================
export {
  createInviteLink,
  enableGroup,
  createPersonalInviteLink,
  checkExistingUserInviteLink,
} from './inviteApi';

// =============================================================================
// PUBLIC API - Attestations (Lanyard)
// =============================================================================
export {
  subscribeToLanyardUpdates,
  checkAttestedSignature,
  discoverContacts,
  type LanyardUpdate,
} from './lanyardApi';

// =============================================================================
// PUBLIC API - Link Metadata
// =============================================================================
export { getLinkMetadata, getFallbackLinkMetadata } from './metagrabApi';

// =============================================================================
// PUBLIC API - Changes (Sync)
// =============================================================================
export { fetchChangesSince } from './changesApi';

// =============================================================================
// PUBLIC API - Hosting
// =============================================================================
export {
  HostingError,
  getReservableShips,
  reserveShip,
  allocateReservedShip,
  getShipAccessCode,
  resumeShip,
  getShip,
  checkPhoneVerify,
  requestPhoneVerify,
  getHostingAvailability,
  getHostingHeartBeat,
} from './hostingApi';

// =============================================================================
// PUBLIC API - AI Summarization
// =============================================================================
export {
  summarizeMessage,
  type SummarizeMessageParams,
  type SummarizeMessageResponse,
} from './openRouterApi';

// =============================================================================
// PUBLIC API - Authentication
// =============================================================================
export { getLandscapeAuthCookie } from './landscapeApi';

// =============================================================================
// PUBLIC API - Upload Types
// =============================================================================
export type {
  RNFile,
  MessageAttachments,
  FileStoreFile,
  Upload,
  UploadParams,
  UploadedFile,
  UploadInfo,
  Uploader,
  FileStore,
  StorageService,
  StorageConfiguration,
  StorageCredentials,
  StorageState,
} from './upload';

// =============================================================================
// PUBLIC API - Channel Content Configuration
// =============================================================================
export {
  ChannelContentConfiguration,
  CollectionRendererId,
  DraftInputId,
  PostContentRendererId,
  allCollectionRenderers,
  allDraftInputs,
  allContentRenderers,
  StructuredChannelDescriptionPayload,
} from './channelContentConfig';

// =============================================================================
// UTILITIES
// =============================================================================
export {
  udToDate,
  isDmChannelId,
  isGroupDmChannelId,
  isGroupChannelId,
  getChannelIdType,
  isChannelId,
  getCanonicalPostId,
} from './apiUtils';

// =============================================================================
// SYSTEM CONTACTS (stub for web)
// =============================================================================
export { getSystemContacts } from './systemContactsApi';

// =============================================================================
// HARK (notification parsing)
// =============================================================================
export { getPostInfoFromWer } from './harkApi';
