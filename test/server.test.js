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

  it('should post a new company', done => {
    let newCompany = {
      company_name: 'test',
      url: 'www.test.com',
      company_size: 100,
      job_openings: 10,
    };

    chai
      .request(app)
      .post('/api/v1/companies')
      .send(newCompany)
      .end((error, response) => {
        expect(response).to.have.status(201);
        console.log(response.body)
        response.body[0].should.have.property('company_name');
        response.body[0].should.have.property('url');
        response.body[0].should.have.property('company_size');
        response.body[0].should.have.property('job_openings');
        response.body[0].id.should.equal(5);
        done();
      });
  });
});
