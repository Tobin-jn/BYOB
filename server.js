const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'devjobs_test';

app.get('/', (request, response) => {
  response.status(200).send('everything is ok');
});

app.get('/api/v1/jobs', (request, response) => {
  database('jobs')
    .select()
    .then(jobs => {
      response.status(200).json(jobs);
    })
    .catch(error =>
      response
        .status(500)
        .json({message: `Error fetching jobs: ${error.message}`}),
    );
});

app.get('/api/v1/jobs/:company_id/positions', (request, response) => {
  const companyId = request.params.company_id;
  database('jobs')
    .where('company_id', companyId)
    .select()
    .then(jobs => {
      response.status(200).json(jobs);
    });
});

app.post('/api/v1/companies', (request, response) => {
  const company = request.body;
  for (let requiredParameter of [
    'company_name',
    'url',
    'company_size',
    'job_openings',
  ]) {
    if (requiredParameter === undefined) {
      return response.status(422).send({error: 'Missing required parameter'});
    }
  }
  database('companies')
    .returning(['id', 'company_name', 'url', 'company_size', 'job_openings'])
    .insert(company)
    .then(company => {
      response.status(201).json(company);
    })
    .catch(error => {
      response.status(500).json({error: error.message});
    });
});

app.get('/api/v1/companies', (request, response) => {
  database('companies')
    .select()
    .then(company => {
      response.status(200).json(company);
    })
    .catch(error =>
      response
        .status(500)
        .json({message: `Error fetching companies: ${error.message}`}),
    );
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
