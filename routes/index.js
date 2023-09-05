const router = require('express').Router();

const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { signUpValidator, signInValidator } = require('../utils/validators');
const userRouter = require('./users');
const moviesRouter = require('./movies');

router.post('/signin', signInValidator, login);

router.post('/signup', signUpValidator, createUser);

router.use('/users', userRouter);

router.use('/movies', moviesRouter);

router.post('/signout', auth, logout);

module.exports = router;
