const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const { getEnumsMongo } = require("../models/enumsModel");

exports.getCategoryEnums = tryCatchWrapper(async (req, res) => {
  const enums = await getEnumsMongo({ key: ["categoryEnums"] });
  const categoryEnums = enums.filter((eachEnum) => eachEnum.key === "categoryEnums")[0];
  res.send({ success: true, categoryEnums: categoryEnums.enums });
});
