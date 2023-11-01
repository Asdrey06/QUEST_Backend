const request = require("supertest");
const app = require("./app");
const bcrypt = require("bcrypt");
const { init } = require("./models/chat");

//*** SIGN IN ***

//POST - user does not exist
it("POST /signin - user does not exist ", async () => {
  const res = await request(app).post("/concierges/signinConcierge").send({
    email: "test@test.com",
    password: "mot de passe incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Compte non trouvé ou mot de passe invalide");
});

//POST - Invalid Email Address
it("POST /signin - POST - Invalid Email Address", async () => {
  const res = await request(app).post("/concierges/signinConcierge").send({
    email: "email invalide",
    password: "mot de passe incorrect",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Adresse e-mail invalide");
});

//POST - Missing or empty fields
it("POST /signin - Missing or empty fields", async () => {
  const response = await request(app)
    .post("/concierges/signinConcierge")
    .send({});

  expect(response.statusCode).toBe(200);
  expect(response.body.result).toBe(false);
  expect(response.body.error).toBe("Champs vides ou manquants");
});

//*** GET LIST ***

//Get CONCIERGES list
it("should return status 200 and a list of concierges", async () => {
  const response = await request(app).get("/concierges/conciergeList");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body.result)).toBe(true);
});
