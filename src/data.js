const codes = new Map();
/*
codes.set('0fx4', '75461674');
*/

const users = new Map();
const subscribe = (userId, res) => users.set(userId, res);

export { codes, users, subscribe };
