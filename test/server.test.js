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

  describe('/api/v1/companies', () => {
    it('return all of the companies', done => {
      chai
        .request(app)
        .get('/api/v1/companies')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
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
          response.body[0].should.have.property('company_name');
          response.body[0].should.have.property('url');
          response.body[0].should.have.property('company_size');
          response.body[0].should.have.property('job_openings');
          response.body[0].company_name.should.equal('test');
          response.body[0].url.should.equal('www.test.com');
          response.body[0].company_size.should.equal(100);
          response.body[0].job_openings.should.equal(10);
          response.body[0].id.should.equal(5);
          done();
        });
    });
  });

  describe('/api/v1/companies/:id', () => {
    it('should get a specific company', done => {
      chai
        .request(app)
        .get('/api/v1/companies/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1)
          response.body[0].should.have.property('company_name');
          response.body[0].company_name.should.equal('ALTERYX, INC.');
          done();
        })
    })

    it('should update a companys information', done => {
      let updateCompany = {
        company_name: 'newCompany',
      };

      chai
        .request(app)
        .put('/api/v1/companies/4')
        .send(updateCompany)
        .end((error, response) => {
          expect(response).to.have.status(201);
          response.body[0].should.have.property('company_name');
          response.body[0].company_name.should.equal('newCompany');
          response.body[0].should.have.property('url');
          response.body[0].should.have.property('company_size');
          response.body[0].should.have.property('job_openings');
          response.body[0].id.should.equal(4);
          done();
        });
      });
    });


  describe('/api/v1/jobs', () => {
    it('should return all of the jobs', done => {
      chai
        .request(app)
        .get('/api/v1/jobs')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          done();
        });
    });
  });


  describe('/api/v1/jobs/:company_id/positions', () => {
    it('should return an array of jobs for a company', done => {
      chai
        .request(app)
        .get('/api/v1/jobs/1/positions')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });
  });

  describe('/api/v1/jobs/:id', () => {
    it('should delete a company', done => {
      chai
        .request(app)
        .delete('/api/v1/jobs/1')
        .end((error, response) => {
          response.should.have.status(202)
          response.should.be.json;
          done()
      })
    }); 
  });
});
