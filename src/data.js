const users = new Map();

export const subscribe = (userId, res) => users.set(userId, res);

export const getSubscribedUser = userId => users.get(userId);

export const unsubscribe = userId => users.delete(userId);
