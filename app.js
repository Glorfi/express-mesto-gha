const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true, //make this also true
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res, next) => {
  req.user = {
    _id: '64b5f08b31970ff788b38362',
  };

  next();
});
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

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
});

app.listen(PORT);
