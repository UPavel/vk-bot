import redis from './connectToRedis';

const containUser = id => redis.sismember('users', id);

const addUser = async (id) => {
  await redis.multi().sadd('users', id).hmset(`users:${id}`, { id }).exec();
  redis.bgsave();
};

const addCodeAndId = async (code, id) => {
  await redis.hmset('codes', { [code]: id });
  redis.bgsave();
};

const getIdByCode = async (code) => {
  const id = await redis.hmget('codes', code);
  redis.bgsave();
  return id[0];
};

export default {
  containUser,
  addUser,
  addCodeAndId,
  getIdByCode,
};
