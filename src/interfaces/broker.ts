export type newUserQueue = "New-User-Queue";

export type updateUserQueue = "Update-User-Queue";

export type loginUserQueue = "Login-User-Queue";

export type changeUserProfileQueue = "User-Change-Profile";

export type userQueueInput =
  | newUserQueue
  | updateUserQueue
  | loginUserQueue
  | changeUserProfileQueue;

export type userExchange = "User-Exchanges";
