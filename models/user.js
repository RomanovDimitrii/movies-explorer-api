const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // импортируем bcrypt

const { AuthError } = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните поле "name"'],
    minlength: [2, 'Имя должно быть не менее двух символа'],
    maxlength: [30, 'Имя должно быть не более 30 символов'],
  },
  email: {
    type: String,
    required: [true, 'Заполните поле "email"'],
    unique: true,
    validate: {
      validator(v) {
        return /\w+@\w+\.\w+/.test(v);
      },
      message: (props) => `${props.value} некорректный email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // из-за запрета возврата хеш пароля
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
