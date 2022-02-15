const express = require('express');
const readFiles = require('./readTalker');
const writeFile = require('./writeFile');

const talkerRouter = express.Router();

const validateToken = (req, res, next) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  if (token.length !== 16) return res.status(401).json({ message: 'Token inválido' });
  return next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name || name === '') res.status(400).json({ message: 'O campo "name" é obrigatório' });

  return name.length < 3
    ? res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' })
    : next();
};

const validateAge = (req, res, next) => {
  const talkerContent = readFiles('./talker.json');
  const { age } = req.body;
  if (!age || age === '') return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  parseInt(age) < 18
   ? 
};

const HTTP_OK_STATUS = 200;

talkerRouter.get('/', async (_req, res) => {
  const talkerContent = await readFiles('./talker.json');
  return res.status(HTTP_OK_STATUS).json(talkerContent);
});

talkerRouter.get('/:id', async (req, res) => {
  const talkerContent = await readFiles('./talker.json');
  const { id } = req.params;
  const arrayResponse = talkerContent
    .find((person) => person.id === Number(id));
  return !arrayResponse
  ? res.status(404).json({ message: 'Pessoa palestrante não encontrada' })
  : res.status(HTTP_OK_STATUS).json(arrayResponse);
});

talkerRouter.post('/', validateToken, validateName,
  validateAge);

module.exports = talkerRouter;