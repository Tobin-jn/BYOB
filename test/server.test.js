process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;
const should = chai.should();
const config = require('../knexfile')['test'];
const database = require('knex')(config);

chai.use(chaiHttp);

describe('API Routes', () => {
  beforeEach(() =>
    database.migrate
      .rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run()));

  it('check to see if everything is setup correctly', done => {
    chai
      .request(app)
      .get('/')
      .end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it('should return a 200 status code', done => {
    chai
      .request(app)
      .get('/api/v1/jobs')
      .end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
  });

  it('should return an array jobs', done => {
    chai
      .request(app)
      .get('/api/v1/jobs/1/positions')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        done();
      });
  });
});
