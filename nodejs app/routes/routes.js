var library = require('../lib/library');

module.exports = {

  getIndex: function(req, res) {
    if (!req.session._id || req.cookies.username == undefined) {
      res.render('index', {type: 'unsigned', username:undefined});
    } else {
      library.getUserById(req.session._id, function(err, user) {
        var profile = [];
        if (user && user.profile) profile = user.profile;  
        res.render('index', {type: 'signed', username:user.username});
      });  
    }  
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
    library.getUserById(req.session._id, function(err, user) {
    var profile = [];
    if (user && user.profile) profile = user.profile;
    res.render('play', {profile:profile, username:user.username});
  });
  },

  playOthers: function(req, res) {
    library.getUserById(req.session._id, function(err, user) {
    var profile = [];
    if (user && user.profile) profile = user.profile;
    res.render('playOthers', {username:user.username});
  });
  },

  playAi: function(req, res) {
    library.getUserById(req.session._id, function(err, user) {
    var profile = [];
    if (user && user.profile) profile = user.profile;
    res.render('playAi', {username:user.username});
  });
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
    res.render('profile', {profile:profile, username:user.username, email: user.email, avatar: user.avatar});
  });
  },
  
  login: function(req, res) {
    library.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        res.cookie('username', id.username, {username: id.username});
        res.cookie('password', id.password, {password: id.password});
        res.redirect('/profile');
      }
      else
        res.redirect('/loginError');
    });    
  },
  
  signup: function(req, res) {
    library.createUser(req.body.username, req.body.email, req.body.password, function(err, user) {
      console.log(user);
    library.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        res.cookie('username', id.username, {username: id.username});
        res.cookie('password', id.password, {password: id.password});
        res.redirect('/profile');
      }
      else
        res.redirect('/loginError');
    });       
    });
  },

  updateEmail: function(req, res) {
    library.mailUpdate(req.session._id, req.body.email, function(err, user) {
      res.redirect('/profile');
  });
  }
}