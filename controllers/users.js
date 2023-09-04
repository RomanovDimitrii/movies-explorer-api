const bcrypt = require('bcrypt'); // импортируем bcryptquest

const User = require('../models/user');
const { generateToken } = require('../utils/token');
// const { AuthError } = require('../errors/AuthError');
const { NotFoundError } = require('../errors/NotFoundError');

function getUserProfile(req, res, next) {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(201).send({
          name,
          email,
          //    password: hash,
          _id: user._id,
        });
      })
      .catch(next);
  });
}

function changeProfile(req, res, next) {
  const { name, email } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он не будет создан
    },
  )
    .then((user) => res.status(200).send(user))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res
        .cookie('jwt', token, {
          //     maxAge: 3600000,
          httpOnly: true,
        })
        .send({ message: 'авторизация прошла успешно' });
    })
    .catch(next);
}

function logout(req, res, next) {
  res.clearCookie('jwt')
    .send({ message: 'токен удален из cookies' })

    .catch(next);
}

module.exports = {
  createUser,
  changeProfile,
  login,
  getUserProfile,
  logout,
};
