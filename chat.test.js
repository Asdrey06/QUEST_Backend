const request = require('supertest');
const app = require('./app'); // Assurez-vous de remplacer 'votre_application_express' par le chemin correct vers votre application Express

describe('POST /savechat', () => {
    it('devrait sauvegarder un chat avec succès', async () => {
        const chatData = {
            date: 'jj',
            firstname: 'John',
            username: 'john_doe',
            message: 'Hello, world!',
        };

        const response = await request(app)
            .post('/savechat')
            .send(chatData)
            .expect(200);

        expect(response.body.result).toBe(true);
        expect(response.body.data.date).toBe(chatData.date);
        // Ajoutez d'autres assertions selon votre modèle de données
    });

    it('devrait gérer les erreurs lors de la sauvegarde', async () => {
        // Testez un scénario où la sauvegarde échoue
        const chatData = {
            // Données invalides ou manquantes
        };

        const response = await request(app)
            .post('/savechat')
            .send(chatData)
            .expect(500);

        expect(response.body.result).toBe(false);
        expect(response.body.error).toBeTruthy();
    });
});