const jobs = require('../../../testOutput.js');

const createCompany = (knex, job) => {
  return knex('companies').insert({
    company_name: job.company_Title,
  }, 'id')
  .then(companyId => {
    let jobPromises = [];

    jobPromises.push(createJob(knex, {
      title: job.job_position,
      location: job.location,
      company_id: companyId[0]
      })
    )
    return Promise.all(jobPromises);
  })
};

const createJob = (knex, job) => {
  return knex('jobs').insert(job);
};


exports.seed = function(knex, Promise) {
  return knex('jobs').del()
    .then(() => knex('companies').del())
    .then(() => {
      let companyPromises = [];

      jobs.forEach( job => {
        companyPromises.push(createCompany(knex, job))
      });

      return Promise.all(companyPromises)
    })
      .catch(error => console.log(`Error seeding data: ${error}`));

};
