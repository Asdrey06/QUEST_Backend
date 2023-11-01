const request = require("supertest");
const app = require("./app");

//*** SIGN IN ***

//POST - concierge does not exist
it("POST - signin -concierge does not exist ", async () => {
  const res = await request(app).post("/users/signin").send({
    email: "test@test.com",
    password: "mot de passe incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Compte non trouvé ou mot de passe invalide");
});

//POST - Invalid Email Address
it("POST /signin - Invalid Email Address", async () => {
  const res = await request(app).post("/users/signin").send({
    email: "email_invalide",
    password: "mot de passe incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Adresse e-mail invalide");
});

//POST - Missing or empty fields
it("POST /signin - Missing or empty fields", async () => {
  const res = await request(app).post("/users/signin").send({});
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Champs vides ou manquants");
});
