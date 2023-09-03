const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const regUrl = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  }),
  //     .unknown(true),  //позволяет в запрос включать другие поля,помимо email и password
});

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
  //     .unknown(true),  //позволяет в запрос включать другие поля,помимо email и password
});

const changeProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regUrl).required(),
    trailerLink: Joi.string().regex(regUrl).required(),
    thumbnail: Joi.string().regex(regUrl).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const idValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId().required(),
  }),
});

module.exports = {
  signUpValidator,
  signInValidator,
  changeProfileValidator,
  createMovieValidator,
  idValidator,
};
