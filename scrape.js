var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true});
var fs = require('fs');
var vo = require('vo');

vo(run)((err, result) => {
  if (err) throw err;
});

function* run() {
  var nightmare = Nightmare({show: true});
  var maxPage = 5;
  var currentPage = 0;
  var nextExists = true;
  var totalCompanyTitles = [];
  var totalJobTitles = [];
  var totalLocations = [];
  var allData = [];

  yield nightmare
    .goto(
      'https://www.builtincolorado.com/jobs?hash-changes=5&f[0]=job-category_developer-engineer',
    )
    .click(`[data-facet-alias='job-category_developer-engineer']`)
    .click(`[data-facet-alias='job-category_developer-engineer-front-end']`)
    .click(`[data-facet-alias='job-category_developer-engineer-javascript']`)
    .wait(2000);

  nextExists = yield nightmare.visible(`[title='Go to next page']`);

  while (nextExists && currentPage < maxPage) {
    allData.push(
      yield nightmare.evaluate((result, done) => {
        totalCompanyTitles = [];
        totalJobTitles = [];
        totalLocations = [];
        let companyTitle = document.querySelectorAll('.company-title');
        let jobTitle = document.querySelectorAll('h2.title');
        let location = document.querySelectorAll('.job-location');

        let companyTitleArr = [].slice.call(companyTitle);
        totalCompanyTitles.push(...companyTitleArr);
        let jobTitleArr = [].slice.call(jobTitle);
        totalJobTitles.push(...jobTitleArr);
        let locationArr = [].slice.call(location);
         totalLocations.push(...locationArr);
        return totalCompanyTitles.map((title, index) => {
          return {
            company_Title: title.innerText,
            job_position: jobTitleArr[index].innerText,
            location: locationArr[index].innerText,
          };
        });
      }),
    );
    yield nightmare.click(`[title='Go to next page']`).wait(2000);

    currentPage++;
    nextExists = yield nightmare.visible(`[title='Go to next page']`);
  }
  console.dir(allData);
  fs.writeFileSync('testOutput.json', JSON.stringify(allData));
  yield nightmare.end();
}
