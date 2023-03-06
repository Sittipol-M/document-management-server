const request = require("supertest");
const app = require("../../app");
const path = require("path");

describe("Test document routes POST /documents", () => {
  const trueDocuments = path.resolve(__dirname, "./testFiles/testPdf.pdf");
  const falseDocuments = path.resolve(__dirname, "./testFiles/testPNG.png");
  const trueDescriptions = [{ file: "testPdf.pdf", category: "สะพาน", searchWords: ["searchWord1", "searchWord2"] }];
  const falseDescriptions = [{ file: true, category: "bridge", searchWords: ["searchWord1", "searchWord2"] }];
  test("Test documents-> true, descriptions-> true", async () => {
    const response = await request(app)
      .post("/documents")
      .attach("documents", trueDocuments)
      .field("descriptions[0][name]", trueDescriptions[0].file)
      .field("descriptions[0][category]", trueDescriptions[0].category)
      .field("descriptions[0][searchWords][0]", trueDescriptions[0].searchWords[0])
      .field("descriptions[0][searchWords][1]", trueDescriptions[0].searchWords[1]);
    console.log({ message: response.body.message, errors: response.body.errors });
    expect(response.statusCode).toBe(400);
  });
});
