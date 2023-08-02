const { create, findOne } = require('./usersService');
const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const secret = 'demoapp';
const knex = require('knex');

const signup = async (req, res) => {
  // create new user
  const db = req.app.get('db');
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const user = await findOne(db, email);
    if (user.length > 0) {
      res.send('Email already exists.');
    }
    await create(db, email, hashedPassword);
    res.json({
      message: 'Success Sign Up.',
    });
  } catch (error) {
    res.send(error);
    return error;
  }
};

const verifyCredentials = async (password, hash) => {
  // const hash = await bcrypt.hash(password, saltRounds);
  if (password) {
    const validCredential = await bcrypt.compare(password, hash);
    return validCredential;
  } else {
    return false;
  }
};

const generateToken = (id) => {
  const token = jwt.sign(id, secret);
  return token;
};

const recordSignin = async (db, userId) => {
  // const isTableExists = await db.schema.hasTable('auth');
  await db('auth').update({
    id: uuid(),
    signin_date: db.fn.now(),
    signout_time: null,
    user_id: userId,
    signout: false,
    signin_time: null,
    token: generateToken(userId)
  })
}

const signin = async (req, res) => {
  const db = req.app.get('db');
  const { email, password } = req.body;
  try {
    const user = await findOne(db, email);
    const isUserExists = !!user.length;
    if (!isUserExists) {
      res.json({
        errorMessage: 'User does not exists.',
      });
    }
    const { id, password: storedPassword } = user[0]
    const isValidCredentials = await verifyCredentials(password, storedPassword) && isUserExists;

    if (isValidCredentials) {
      const token = generateToken(id);
      req.session.cookies = token;
      recordSignin(db, id);
      res.json({
        message: 'Login Successful.',
        user,
      });
    } else {
      res.json({
        message: 'Invalid Credentials.',
      });
    }
  } catch (error) {
    return error;
  }
};

const signout = async (req, res) => {
  const db = req.app.get('db');
  req.session.cookies = null;
  await db('auth').update('signout', true);
  res.send('Signed out.')
};

const getCurrentUser = async (db, id) => {
  try {
    const user = await findOne(db, '', id);
    const signOutStatus = await db('auth').where('user_id', id).select('signout');
    const isSignedout = signOutStatus[0].signout;
    if(user && !isSignedout) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};


module.exports = {
  signin,
  signup,
  signout,
  getCurrentUser
};
