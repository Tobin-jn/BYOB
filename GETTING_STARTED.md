### Getting Started

This is a general guide to setting up the BYO development environment on your local machine.

The following guides are located in the wiki and provide more OS-specific step-by-step instructions:

- [Ubuntu Setup Guide][ubuntu]
- [macOS Sierra Setup Guide][sierra]
- [OSX El Capitan Setup Guide][el-capitan]

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

If you contribute code to the project (contribute](CONTRIBUTING.md)), begin by forking this repo using the `Fork` button in the top-right corner of this screen. You should then be able to use `git clone` to copy your fork onto your local machine.

    git clone https://github.com/YOUR_GITHUB_USERNAME_HERE/BYOB

Jump into your new local copy of BYOB:

    cd BYOB

And then add an `upstream` remote that points to the main repo:

    git remote add upstream https://github.com/Tobin-jn/BYOB

Fetch the latest version of `master` from `upstream` (ie. the main repo):

    git fetch upstream master

### Get it running

First, you need to create the database user the app will use by manually typing the following in your terminal:

```sh
$ sudo -u postgres psql -c "CREATE USER ofn WITH SUPERUSER CREATEDB PASSWORD 'f00d'"
```

This will create the "ofn" user as superuser and allowing it to create databases. If this command fails, check the [troubleshooting section](#creating-the-database) for an alternative.

Once done, run `script/setup`. If the script succeeds you're ready to start developing. If not, take a look at the output as it should be informative enough to help you troubleshoot.

If you run into any other issues getting your local environment up and running please consult [the wiki][wiki].

If still you get stuck do not hesitate to open an issue reporting the full output of the script.

Now, your dreams of spinning up a development server can be realised:

    node server.js


### Testing

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

[Contribute]: https://github.com/openfoodfoundation/openfoodnetwork/wiki
