const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Заполните поле "страна"'],
  },
  director: {
    type: String,
    required: [true, 'Заполните поле "режиссер"'],
  },
  duration: {
    type: Number,
    required: [true, 'Заполните поле "продолжительность фильма"'],
  },
  year: {
    type: String,
    required: [true, 'Заполните поле "год выпуска"'],
  },
  description: {
    type: String,
    required: [true, 'Заполните поле "описание фильма"'],
  },
  image: {
    type: String,
    required: [true, 'Заполните поле "ссылка на постер к фильму"'],
  },
  trailerLink: {
    type: String,
    required: [true, 'Заполните поле "ссылка на трейлер к фильму"'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Заполните поле "миниатюрное изображение постера к фильму"'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: [true, 'Заполните поле "id номер фильма"'],
  },
  nameRU: {
    type: String,
    required: [true, 'Заполните поле "название фильма RU"'],
  },
  nameEN: {
    type: String,
    required: [true, 'Заполните поле "название фильма EN"'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
