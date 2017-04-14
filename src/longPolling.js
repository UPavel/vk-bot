import crypto from 'crypto';
import vk from './initialVK-IO';
import { getSubscribedUser, unsubscribe } from './data';
import redis from './redis/redis';

vk.on('message', async (message) => {
  const { user: id, text, flags: [, flag] } = message;

  if (flag === 'answered') {
    return;
  }

  console.log('message:');
  console.log(message);

  const isContainUser = await redis.containUser(id);
  if (!isContainUser) {
    console.log('user is not in the database');

    try {
      redis.addUser(id);
    } catch (err) {
      console.log('Error', err);
    }
  } else {
    console.log('user is in the database');
  }

  if (text === 'start') {
    message.send('Передите по ссылке, чтобы скачать программу:\nhttp://localhost:3000');
    const hash = crypto.createHmac('sha256', 'salt').update(new Date().toString()).digest('hex').slice(-4);
    await redis.addCodeAndId(hash, id.toString());
    console.log(`set code ${hash} ${id}`);
    message.send(`Ваш код: ${hash}`);
    return;
  }

  const isRequestFile = text.match(/скинь\s+файл\s+(.+)/i);
  console.log(isRequestFile);
  if (isRequestFile) {
    const fileName = isRequestFile[1];
    const res = getSubscribedUser(id.toString());
    unsubscribe(id.toString());
    res.statusCode = 200;
    res.end(JSON.stringify({ message: fileName }));
    return;
  }

  message.send('я не понимаю этой команды');
});

export default vk;
