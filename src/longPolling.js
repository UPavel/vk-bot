import crypto from 'crypto';
import vk from './initialVK-IO';
import { codes, users } from './data';
import redis from './redis/redis';

vk.on('message', async (message) => {
  const { user: id, text, flags: [, flag] } = message;
  /*
  if (id !== 75461674) {
    return;
  }
  */

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

  let file;
  if (text.includes('скинь') && text.includes('файл')) {
    ([,, file] = text.split(' '));
  } else {
    file = text;
  }

  if (text === 'код') {
    const hash = crypto.createHmac('sha256', 'salt').update(new Date().toString()).digest('hex').slice(-4);
    codes.set(hash, id.toString());
    console.log(codes);
    message.send(hash);
    return;
  }

  if (text === 'start') {
    message.send('Передите по ссылке, чтобы скачать программу:\nhttp://localhost:3000');

    const hash = crypto.createHmac('sha256', 'salt').update(new Date().toString()).digest('hex').slice(-4);
    // codes.set(hash, id.toString());
    // console.log(codes);

    await redis.addCodeAndId(hash, id.toString());
    console.log(`set code ${hash} ${id}`);

    message.send(`Ваш код: ${hash}`);
    return;
  }

  const res = users.get(id.toString());
  users.delete(id.toString());
  res.statusCode = 200;
  res.end(JSON.stringify({ message: file }));
});

export default vk;
