const fs = require('fs').promises;
const path = require('path');
const { join } = require('path');

const managerPath = path.resolve(__dirname, './talker.json');

const getAllManager = async () => {
  try {
    const response = await fs.readFile(managerPath, 'utf-8');
    // console.log(response);
    const manager = JSON.parse(response);
    return manager;
  } catch (error) {
    return null;
  }
};

const writeTalkerManagerFile = async (talkerManager) => {
  try {
    await fs.writeFile(join(__dirname, './talker.json'), JSON.stringify(talkerManager));
  } catch (error) {
    return null;
  }
};

const getManagerById = async (id) => {
  const talkerManager = await getAllManager();
  return talkerManager.find((manager) => manager.id === id);
};

const createTalkerManager = async (talkerManagerRequest) => {
  const talkerManager = await getAllManager();
  const newTalkerManager = {
    id: talkerManager[talkerManager.length - 1].id + 1,
    ...talkerManagerRequest,
  };
  talkerManager.push(newTalkerManager);
  await writeTalkerManagerFile(talkerManager);

  return newTalkerManager;
};

// const updateTalkerManager = async (id, name, age, talk) => {
//   const talkerManager = await getAllManager();
//   const { rate, watchedAt } = talk;
//   const update = talkerManager.findIndex((e) => e.id === Number(id));
//   talkerManager[update] = { id: Number(id), name, age, talk, watchedAt, rate };
//   const updateManager = JSON.stringify(talkerManager, null, 2);
//   await fs.writeFile(managerPath, updateManager);
//   return talkerManager[update];
// };

module.exports = {
  writeTalkerManagerFile,
  getAllManager,
  getManagerById,
  createTalkerManager,
  // updateTalkerManager,
};