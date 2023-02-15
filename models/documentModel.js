const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentSchema = new Schema({
  file: {
    type: String,
    unique: [true, "Duplicate `file`"],
    required: [true, "require `file`"],
  },
  searchWords: [{ type: String }],
  uploadedDate: {
    type: Date,
    default: Date.now,
    require: [true, "require `uploadedDate`"],
  },
  category: {
    type: String,
    require: [true, "require `category`"],
  },
  path: {
    type: String,
    require: [true, "require `path`"],
  },
});

const Document = mongoose.model("Document", documentSchema);
