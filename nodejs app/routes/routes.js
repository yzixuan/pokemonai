var library = require('../lib/library');

module.exports = {

  getIndex: function(req, res) {
    res.render('index');
  },

  getLogin: function(req, res) {
    res.render('login');
  },

  loginError: function(req, res) {
    res.render('loginError');
  },  

  getAbout: function(req, res) {
    res.render('about');
  },

  getPlay: function(req, res) {
    res.render('play');
  },  

  getWar: function(req, res) {
    res.render('war');
  },  
  
  getUser: function(req, res) {
    library.getUser(req.params.username, function(err, user) {
      if (user)
        res.send('1');
      else
        res.send('0');
    });
  },
  
  profile: function(req, res) {
    library.getUserById(req.session._id, function(err, user) {
    var profile = [];
    if (user && user.profile) profile = user.profile;
    res.render('profile', {profile:profile, username:user.username, email: user.email});
  });
  },
  
  login: function(req, res) {
    library.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        res.redirect('/profile');
      }
      else
        res.redirect('/loginError');
    });    
  },
  
  signup: function(req, res) {
    library.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      console.log(user);
      res.redirect('/profile');
    });
  }
}