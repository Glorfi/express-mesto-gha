const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const bodyParser = require('body-parser');
const { credentialsConfig } = require('./utils/validationConfig');

const app = express();

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.post('/signup', celebrate(credentialsConfig), createUser);
app.post('/signin', celebrate(credentialsConfig), login);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use(handleErrors);

app.listen(PORT);
