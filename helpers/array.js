exports.isEmptyArray = (array) => {
  if (!Array.isArray(array)) throw new Error("isEmptyArray() -> `array` need type array");
  if (!array || !array[0]) return true;
  return false;
};
