import * as request from 'supertest';

const BASE_URL = 'http://localhost:3000';

describe('Locations Load Test', () => {
  it('should handle 100 concurrent POST /locations requests successfully', async () => {
    const payloads = Array.from({ length: 100 }).map((_, i) => ({
      userId: 'test-user-1',
      latitude: 40.000 + (i * 0.0001),
      longitude: 30.000 + (i * 0.0001),
    }));

    const results = await Promise.all(
      payloads.map(payload =>
        request(BASE_URL)
          .post('/locations')
          .send(payload)
          .set('Content-Type', 'application/json')
      )
    );

    results.forEach(res => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('enteredAreas');
      expect(res.body).toHaveProperty('logs');
    });
  }, 20000); // 20 saniye timeout
}); 