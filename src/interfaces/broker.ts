export type newUserQueue = "New-User-Queue";
export type updateUserQueue = "Update-User-Queue";
export type loginUserQueue = "Login-User-Queue";
export type changeUserProfileQueue = "User-Change-Profile";
export type changeUserBackgroundQueue = "User-Change-Background";
export type changeUserInfoQueue = "User-Change-Info";

export type userQueueInput =
  | newUserQueue
  | updateUserQueue
  | loginUserQueue
  | changeUserProfileQueue
  | changeUserBackgroundQueue
  | changeUserInfoQueue;

export type userExchange = "User-Exchanges";
