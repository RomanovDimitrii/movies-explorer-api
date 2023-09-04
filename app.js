require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const routes = require('./routes/index');
const errorHandleMiddleware = require('./middlewares/errorHandleMiddleware');
const { notFoundErr } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADRESS } = require('./config');
const auth = require('./middlewares/auth');
const limiter = require('./utils/limiter');

mongoose.connect(DB_ADRESS, { // DB_ADRESS вместо 'mongodb://127.0.0.1:27017/mestodb'
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

const app = express();

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
    // 'http://dimitrii.movies.nomoredomainsicu.ru',
  //  'https://dimitrii.movies.nomoredomainsicu.ru',
  ],
  credentials: true,
  maxAge: 30,
}));

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.use(routes);

app.use('/*', auth, notFoundErr);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandleMiddleware);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT} `);
});
