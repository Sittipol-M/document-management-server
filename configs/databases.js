exports.connectMongoDb = () => {
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONDODB_URL, () => {
    console.log("Connect mongodb successful.");
  });
};
