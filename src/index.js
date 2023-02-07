const fs = require('fs').promises;
const path = require('path');

const managerPath = path.resolve(__dirname, './talker.json');

const express = require('express');
const {
validateToken,
validateName,
validateAge,
validateTalk,
validateRate } = require('./middlewares/talkerValidation');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

const { getAllManager, getManagerById, createTalkerManager } = require('./talkerManager');
const generateToken = require('./utils/generateToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/search', validateToken, async (req, res) => {
  const talkerManager = await getAllManager();
  try {
    const { q } = req.query;
    if (q) {
      const filteredManager = talkerManager.filter((e) => e.name.includes(q));
      return res.status(200).json(filteredManager);
    } if (!q) {
    res.status(200).send(talkerManager);
    }
    res.status(200).end();
  } catch (err) {
    res.status(200).send('error');
  }
});

app.get('/talker', async (_req, res) => {
  const talker = await getAllManager();
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkerManager = await getManagerById(Number(id));
  if (!talkerManager) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerManager);
});

app.post('/login', validatePassword, validateEmail, (req, res) => {
  const token = generateToken();
    return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
validateToken,
validateName,
validateAge,
validateTalk,
validateRate, 
async (req, res) => {
  const { name, age, talk } = req.body;
  const newTalkerManager = await createTalkerManager({ name, age, talk });
  res.status(201).send(newTalkerManager);
});

app.put('/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRate, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const { rate, watchedAt } = talk;
    const talkerManager = await getAllManager();
  const update = talkerManager.findIndex((e) => e.id === Number(id));
  talkerManager[update] = { id: Number(id), name, age, talk, watchedAt, rate };
  const updateManager = JSON.stringify(talkerManager, null, 2);
  await fs.writeFile(managerPath, updateManager);
  // const update = await updateManager(id, name, age, talk)
  // res.status(200).json(update);
  res.status(200).json(talkerManager[update]);
  });

  app.delete('/talker/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const talkerManager = await getAllManager();
    const removeTalker = talkerManager.filter((talker) => talker.id !== Number(id));
    const updateManager = JSON.stringify(removeTalker, null, 2);
    await fs.writeFile(managerPath, updateManager);
    res.status(204).end();
  });