const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const {
  createMovieValidator,
  idValidator,
} = require('../utils/validators');

router.get('/', auth, getMovies);

router.post('/', auth, createMovieValidator, createMovie);

router.delete('/:movieId', auth, idValidator, deleteMovieById);

module.exports = router;
