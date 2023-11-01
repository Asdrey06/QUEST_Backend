const request = require("supertest");
const app = require("./app");
const bcrypt = require("bcrypt");

//*** SIGN IN ***
describe("POST /signinConcierge", () => {
  // Test pour vérifier si la route renvoie une erreur lorsque des champs sont manquants
  it("should return an error when fields are missing", async () => {
    const response = await request(app)
      .post("/concierges/signinConcierge")
      .send({});

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(false);
    // expect(response.body.error).toBe("Champs vide ou manquants");
  });

  // Test pour vérifier si la route renvoie une erreur lorsque l'adresse e-mail est invalide
  it("should return an error for an invalid email address", async () => {
    const response = await request(app)
      .post("/concierges/signinConcierge")
      .send({ email: "invalid-email", password: "test1234" });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(false);
    // expect(response.body.error).toBe("Adresse e-mail invalide");
  });

  // Test pour vérifier si la route renvoie une erreur lorsque le compte n'est pas trouvé ou que le mot de passe est incorrect
  it("should return an error for an incorrect email or password", async () => {
    const response = await request(app)
      .post("/signinConcierge")
      .send({ email: "notfound@example.com", password: "incorrectpassword" });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe(
      "Compte non trouvé ou mot de passe invalide"
    );
  });

  // Test pour vérifier si la route renvoie un succès lorsqu'un utilisateur fournit des informations de connexion valides
  // Note: Avant ce test, vous devriez avoir un utilisateur concierge "test@example.com" avec un mot de passe "test1234" dans la base de données
  it("should return success for a valid email and password", async () => {
    const passwordHash = bcrypt.hashSync("test1234", 10);
    // Ici, ajoutez le concierge test à votre base de données avec le mot de passe haché
    // ...

    const response = await request(app)
      .post("/signinConcierge")
      .send({ email: "test@example.com", password: "test1234" });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(true);
    // expect(response.body).toHaveProperty("token");
    // expect(response.body).toHaveProperty("data");
    // Ici, supprimez le concierge test de votre base de données pour ne pas affecter les autres tests
    // ...
  });
});

// //Concierge inexistant
// it("POST /signin - Concierge inexistant ", async () => {
//   const res = await request(app).post("/concierges/signinConcierge").send({
//     email: "test@test.com",
//     password: "mot de passe incorrect",
//   });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.result).toBe(false);
//   // expect(res.body.error).toBe("Concierge not found or wrong password");
// });

// //Email invalide
// it("POST /signin - Email Concierge invalide", async () => {
//   const res = await request(app).post("/concierges/signinConcierge").send({
//     email: "email invalide",
//     password: "mot de passe incorrect",
//   });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.result).toBe(false);
//   // expect(res.body.error).toBe("Invalid email address");
// });

// //*** SIGN UP ***
// //Email deja existante
// it("POST /signup - Email Concierge deja existante", async () => {
//   const res = await request(app).post("/concierges/signupConcierge").send({
//     email: "email deja existante",
//   });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.result).toBe(false);
//   // expect(res.body.error).toBe("Missing or empty fields");
// });
// //Champs manquants
// it("POST /signin - Champs Concierge manquants", async () => {
//   const response = await request(app)
//     .post("/concierges/signinConcierge")
//     .send({});

//   expect(response.statusCode).toBe(200);
//   expect(response.body.result).toBe(false);
//   expect(response.body.error).toBe("Champs vide ou manquants");
// });

//route pour recuperer la liste de concierge
it("should return status 200 and a list of concierges", async () => {
  const response = await request(app).get("/conciergeList");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body.result)).toBe(true);
});
