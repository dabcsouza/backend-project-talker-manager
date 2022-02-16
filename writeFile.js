const fs = require('fs').promises;

const writeFile = async (addr, content) => {
  try {
    const data = JSON.stringify(content);
    await fs.writeFile(addr, data);
  } catch (e) {
    return new Error(e.message);
  } 
};

module.exports = writeFile;