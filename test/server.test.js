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

  it('should return a 404 for a route that does not exist', done => {
    chai
      .request(app)
      .get('/badurl')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  })

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
      
      it('returns the companies from the search query', done => {
        chai
          .request(app)
          .get('/api/v1/companies?companyName=sen')
          .end((error, response) => {
            response.body.length.should.equal(1);
            done();
          });
        
    })


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

    it('should return a 422 for incomplete parameters', () => {
      const newCompany = {
        company_name: 'Turing'
      };

      chai
        .request(app)
        .post('/api/v1/companies')
        .send(newCompany)
        .end((request, response) => {
          response.should.have.status(422)
          response.body.should.have.property('error')
          response.body.error.should.equal('Missing required parameter')
        })
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
          response.body.length.should.equal(1);
          response.body[0].should.have.property('company_name');
          response.body[0].company_name.should.equal('ALTERYX, INC.');
          done();
        });
    });

    it('should update a companys information', done => {
      let updateCompany = {
        company_name: 'newCompany',
      };

      chai
        .request(app)
        .put('/api/v1/companies/4')
        .send(updateCompany)
        .end((error, response) => {
          expect(response).to.have.status(200);
          response.body[0].should.have.property('company_name');
          response.body[0].company_name.should.equal('newCompany');
          response.body[0].should.have.property('url');
          response.body[0].should.have.property('company_size');
          response.body[0].should.have.property('job_openings');
          response.body[0].id.should.equal(4);
          done();
        });
    });

    it('should return a 422 if no parameters are given', done => {
      const updateCompany = {};

      chai
        .request(app)
        .put('/api/v1/companies/4')
        .send(updateCompany)
        .end((error, response) => {
          expect(response).to.have.status(422);
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

    it('should post a new job', done => {
      const newJob = {
        title: 'Janitor',
        company_id: 3,
        location: 'GREATER DENVER AREA',
      };

      chai
        .request(app)
        .post('/api/v1/jobs')
        .send(newJob)
        .end((request, response) => {
          expect(response).to.have.status(201);
          response.body[0].should.have.property('title');
          response.body[0].should.have.property('company_id');
          response.body[0].should.have.property('location');
          response.body[0].title.should.equal('Janitor');
          response.body[0].company_id.should.equal(3);
          response.body[0].location.should.equal('GREATER DENVER AREA');
          response.body[0].id.should.equal(5);
          done();
        });
    });

    it('should return a 422 for incomplete parameters', () => {
      const newJob = {
        company_id: 3
      };

      chai
        .request(app)
        .post('/api/v1/jobs')
        .send(newJob)
        .end((request, response) => {
          response.should.have.status(422)
          response.body.should.have.property('error')
          response.body.error.should.equal('Missing required parameter')
        })
    });
  });

  describe('/api/v1/jobs/find_by_location', () => {
    it('should return jobs in a specific location', done => {
      chai
        .request(app)
        .get('/api/v1/jobs/find_by_location?location=GREATER+BOULDER+AREA')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          done();
      })
    });

    it('should return a 422 if the url is incorrect', done => {
      const url = '/api/v1/jobs/find_by_location'

      chai
        .request(app)
        .get(url)
        .end((error, response) => {
          expect(response).to.have.status(422);
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
        })
    });
  });

  describe('/api/v1/jobs/:id', () => {
    it('should update a job', done => {
      const updateJob = {
        title: 'Janitor',
      };
      chai
        .request(app)
        .put('/api/v1/jobs/1')
        .send(updateJob)
        .end((error, response) => {
          expect(response).to.have.status(200);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('Janitor');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('company_id');
          response.body[0].should.have.property('company_name');
          response.body[0].id.should.equal(1);
          done();
        });
    });

    it('should return a 422 if no parameters are given', done => {
      const updateJob = {};

      chai
        .request(app)
        .put('/api/v1/jobs/1')
        .send(updateJob)
        .end((error, response) => {
          expect(response).to.have.status(422);
          done();
      });
    });

    it('should delete a job', done => {
      chai
        .request(app)
        .delete('/api/v1/jobs/1')
        .end((error, response) => {
          response.should.have.status(202);
          response.should.be.json;
          done();
        });
    });
  });

  describe('/api/v1/companies/:company_id', () => {
    it('should delete a company', done => {
      chai
        .request(app)
        .delete('/api/v1/companies/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          done();
        });
    });
  });
});
