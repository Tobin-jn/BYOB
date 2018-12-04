var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true});
var fs = require('fs');


nightmare
  .goto(
    // 'https://www.builtincolorado.com/jobs?hash-changes=5&f[0]=job-category_developer-engineer',
    "https://www.builtincolorado.com/jobs?f[0]=job-category_developer-engineer&hash-changes=2&page=10",
  )
  // .click(`[data-facet-alias='job-category_developer-engineer']`)
  // .click(`[data-facet-alias='job-category_developer-engineer-front-end']`)
  // .click(`[data-facet-alias='job-category_developer-engineer-javascript']`)
  .wait(3000)
  // .click('li.pager__item--next.pager__item')
  // .wait(3000)
  .evaluate((result, done) => {
    const companyTitle = document.querySelectorAll('.company-title');
    const jobTitle = document.querySelectorAll('h2.title');
    const location = document.querySelectorAll('.job-location');

    let list = [].slice.call(companyTitle);
    let list2 = [].slice.call(jobTitle);
    let list3 = [].slice.call(location);

    return list.map((title, index) => {
     return {
      company:  title.innerText,
      position: list2[index].innerText,
      location: list3[index].innerText,
      }
    });
  })
 
  .end()
  .then(result => {
    console.log(result);
    fs.writeFileSync('jobs10.json', JSON.stringify(result));
  })
  .catch(error => console.log(`error: ${error}`));

    // .click('li.pager__item--next.pager__item')


