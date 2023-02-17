const { isEmptyArray } = require("./array");

exports.isInEnum = ({ checkEnum, enums }) => {
  if (!Array.isArray(enums)) throw new Error("isInEnum() -> `enums` need type array");
  if (isEmptyArray(enums)) throw new Error("isInEnum() -> `enums` don't need empty array");
  if (typeof checkEnum !== "string") throw new Error("isInEnum() -> `checkEnum` need type string");

  for (const en of enums) if (checkEnum === en) return true;
  return false;
};
