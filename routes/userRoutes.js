const { 
  signup, 
  signin,
  signout
} = require('../services/auth.service');
const authenticationMiddleware = require('../middlewares/authMiddleware');

const userRouter = require('express').Router();

userRouter.post('/users/signup', signup);
userRouter.post('/users/signin', signin);
userRouter.get('/users', authenticationMiddleware);
userRouter.post('/users/signout', signout);

module.exports = userRouter;