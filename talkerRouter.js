const express = require('express');
const readFiles = require('./readTalker');

const talkerRouter = express.Router();

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

module.exports = talkerRouter;