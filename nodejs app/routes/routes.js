var library = require('../lib/library');
var fs = require('fs');

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
    res.render('playothers', {username:user.username});
  });
  },

  playAi: function(req, res) {
    library.getUserById(req.session._id, function(err, user) {
    var profile = [];
    if (user && user.profile) profile = user.profile;
    res.render('playai', {username:user.username});
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
 
	//gets all the filenames of the avatar pictures, then render profile page
	fs.readdir('public\/img\/avatar', function(err, files){
		res.render('profile', {profile:profile, username:user.username, email:user.email, avatar:user.avatar, pictures:files, wins:user.wins, losses:user.losses});
	});
  });
  },
  
  login: function(req, res) {
    library.authenticate(req.body.username, req.body.password, function(err, id) {
      if (id) {
        req.session._id = id;
        res.cookie('username', id.username, {username: id.username});
        res.cookie('password', id.password, {password: id.password});
		// Clears associated showdown user on login to prevent people having duplicate showdown usernames.
		library.setShowdownUser(req.session._id, 'null');
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
  },
  
  updateAvatar: function(req, res) {
    library.avatarUpdate(req.session._id, req.body, function(err, user) {
      res.redirect('/profile');
  });
  },
  
  // Called from the showdown client.
  setShowdownName: function(req, res) {
	console.log("showdown user: " + req.body.name);
    library.setShowdownUser(req.session._id, req.body.name);
  },
  
  setWin: function(req, res) {
	library.updateWinLoss(req.body.winner, 'win', function(){ 
		res.end('200');
	});
  },
  
  setLoss: function(req, res) {
	library.updateWinLoss(req.body.loser, 'loss', function(){ 
		res.end('200');
	});
  },
  
  getLeaderboard: function(req, res){
	library.getLeaderboard();
  }
}