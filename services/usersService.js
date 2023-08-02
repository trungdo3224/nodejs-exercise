const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');


const create = async (db, email, password) => {
  const isTableExists = await db.schema.hasTable('users');
  try {
    if(!isTableExists) {
      await db.schema.createTable('users', function(table) {
        table.string('id').primary();
        table.string('email').unique();
        table.string('password');
      });
    }
    await db
    .insert({
      id: uuid(),
      email: email,
      password: password,
    })
    .into('users')
  } catch (error) {
    return error;
  }
};

const findOne = async (db, email = '', id = '') => {
  try {
    const user = await db('users')
      .where({
        email,
      })
      .orWhere({
        id
      })
      .select('*')
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  findOne,
  create,
};
