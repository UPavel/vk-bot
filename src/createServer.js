import Server from './server';
import vk from './initialVK-IO';
import { subscribe } from './data';
import redis from './redis/redis';

const server = new Server();

server.post('/id', async (req, res) => {
  const { code } = JSON.parse(req.body);
  console.log(`code ${code}`);
  const id = await redis.getIdByCode(code);
  console.log(`id ${id}`);
  res.statusCode = 200;
  res.end(JSON.stringify({ id }));
});

server.post('/subscribe', (req, res) => {
  const { userId, data } = JSON.parse(req.body);
  if (data !== undefined) {
    console.log(data);
    vk.api.messages.send({
      user_id: 75461674,
      message: data,
    });
  }
  subscribe(userId, res);
  console.log(`subscribe ${userId}`);
});

server.post('/sendFile', (req, res) => {
  const result = JSON.parse(req.body);
  if (result.err) {
    const errors = {
      'requested file does not exist': 'файл по это указанному пути не существует\u{1F61E}',
    };

    const err = errors[result.err];
    vk.api.messages.send({
      user_id: 75461674,
      message: err,
    });
  } else {
    const { id: photoId, ownerId } = result;

    vk.api.messages.send({
      user_id: 75461674,
      attachment: `doc${ownerId}_${photoId}`,
    });
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ message: 'photos sent from bot to user' }));
});

export default server;
