const express = require('express');
const bodyParser = require('body-parser');
const loginRouter = require('./loginRouter');
const talkerRouter = require('./talkerRouter');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/login', loginRouter);
app.use('/talker', talkerRouter);

app.listen(PORT, () => {
  console.log('Online');
});
