const request = require('supertest');
const app = require('../app'); // Assurez-vous que le chemin vers votre application Express est correct

describe('Chat API', () => {
  describe('POST /savechat', () => {
    it('should create a new chat', async () => {
      const newChat = {
        date: '2023-10-24',
        firstname: 'John',
        username: 'john_doe',
        message: 'Hello, World!',
      };

      const response = await request(app)
        .post('/savechat')
        .send(newChat);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.data.date).toBe(newChat.date);
      expect(response.body.data.firstname).toBe(newChat.firstname);
      expect(response.body.data.username).toBe(newChat.username);
      expect(response.body.data.message).toBe(newChat.message);
    });

    it('should handle errors when saving a chat', async () => {
      const invalidChat = {
        // Invalid chat data, e.g., missing required fields
      };

      const response = await request(app)
        .post('/savechat')
        .send(invalidChat);

      expect(response.status).toBe(500);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe("Erreur lors de la sauvegarde du chat.");
    });
  });
});
