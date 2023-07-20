const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const bodyParser = require('body-parser');
const { credentialsConfig } = require('./utils/validationConfig');

const app = express();

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  DuplicatedEmail,
  UserNotFound,
  WrongFormat,
} = require('./utils/errorsConfig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true, // make this also tru
});

app.post('/signin', celebrate(credentialsConfig), login);
app.post('/signup', celebrate(credentialsConfig), createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use((req, res, next) => {
  const err = new Error('NotFound');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json({ message: 'Неверный путь' });
  } else {
    next(err);
  }
  if (err instanceof DuplicatedEmail) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof UserNotFound) {
    res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    const e = new WrongFormat('Неверный формат идентификатора');
    res.status(e.statusCode).json({ message: e.message });
  }
  if (err.name === 'ValidationError') {
    const e = new WrongFormat('Неверный формат передаваемых данных');
    res.status(e.statusCode).json({ message: e.message });
  }
});

app.listen(PORT);
