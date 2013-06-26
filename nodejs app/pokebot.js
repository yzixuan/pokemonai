'use strict';

var db = require('./lib/db')
  , express = require('express')
  , library = require('./lib/library')
  , routes = require('./routes/routes.js');

var app = express.createServer();
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secretpasswordforsessions'}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
});
app.set('view options', {
  layout: false
});
app.get('/', routes.getIndex);
app.get('/loginPage', routes.getLogin);
app.get('/api/user/:username', routes.getUser);
app.get('/about', routes.getAbout);
app.get('/play', library.ensureAuthenticated, routes.getPlay);
app.get('/playothers', library.ensureAuthenticated, routes.playOthers);
app.get('/playai', library.ensureAuthenticated, routes.playAi);
app.get('/war', routes.getWar);
app.get('/profile', library.ensureAuthenticated, routes.profile);
app.get('/loginError', routes.loginError);
app.post('/login', routes.login);
app.post('/signup', routes.signup);
app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});
 
db.open(function() {
  app.listen(3000);
});