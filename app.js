const express = require("express");
const app = express();
require("dotenv").config();

//connect db
const { connectMongoDb } = require("./configs/databases");
connectMongoDb();

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//morgan
const morgan = require("morgan");
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

//routes
const documentRouter = require("./routes/documentRoutes");
app.use(documentRouter);

//error handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
