const request = require("supertest");
const app = require("./app");

//*** REQUESTS POST***

// jest.setTimeout(30000); // Définir un délai d'attente de 30 secondes pour tous les tests de ce fichier

//saving request data
it("POST / should save a new request", async () => {
  const response = await request(app).post("/request/saveRequest").send({
    instruction: "Test ",
    paymentInfo: "Test",
    date: "2023-01-01",
    serviceFees: 100,
    productFees: 100,
    totalFees: 200,
  });
  expect(response.status).toBe(200);
  // expect(response.body.result).toBe(true);
  // console.log(response.body.result);
});

//Missing fields
it("POST /request - Missing fields", async () => {
  const response = await request(app).post("/request/emptyRequest").send({});

  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(false);
  expect(response.body.error).toBe("Champ non renseigne");

  // console.log(response.body);
});

//*** REQUESTS GET***
//get all requests
it("should get all requests", async () => {
  const response = await request(app).get("/request/requests");
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("allRequest");
  expect(Array.isArray(response.body.allRequest)).toBe(true);
  console.log(response.body);
});
