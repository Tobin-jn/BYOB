# Contributing
We love pull requests from everyone. Any contribution is valuable, but there are two issue streams that we especially love people to work on:

1) Our delivery backlog, is managed via a Waffle.io | [Waffle Board](https://waffle.io/Tobin-jn/BYOB)

2) Our issues to contribute to are in the issues tab under the label `to do`. We consider this to be a good starting point for new contributors.

## Set up

Please follow the [GETTING_STARTED](GETTING_STARTED.md) guide to set up your local dev environment.

This guide assumes that the git remote name of the main repo is `upstream` and that your fork is named `master`.

Create a new branch on your local machine to make your changes against (based on `upstream/master`):

    git checkout -b branch-name-here --no-track upstream/master

If you want to run the whole test suite, we recommend using a free CI service to run your tests in parallel. Running the whole suite locally in series is likely to take 2 minutes. [TravisCI][travis] works great in our experience. Either way, make sure the tests pass on your new branch:

    npm test
    npm run testwc  (runs test suite and shows test coverage)

## Making a change

Make your changes to the codebase. We recommend using TDD. Add a test, make changes and get the test suite back to green.

    all test live in:
      test/server.test.js

Once the tests are passing you can commit your changes. See [Making a great commit][great-commit] for more tips.

    git add .
    git commit -m "Add a concise commit message describing your change here"

Push your changes to a branch on your fork:

    git push origin branch-name-here

## Submitting a Pull Request

Use the GitHub UI to submit a [new pull request][pr] against upstream/master. To increase the chances that your pull request is swiftly accepted please have a look at our guide to [making a great pull request][great-pr].

TL;DR:
* Write tests
* Make sure the whole test suite is passing
* Keep your PR small, with a single focus
* Use a style consistent with the rest of the codebase
* Before submitting, [rebase your work][rebase] on the current master branch

From here, your pull request will progress through the Review, Test, Merge & Deploy on our end.

[great-commit]: https://github.com/openfoodfoundation/openfoodnetwork/wiki/Making-a-great-commit
[rebase]: https://www.atlassian.com/git/tutorials/merging-vs-rebasing/workflow-walkthrough
[travis]: https://travis-ci.org/
