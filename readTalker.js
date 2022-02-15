const fs = require('fs').promises;

const readFiles = async (addr) => {
  try {
    const data = await fs.readFile(addr, 'utf8');
    return data.length === 0 
    ? []
    : JSON.parse(data);
  } catch (e) {
    return new Error(e.message);
  } 
};

module.exports = readFiles;