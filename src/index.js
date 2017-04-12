import vk from './longPolling';
import server from './createServer';

vk.longpoll()
  .then(() => console.log('run longpoll'))
  .then(() => server.run(5000, 'localhost', () => console.log('server is running')))
  .catch(err => console.log(err));
