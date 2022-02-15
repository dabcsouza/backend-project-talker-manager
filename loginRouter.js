const express = require('express');

const loginRouter = express.Router();
const chainToken = require('./chainToken');

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regexValid = /\S+@\S+\.com/;
  if (!email || email.length === 0) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  return regexValid.test(email)
  ? next()
  : res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
};

const validatePasswd = (req, res, next) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  const pwdString = typeof password === 'number'
    ? Math.abs(password).toString(10)
    : password;
  return pwdString.length < 6
  ? res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' })
  : next();
};

const generateToken = (req, res) => {
  const token = Array(16).fill('')
    .map((_el) => chainToken[Math.floor(Math.random() * 61)])
    .join('');
  req.token = token;
  return res.status(200).json({ token });
};

loginRouter.post('/', validateEmail, validatePasswd, generateToken);

module.exports = loginRouter;