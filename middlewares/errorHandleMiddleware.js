const {
  ERROR_BAD_REQUEST,
  ERROR_EMAIL,
  ERROR_INTERNAL_SERVER,
  ERROR_NOT_FOUND,
  ERROR_UNALLOWED_ACTION,
  ERROR_AUTIFICATION,
} = require('../errors/errors');

module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(ERROR_EMAIL).send({
      message: 'Данный email уже зарегистрирован',
    });
  }

  if (err.name === 'UnallowedActionError') {
    return res.status(ERROR_UNALLOWED_ACTION).send({
      message: 'Нет прав на действие',
    });
  }

  if (err.name === 'authError') {
    return res.status(ERROR_AUTIFICATION).send({
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(ERROR_BAD_REQUEST).send({
      message:
        'Переданы некорректные данные в методы создания фильма, обновления профиля пользователя',
    });
  }

  if (err.name === 'badRequestError') {
    return res.status(ERROR_BAD_REQUEST).send({
      message: 'Ошибка запроса',
    });
  }

  if (err.name === 'CastError') {
    return res.status(ERROR_BAD_REQUEST).send({
      message: 'Невалидный запрос',
    });
  }

  if (err.name === 'notFoundError') {
    return res.status(ERROR_NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err) {
    return res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return next(); // пропускаем запрос дальше
};
