const request = require("supertest");
const app = require("../../app");
const path = require("path");

describe("Test document routes POST /documents", () => {
  const trueDescriptions = [{ file: "testPdf.pdf", category: "bridge", searchWords: ["searchWord1", "searchWord2"] }];
  const wrongEnumCategoryDescriptions = [{ file: "testPdf.pdf", category: "bridgeWrong", searchWords: ["searchWord1", "searchWord2"] }];
  const wrongTypeFileDescriptions = [{ file: true, category: "bridge", searchWords: ["searchWord1", "searchWord2"] }];
  const wrongTypeCategoryDescriptions = [{ file: "testPdf.pdf", category: [], searchWords: ["searchWord1", "searchWord2"] }];
  const wrongTypeSearchWordsDescriptions = [{ file: "testPdf.pdf", category: "bridge", searchWords: "test" }];
  const wrongNotStringArraySearchWordsDescriptions = [{ file: "testPdf.pdf", category: "bridge", searchWords: [{ test: "test" }] }];
  const trueDocuments = [
    {
      fieldname: "testPdf",
      originalname: "testPdf.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
      size: 195878,
    },
  ];
  const wrongMemeTypeDocuments = [
    {
      fieldname: "testPdf",
      originalname: "testPdf.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
      size: 195878,
    },
  ];
  const wrongOriginalNameDocuments = [
    {
      fieldname: "testPdf",
      originalname: "testPdf.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
      size: 195878,
    },
  ];

  test("Test empty request body", async () => {
    const response = await request(app).post("/documents").send();
    expect(response.statusCode).toBe(400);
  });
  test("Test (empty documents) request body ", async () => {
    const response = await request(app).post("/documents").send({ description: trueDescriptions });
    expect(response.statusCode).toBe(400);
  });
  //   test("Test (empty descriptions) request body ", async () => {
  //     const response = await request(app).post("/documents").send({ documents: trueDocuments });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong mimetype documents) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: wrongMemeTypeDocuments, description: trueDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong originalname documents) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: wrongOriginalNameDocuments, description: trueDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong category descriptions) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: trueDocuments, description: wrongEnumCategoryDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong type file descriptions) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: trueDocuments, description: wrongTypeFileDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong type category descriptions) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: trueDocuments, description: wrongTypeCategoryDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong type searchWords descriptions) request body", async () => {
  //     const response = await request(app).post("/documents").send({ documents: trueDocuments, description: wrongTypeSearchWordsDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  //   test("Test (wrong type not string array searchWords descriptions) request body", async () => {
  //     const response = await request(app)
  //       .post("/documents")
  //       .send({ documents: trueDocuments, description: wrongNotStringArraySearchWordsDescriptions });
  //     expect(response.statusCode).toBe(400);
  //   });
  test("Test true request body", async () => {
    const documents = path.resolve(__dirname, "./testFiles/testPdf.pdf");
    const response = await request(app)
      .post("/documents")
      .set("Accept", "application/json")
      .field("descriptions[0].file", trueDescriptions[0].file)
      .field("descriptions[0].category", trueDescriptions[0].category)
      .field("trueDescriptions[0].searchWords[0]", trueDescriptions[0].searchWords)
      .attach("documents", documents);
    console.log(response.body.message, response.body.errors);
    expect(response.statusCode).toBe(400);
  });
});
