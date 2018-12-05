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

//jobs section
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
  console.log(companyId)
  database('jobs')
    .where('company_id', companyId)
    .select()
    .then(jobs => {
      response.status(200).json(jobs);
      console.log(jobs);
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
