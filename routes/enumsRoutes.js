const express = require("express");
const { getCategoryEnums } = require("../controllers/enumsController");
const enumRouter = express.Router();

enumRouter.route("/enums/category-enums").get(getCategoryEnums);

module.exports = enumRouter;
