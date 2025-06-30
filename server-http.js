```js
// server-http.js
const http = require('http');
const todos = [];
let nextId = 1;

const handlers = {
  GET: (req, res) => {
    if (req.url === '/todos') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(todos));
    } else {
      res.writeHead(404);
      res.end();
    }
  },
  POST: (req, res) => {
    if (req.url === '/todos') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { text } = JSON.parse(body);
        const todo = { id: nextId++, text, done: false };
        todos.push(todo);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todo));
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  }
};

const server = http.createServer((req, res) => {
  const method = handlers[req.method];
  if (method) method(req, res);
  else { res.writeHead(405); res.end(); }
});

server.listen(3000, () => console.log('HTTP server running at http://localhost:3000'));```
