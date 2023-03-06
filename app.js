const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//connect db
const { connectMongoDb } = require("./configs/databases");
connectMongoDb();

//cors
app.use(cors());

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//morgan
const morgan = require("morgan");
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

//routes
const documentRouter = require("./routes/documentRoutes");
const enumRouter = require("./routes/enumsRoutes");
app.use(documentRouter);
app.use(enumRouter);

//error handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
