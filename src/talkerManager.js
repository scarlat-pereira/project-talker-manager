const fs = require('fs').promises;
const path = require('path');

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

const getManagerById = async (id) => {
  const talkerManager = await getAllManager();
  return talkerManager.find((manager) => manager.id === id);
};

module.exports = {
  getAllManager,
  getManagerById,
};