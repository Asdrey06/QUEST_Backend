const request = require("supertest");
const app = require("./app");

//Utilisateur inexistant
it("POST /signin - Utilisateur inexistant ", async () => {
  const res = await request(app).post("/users/signin").send({
    email: "test@test.com",
    password: "mot de passe incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("User not found or wrong password");
});

//Email invalide
it("POST /signin - Email invalide", async () => {
  const res = await request(app).post("/users/signin").send({
    email: "email_invalide",
    password: "mot de passe incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Invalid email address");
});

//Champs manquants
it("POST /signin - Champs manquants", async () => {
  const res = await request(app).post("/users/signin").send({});

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Missing or empty fields");
});

//Email valide mais mot de passe incorrect
// it('POST /signin - Email valide mais mot incorrect', async () => {
//   const res = await request(app).post('/users/signin').send({
//    email: 'test@test.com',
//    password: 'mot de passe incorrect',
//   });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.result).toBe(false)
//   expect(res.body.error).toBe('Invalid password')
// });

it("POST /signUp - Email non conforme", async () => {
  const res = await request(app).post("/users/signUp").send({
    email: "emai_invalide",
    password: "password incorrect",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("email not suitable");
});

it("POST /signUp - Mot de passe non conforme", async () => {
  const res = await request(app).post("/users/signUp").send({
    email: "email valide",
    password: "password not suitable",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("password Invalid");
});
