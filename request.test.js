const request = require("supertest");
const app = require("./app");

//*** REQUESTS POST***

//Missing fields
it("POST /request - Missing fields", async () => {
  const response = await request(app).post("/request/saveRequest").send({});

  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(false);
  expect(response.body.error).toBe("Missing or empty fields");

  console.log(response.body);
});

//saving request data
it("POST / should save a new request", async () => {
  const response = await request(app).post("/request/saveRequest").send({
    instruction: "Test instruction",
    paymentInfo: "Test payment info",
    date: "2023-01-01",
    serviceFees: 100,
    productFees: 50,
    totalFees: 150,
  });
  expect(response.status).toBe(201);
  // expect(response.body.result).toBe(true);
  console.log(response.body.result);
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
