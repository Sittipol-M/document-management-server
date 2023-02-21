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

exports.getEnums = async ({ key }) => {
  if (!key) throw new Error("getEnums() -> `key` is required");
  if (!Array.isArray(key)) throw new Error("getEnums() -> `key` must be string array");

  const results = await Enum.find({ key: { $in: key } })
    .lean()
    .select("-_id");
  return results;
};
