const mongoose = require("mongoose");
const { Schema } = mongoose;

const enumsSchema = new Schema({
  key: {
    type: String,
    require,
  },
  enums: {
    type: Array,
  },
});

const Enum = mongoose.model("Enums", enumsSchema);
