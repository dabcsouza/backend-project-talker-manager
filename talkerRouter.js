const express = require('express');
const readFiles = require('./readTalker');
const writeFile = require('./writeFile');

const talkerRouter = express.Router();

const filePath = './talker.json';

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || authorization === '') {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });
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
  const { age } = req.body;
  if (!age || age === '' || typeof age !== 'number') {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  return parseInt(age, 10) < 18
   ? res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' })
   : next();
};

const validateObjTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || talk === '') {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  return next();
};

const validateObjKeys = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt, rate } = talk;
  if ((!rate && rate !== 0) || !watchedAt) {
    console.log(talk);
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  return next();
};

const validateObjTalkAux = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt, rate } = talk;
  if (rate === '' || watchedAt === '') {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  return next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  return (typeof rate !== 'number' || (rate < 1 || rate > 5))
    ? res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' })
    : next();
};

const validateWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;
  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  return !regexDate.test(watchedAt)
    ? res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' })
    : next();
};

const writeInJson = async (req, res) => {
  const talkerContent = await readFiles(filePath);
  const id = talkerContent.length + 1;
  const { name, age, talk } = req.body;
  talkerContent.push({ name, age, talk, id });
  writeFile(filePath, talkerContent);
  return res.status(201).json(talkerContent[id - 1]);
};

const editJson = async (req, res) => {
  const talkerContent = await readFiles(filePath);
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const NewTalkerContent = talkerContent.map(({ name: innerName,
    age: innerAge, talk: innerTalk, id: innerId }) => {
    if (innerId === Number(id)) {
      return { name, age, talk, id: innerId };
    }
    return { name: innerName, Age: innerAge, talk: innerTalk, id: innerId };
  });
  writeFile(filePath, NewTalkerContent);
  return res.status(200).json(NewTalkerContent.find((el) => el.id === Number(id)));
};

const HTTP_OK_STATUS = 200;

talkerRouter.get('/', async (_req, res) => {
  const talkerContent = await readFiles(filePath);
  return res.status(HTTP_OK_STATUS).json(talkerContent);
});

talkerRouter.get('/search', validateToken, async (req, res) => {
  const talkerContent = await readFiles(filePath);
  const { q } = req.query;
  return res.status(200).json(talkerContent.filter((talker) => talker.name.includes(q)));
});

talkerRouter.get('/:id', async (req, res) => {
  const talkerContent = await readFiles(filePath);
  const { id } = req.params;
  const arrayResponse = talkerContent
    .find((person) => person.id === Number(id));
  return !arrayResponse
  ? res.status(404).json({ message: 'Pessoa palestrante não encontrada' })
  : res.status(HTTP_OK_STATUS).json(arrayResponse);
});

talkerRouter.post('/', validateToken, validateName,
  validateAge, validateObjTalk, validateObjKeys,
  validateObjTalkAux, validateRate,
  validateWatchedAt, writeInJson);

talkerRouter.put('/:id', validateToken, validateName,
validateAge, validateObjTalk, validateObjKeys,
validateObjTalkAux, validateRate,
validateWatchedAt, editJson);

talkerRouter.delete('/:id', validateToken, async (req, res) => {
  const talkerContent = await readFiles(filePath);
  const { id } = req.params;
  const NewTalkerContent = talkerContent.filter((el) => el.id !== Number(id));
  writeFile(filePath, NewTalkerContent);
  return res.status(204).json();
});

module.exports = talkerRouter;