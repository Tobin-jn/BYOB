# Build Your Own Backend

## API - Endpoints

#### Receive all Companies and Add a Company

```/api/v1/companies```

Adding a company must have parameters included (company_name, url, company_size, job_openings). Users should expect to see the company returned.

#### See a Specific Company, Update a Company, and Delete a Job

```/api/v1/companies/:id```

To see a specific company, the id is required. Users will get the company returned. 
To delete a company and all its job postings the id is required. Users will get a success message returned.
To update a company the updated property or properties must be included (company_name, url, company_size, job_openings). The updated company will be returned to the user.

#### Receive all Jobs and Add a Job

```/api/v1/jobs```

Adding a job must have parameters included (title, company_id, location). Users should expect to see the job returned.

#### Receive all positions at a specific company

```/api/v1/jobs/:company_id/positions```

Getting all the positions at a specific compay requires the company id. The positions are returned to the user.

#### Update a Job and Delete a Job

```/api/v1/jobs/:id```

To update a job the updated property or properties must be included (title, location, company_id). The updated job will be returned to the user.
To delete a job and all its job postings the id is required. Users will get a success message returned.