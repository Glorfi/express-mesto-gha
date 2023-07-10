const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64a8cd357a5cd296d5bb4e8f',
  };

  next();
});
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
