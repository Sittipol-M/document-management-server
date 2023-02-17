const fs = require("fs");
const { ValidationError } = require("../errors/ValidationError");
const _ = require("lodash");

exports.saveDocumentsFiles = ({ documents, descriptions }) => {
  const writePath = process.env.DEFAULT_SAVE_PATH;

  let descriptionsWithPath = [];
  for (const description of descriptions) {
    const { name, category } = description;
    const { originalname, buffer } = _.find(documents, { originalname: name });
    const folderPath = `${writePath}${category}`;
    const filePath = `${folderPath}/${originalname}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(filePath, buffer);
    descriptionsWithPath.push({ ...description, path: filePath });
  }
  return descriptionsWithPath || [];
};
