const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnallowedActionError } = require('../errors/UnallowedAction');

function getMovies(req, res, next) {
  Movie.find()
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
}

function createMovie(req, res, next) { // надо ввести провкрку фильма по id
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
}

function deleteMovieById(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new UnallowedActionError('Нет прав на удаление фильма');
      }
      return Movie.deleteOne(movie).then(() => res.status(200).send(movie));
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
