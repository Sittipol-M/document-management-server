const { isEmptyArray } = require("./array");
const { isEnum } = require("./enum");
const { ValidationError } = require("./error");


exports.validateFields = ({ data, validationFields }) => {
  for (const eachData of data) {
    for (const field in validationFields) {
      const { isRequired, type, enums } = validationFields[field];
      if (isRequired && !eachData[field]) throw new ValidationError({ message: "The `" + field + "` is required." });
      switch (type) {
        case "string":
          if (typeof eachData[field] !== "string") throw new ValidationError({ message: "The `" + field + "` must be string." });
          break;
        case "enum":
          if (!isEnum({ data: eachData[field], enums }))
            throw new ValidationError({ message: "The `" + field + "` must in [" + enums.toString() + "]." });
          break;
        case "array":
          if (isEmptyArray(eachData[field])) throw new ValidationError({ message: "The data in array`" + field + "` is required." });
          if (!Array.isArray(eachData[field])) throw new ValidationError({ message: "The `" + field + "` must be string array." });
          break;
        default:
          break;
      }
    }
  }
};
