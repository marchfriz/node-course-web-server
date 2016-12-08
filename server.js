const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// per utilizzare html/hbs parziali
hbs.registerPartials(__dirname + '/views/partials'); // __dirname ->percorso completa cartella
// impostare view engine hbs
app.set('view_engine', 'hbs');
// how to register middlewear
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// // middlewear che ferma tutte le altre (es. per mantenimento) se manca next()
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//usare pagine statiche
app.use(express.static(__dirname + '/public'));
// permette di usare {{getCurrentYear}} all'interno dei file .hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// //--pagine con file JSON
// app.get('/', (req, res) => { //1. indirizzo (in questo caso cartella root). 2. come rispondere alla richiesta
//   // res.send('<h1>Hello Express!</h1>');
//   res.send({
//     name: 'March',
//     likes: [
//       'Climbing',
//       'Eating',
//       'Boo'
//     ],
//     age: 29
//   });
// });

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website!!'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req,res) => {
  res.send({
    errorMessage: 'Unable to fulfill the request'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
}); //porta su cui ascoltare (localhost usually 3000)
