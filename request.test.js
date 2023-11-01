const request = require("supertest");
const app = require("./app");

//*** POST REQUESTS ***

// POST - saveRequest route with valid data
it("should successfully save a request", async () => {
  const requestData = {
    instruction: "Test Instruction",
    paymentInfo: "Credit Card",
    date: "2023-11-01",
    serviceFees: 10,
    productFees: 5,
    totalFees: 15,
    from: "John Doe",
    fromConcierge: "Jane Smith",
    photoConcierge:
      "https://res.cloudinary.com/deqst9w5e/image/upload/v1698766023/isxlg74l…",
    done: false,
    conciergeId: "65411ca190b3dcfe36903783",
    clientToken: "P4AGrGpS_YI5w3-fUGmpD1nRlU3eCCCY",
    objectId: "P4AGrGpS_YI5w3-fUGmpD1nRlU3eCCCG",
  };
  app.post("/request/saveRequest", async (req, res) => {
    try {
      const response = await request(app)
        .post("/request/saveRequest")
        .send(requestData);
      expect(response.status).toBe(200);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  });
});

//POST - Missing or invalid fields
it("POST /request - Missing or invalid fields", async () => {
  const response = await request(app).post("/request/emptyRequest").send({});

  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(false);
  expect(response.body.error).toBe("Champ non renseigné");
  // console.log(response.body);
});

//*** GET REQUESTS ***

//GET - All requests
it("should get all requests", async () => {
  const response = await request(app).get("/request/requests");
  console.log(request.data);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("allRequest");
  expect(Array.isArray(response.body.allRequest)).toBe(true);
  console.log(response.body);
});
