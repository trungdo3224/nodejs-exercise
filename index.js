const server = require('./server.js');

const port = 5000;

server.listen(port || 5000, () => {
  console.log(`Server is listening on port : ${port || 5000}`);
});
