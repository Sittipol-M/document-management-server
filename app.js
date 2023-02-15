const express = require("express");
const app = express();
require("dotenv").config();

//connect db
const { connectMongoDb } = require("./configs/databases");
connectMongoDb();

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//morgan
const morgan = require("morgan");
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

//routes

//error handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
