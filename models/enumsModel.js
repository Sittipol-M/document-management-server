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

exports.getEnumsMongo = async ({ key }) => {
  if (!key) throw new Error("getEnumsMongo() -> `key` is required");
  if (!Array.isArray(key)) throw new Error("getEnumsMongo() -> `key` must be string array");

  const results = await Enum.find({ key: { $in: key } })
    .lean()
    .select("-_id");
  return results;
};
