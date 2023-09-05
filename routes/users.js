const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  createUser,
  changeProfile,
  login,
  getUserProfile,
} = require('../controllers/users');

const {
  signUpValidator,
  signInValidator,
  changeProfileValidator,
} = require('../utils/validators');

router.post('/signup', signUpValidator, createUser);

router.post('/signin', signInValidator, login);

router.get('/me', auth, getUserProfile);

router.patch('/me', auth, changeProfileValidator, changeProfile);

// router.post('/signout', auth, logout);

module.exports = router;
