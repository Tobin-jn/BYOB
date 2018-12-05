const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use( bodyParser.json() );
app.use(express.static('public'));


app.set('port', process.env.PORT || 3000);
app.locals.title = 'devjobs';

app.get('/api/v1/', (request, response) => {

});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});