import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js'; // Update the app.js to export app properly

describe('GET /', () => {
  it('should return the landing page', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.include(' internshipHello, This is Jotham Arinze DevOps submission for the Balanceè internship');
        done();
      });
  });
});
