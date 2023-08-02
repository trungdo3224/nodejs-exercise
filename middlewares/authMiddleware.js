const { getCurrentUser } = require("../controllers/authController");
const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
  const db = req.app.get('db');
  const { cookies } = req.session;
  try {
    if(db && cookies) {
      const id = jwt.verify(cookies, 'demoapp');
      const user = await getCurrentUser(db, id);
      if(user) {
        res.json({
          user
        });
      } else {
        res.json({
          message: 'Unauthentication.',
        });
      }
      next();
    } else {
      res.json({
        message: 'Not signed in.',
      });
    }
  } catch (error) {
    res.send(error);
  }
  
};

module.exports = authenticationMiddleware;