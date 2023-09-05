const { checkToken } = require('../utils/token');
const { AuthError } = require('../errors/AuthError');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    throw new AuthError('Необходима авторизация');
  }
  const token = req.cookies.jwt;

  const payload = checkToken(token);
  // console.log(payload);
  if (!payload) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
