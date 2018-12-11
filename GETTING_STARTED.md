# Getting Started

This is a general guide to setting up the BYO development environment on your local machine.

### Dependencies

   * body-parser 1.18.3
   * chai 4.2.0
   * express 4.16.4
   * knex 0.15.2
   * mocha 5.2.0
   * nightmare 3.0.1
   * pg 7.7.1
   * vo 4.0.2
   * chai-http 4.2.0
   * nyc 13.1.0 


### Get it

If you [contribute](https://github.com/Tobin-jn/BYOB/blob/master/CONTRIBUTING.md) code to the project , begin by forking this repo using the `Fork` button in the top-right corner of this screen. You should then be able to use `git clone` to copy your fork onto your local machine.

    git clone https://github.com/YOUR_GITHUB_USERNAME_HERE/BYOB

Jump into your new local copy of BYOB:

    cd BYOB

And then add an `upstream` remote that points to the main repo:

    git remote add upstream https://github.com/Tobin-jn/BYOB

Fetch the latest version of `master` from `upstream` (ie. the main repo):

    git fetch upstream master
    
This guide assumes that the git remote name of the main repo is `upstream` and that your fork is named `origin`.

Create a new branch on your local machine to make your changes against (based on `upstream/master`):

     git checkout -b branch-name-here --no-track upstream/master

### Get it running locally

 Use the terminal for the following:
1. Install PostgreSQL globally on your machine if it is not already installed
```
brew install postgres
```

2.
```
npm install
```

3. Create new database named 'devjobs' on local machine

```
CREATE DATABASE devjobs;
```

4. 
```
knex migrate:latest
```

5.
```
knex seed:run
```
6.
 ```
 npm start
 ```


 ### Testing
1. Create new database named 'devjobs_test' on local machine

```CREATE DATABASE devjobs_test;```

2. ```knex migrate:latest --env test```

Tests can be run with:

    npm test

### Troubleshooting

Below are fixes to potential issues that can happen during the installation process.

#### Creating the database

If the ```$ sudo -u postgres psql -c "CREATE USER ofn WITH SUPERUSER CREATEDB PASSWORD 'f00d'"``` command doesn't work, you can run the following commands instead:
```
$ createuser --superuser --pwprompt ofn
Enter password for new role: f00d
Enter it again: f00d
$ createdb byob_dev --owner=ofn
$ createdb byob_test --owner=ofn
```
If these commands succeed, you should be able to [continue the setup process](#get-it-running).

[Contribute]: https://github.com/Tobin-jn/BYOB/blob/master/CONTRIBUTING.md
