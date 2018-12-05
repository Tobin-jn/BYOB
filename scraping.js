const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const { writeFileSync } = require("fs");

let num = 0;

// const searchIt = word => {
//   nightmare
//     .viewport(1024, 1500)
//     .goto("https://www.duckduckgo.com")
//     .type("#search_form_input_homepage", `${word}`)
//     .click("#search_button_homepage")
//     .wait(2000)
//     .evaluate(() => {
//       let description = document.querySelectorAll(".result__snippet");
//       let descriptionArray = [].slice.call(description);
//       return descriptionArray.map((item, index) => {
//         return {
//           [index]: item.innerText
//         };
//       });
//     })
//     .end()
//     .then(result => {
//       writeFileSync(`beeStats${num}.js`, result, function(err) {});
//       console.log(result);
//     })
//     .catch(error => {
//       console.log("error", error);
//     });
// };
var i = 0;
var runItAgain = function(i) {
  let wordList = ["bee"];
  if (i < wordList.length) {
    nightmare
      .viewport(1024, 1500)
      .goto("https://www.duckduckgo.com")
      .type("#search_form_input_homepage", `${wordList[i]}`)
      .click("#search_button_homepage")
      .wait(2000)
      .evaluate(() => {
        let description = document.querySelectorAll(".js-about-item-abstr");
        let descriptionArray = [].slice.call(description);
        return descriptionArray.map((item, index) => {
          return {
            [index]: item.innerText
          };
        });
      })
      .then(result => {
        writeFileSync(`beeStats${i}.js`, JSON.stringify(result), function(
          err
        ) {});
        nightmare.run(() => {
          i++;
          runItAgain(i);
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  }
};
runItAgain(0);
