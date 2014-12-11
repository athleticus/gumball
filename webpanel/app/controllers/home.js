var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Person = mongoose.model('person');

var config = require('../../../config.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/statistics', function(req, res, next) {
  Person.find(function(err, people) {
    res.render('stats', {
      title: config.webpanel.app.name,
      people: people
    });
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: config.webpanel.app.name
  });
});

router.post('/register', function(req, res, next) {
  var rfid = req.body.rfid;
  var name = req.body.name;

  if(!name) {
    res.json({
      type: 'error',
      msg: "You must enter a name"
    });
    return;
  }
  
  // check if user exists
  Person.findOne({rfid: rfid}, function(err, person) {
    if(person) {
      // person exists
      res.json({
        type: 'error',
        msg: 'RFID "' + rfid + '" already exists.'
      });
      return;
    }

    // create person
    Person.create({
      rfid: rfid,
      name: name
    }, function(err, person) {
      res.json({
        type: 'success',
        msg: 'Successfully created "' + name + '" with rfid: ' + rfid
      });
    });
  });
});

router.get('/', function(req, res, next) {
  res.redirect('/statistics');
});

// router.get('/', function (req, res, next) {

//   Article.find(function (err, articles) {
//     if (err) return next(err);
//     res.render('index', {
//       title: 'Generator-Express MVC',
//       articles: articles
//     });
//   });
// });
