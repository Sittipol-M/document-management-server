const { isEmptyArray } = require("../../helpers/array");

describe("Test array.js", () => {
  test("Test isEmptyArray()", () => {
    const emptyArray = [];
    const notEmptyArray = ["test"];
    const notArray = "notArray";
    expect(() => isEmptyArray(notArray)).toThrow(Error);
    expect(() => isEmptyArray({ array: notArray })).toThrow("isEmptyArray() -> `array` need type array");
    expect(isEmptyArray(notEmptyArray)).toBe(false);
    expect(isEmptyArray(emptyArray)).toBe(true);
  });
});
