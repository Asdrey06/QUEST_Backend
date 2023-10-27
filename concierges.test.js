const request = require('supertest');
const app = require('./app');



//*** SIGN IN ***
//Concierge inexistant
  it('POST /signin - Concierge inexistant ', async () => {
    const res = await request(app).post('/concierges/signinConcierge').send({
        email: 'test@test.com',
        password: 'mot de passe incorrect',
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe('Concierge not found or wrong password');
  });
  
  //Email invalide
  it('POST /signin - Email Concierge invalide', async () => {
    const res = await request(app).post('/concierges/signinConcierge').send({
        email: 'email invalide',
        password: 'mot de passe incorrect',
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe('Invalid email address');
  });
  
  //Champs manquants
  it('POST /signin - Champs Concierge manquants', async () => {
    const res = await request(app).post('/concierges/signinConcierge').send({});
    
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe('Missing or empty fields');
  });


  
//*** SIGN UP ***
//Email deja existante 
  it('POST /signup - Email Concierge deja existante', async () => {
    const res = await request(app).post('/concierges/signupConcierge').send({
        email: 'email deja existante',
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe('Missing or empty fields');
  });