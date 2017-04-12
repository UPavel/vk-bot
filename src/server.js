

import http from 'http';
import url from 'url';

export default class {
  constructor() {
    this.server = http.createServer(this.requestListener.bind(this));
    this.getReqs = new Map();
    this.postReqs = new Map();
  }

  async requestListener(req, res) {
    const method = req.method.toLowerCase();
    if (method === 'post') {
      req.body = await this.readBody(req);
    }

    const { pathname } = url.parse(req.url);
    this.router(method, pathname, req, res);
  }

  router(method, pathname, req, res) {
    this[`${method}Reqs`].get(pathname)(req, res);
  }

  readBody(req) {
    return new Promise((resolve, reject) => {
      const body = [];
      req
        .on('data', chunk => body.push(chunk))
        .on('end', () => resolve(Buffer.concat(body).toString()))
        .on('error', error => reject(error));
    });
  }

  get(path, callback) {
    this.getReqs.set(path, callback);
  }

  post(path, callback) {
    this.postReqs.set(path, callback);
  }

  run(port, hostName, callback) {
    this.server.listen(port, hostName, callback);
  }
}
