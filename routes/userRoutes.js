const { 
  signup, 
  signin,
  signout
} = require('../controllers/authController');
const authenticationMiddleware = require('../middlewares/authMiddleware');

const userRouter = require('express').Router();

userRouter.post('/users/signup', signup);
userRouter.post('/users/signin', signin);
userRouter.get('/whoami', authenticationMiddleware);
userRouter.post('/users/signout', signout);

module.exports = userRouter;