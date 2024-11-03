var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'dice game' });
});

router.get('/register', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('register', { title: 'dice game' })


});
router.get('/login', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('login', { title: 'dice game' })


});

module.exports = router;
