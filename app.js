require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const errorHandleMiddleware = require('./middlewares/errorHandleMiddleware');
const { createUser, login } = require('./controllers/users');
const { signUpValidator, signInValidator } = require('./utils/validators');
const { notFoundErr } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADRESS } = require('./config');

mongoose.connect(DB_ADRESS, { // DB_ADRESS вместо 'mongodb://127.0.0.1:27017/mestodb'
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

// app.use(express.json()); // вместо bodyParser

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадет');
  }, 0);
});

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://localhost:3001',
  //  'http://dimitrii.mesto.nomoreparties.co',
    // 'https://dimitrii.mesto.nomoreparties.co',
  ],
  credentials: true,
  maxAge: 30,
}));

app.use(limiter);

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', signInValidator, login);

app.post('/signup', signUpValidator, createUser);

app.use('/users', userRouter);

app.use('/movies', moviesRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use('/*', notFoundErr);

app.use(errorHandleMiddleware);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT} `);
});
