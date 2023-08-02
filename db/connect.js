const pg = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'root',
    password : 'postgres123',
    database : 'test_app'
  }
});

module.exports = pg;