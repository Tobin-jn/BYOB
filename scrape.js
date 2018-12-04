var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true});
var fs = require('fs');
nightmare
  .goto(
    'https://www.builtincolorado.com/jobs?hash-changes=5&f[0]=job-category_developer-engineer',
  )
  .click(`[data-facet-alias='job-category_developer-engineer']`)
  .click(`[data-facet-alias='job-category_developer-engineer-front-end']`)
  .click(`[data-facet-alias='job-category_developer-engineer-javascript']`)
  .wait(3000)
  .evaluate((result, done) => {
    const companyTitle = document.querySelectorAll('.company-title');
    const jobTitle = document.querySelectorAll('h2.title');
    const location = document.querySelectorAll('.job-location');

    let list = [].slice.call(jobTitle);

    return list.map(title => {
     return {position:  title.innerText}
    });
  })
  .end()
  .then(result => {
    console.log(result);
    fs.writeFileSync('testOutput.json', JSON.stringify(result));
  })
  .catch(error => console.log(`error: ${error}`));
