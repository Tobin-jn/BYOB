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

// This endpoint was updated to allow for search queries for company name
app.get('/api/v1/companies', (request, response) => {
  // if a query was made, the url will look like this:
    // /api/v1/companies?companyName=COMPANY_NAME_HERE
  const { companyName } = request.query;

  if (companyName) {
    database('companies')
      .where('company_name', 'like', `%${companyName.toUpperCase()}%`)
      .select()
      .then(company => {
        response.status(200).json(company);
      })
      .catch(error => {
        response
          .status(500)
          .json({message: `Error fetching companies: ${error.message}`});
      });
    } else {
      database('companies')
        .select()
        .then(company => {
          response.status(200).json(company);
        })
        .catch(error => {
          response
            .status(500)
            .json({message: `Error fetching companies: ${error.message}`});
        });
      
  }

});

app.post('/api/v1/companies', (request, response) => {
  const company = request.body;
  for (let requiredParameter of [
    'company_name',
    'url',
    'company_size',
    'job_openings',
  ]) {
    if (company[requiredParameter] === undefined) {
      response.status(422).send({error: 'Missing required parameter'});
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

app.get('/api/v1/companies/:id', (request, response) => {
  const {id} = request.params;

  database('companies')
    .where('id', id)
    .select()
    .then(company => {
      response.status(200).json(company);
    })
    .catch(error => {
      response
        .status(500)
        .json({message: `Error finding company ${id}: ${error.message}`});
    });
});

app.delete(
  '/api/v1/companies/:company_id',
  checkBeforeDelete,
  (request, response) => {
    const company_id = request.params.company_id;
    database('companies')
      .where('id', company_id)
      .del()
      .then(company => {
        response.status(200).json({
          message: `Company with the id:${company} was successfully deleted.`,
        });
      })
      .catch(error => {
        response
          .status(500)
          .json({message: `Error deleting company: ${error.message}}`});
      });
  },
);

app.put('/api/v1/companies/:id', (request, response) => {
  const {id} = request.params;
  const company = request.body;

  if (Object.keys(company).length === 0) {
    response.status(422).send({error: 'Missing required parameters'})
  } else {
  database('companies')
    .where('id', id)
    .update(company)
    .returning(['id', 'company_name', 'url', 'company_size', 'job_openings'])
    .then(company => {
      response.status(200).json(company);
    })
    .catch(error => {
      response.status(500).json({error: error.message});
    });
  }
});

app.get('/api/v1/jobs', (request, response) => {
  database('jobs')
    .select()
    .then(jobs => {
      response.status(200).json(jobs);
    })
    .catch(error => {
      response
        .status(500)
        .json({message: `Error fetching jobs: ${error.message}`});
    });
});

app.post('/api/v1/jobs', (request, response) => {
  const job = request.body;

  for (let requiredParameter of ['title', 'company_id', 'location']) {
    if (job[requiredParameter] === undefined) {
      response.status(422).send({error: 'Missing required parameter'});
    }
  }
  database('jobs')
    .returning(['id', 'title', 'company_id', 'location'])
    .insert(job)
    .then(job => {
      response.status(201).json(job);
    })
    .catch(error => {
      response.status(500).json({error: error.message});
    });
});

app.get('/api/v1/jobs/find_by_location', (request, response) => {
  const { location } = request.query

  if (!location) {
    return response.status(422).send({ error: 'Request must include location. Example: /api/v1/jobs/find_by_location?location=GREATER+BOULDER+AREA'})
  }

  database('jobs')
    .where('location', location)
    .select()
    .then(jobs => {
      response.status(200).json(jobs)
    })
    .catch( error => {
      response.status(500).json({
        message: `Error fetching jobs in ${location}: ${error.message}`,})
    });
});

app.get('/api/v1/jobs/:company_id/positions', (request, response) => {
  const companyId = request.params.company_id;
  database('jobs')
    .where('company_id', companyId)
    .select()
    .then(jobs => {
      response.status(200).json(jobs);
    })
    .catch(error => {
      response.status(500).json({
        message: `Error fetching jobs at company ${companyId}: ${error.message}`,
      });
    });
});


app.put('/api/v1/jobs/:id', (request, response) => {
  const {id} = request.params;
  const job = request.body;

  if (Object.keys(job).length === 0) {
    response.status(422).send({error: 'Missing required parameters'})
  } else {
    database('jobs')
      .where('id', id)
      .update(job)
      .returning(['id', 'title', 'company_id', 'company_name'])
      .then(job => {
        response.status(200).json(job);
      })
      .catch(error => {
        response.status(500).json({error: error.message});
      });
  }
});

app.delete('/api/v1/jobs/:id', (request, response) => {
  const {id} = request.params;

  database('jobs')
    .where('id', id)
    .del()
    .then(job => {
      response.status(202).json({success: `job deleted`});
    })
    .catch(error => {
      response.status(500).json({error: error.message});
    });
});

function checkBeforeDelete(request, response, next) {
  const company_id = request.params.company_id;

  database('jobs')
    .where('company_id', company_id)
    .del()
    .then(() => next())
    .catch(error => error);
}

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
