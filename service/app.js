const http = require('http');
const qs = require('querystring');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const [path, query] = url.split('?');
  const options = {
    code: 200,
    msg: '成功',
    ...qs.parse(query)
  };
  // console.log(method, url, path);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(options));
});

server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
