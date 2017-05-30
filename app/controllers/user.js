let User = require('../models/user.js');
let bcrypt = require('bcrypt');

// show signup
exports.showSignup = (req, res) => {
  res.render('signup', {
    title: '注册页面'
  });
};

// signup
exports.signup = (req, res) => {
  console.log('signup-->', req.body);
  let _user = req.body.user;
  User.findOne({name: _user.name}, (err, user) => {
    if (err) {
      console.log(err);
    };
    if (user) {
      res.redirect('/signin');
    } else {
      const SALT_WORK_FACTOR = 10;
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
          console.log(err);
        };
        bcrypt.hash(_user.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          };
          _user.password = hash;
          let user = new User(_user);
          user.save((err, user) => {
            if (err) {
              console.log(err);
            }
            res.redirect('/');
          });
        });
      });
    }
  });
};

// show signin
exports.showSignin = (req, res) => {
  res.render('signin', {
    title: '登录页面'
  });
};

// signin
exports.signin = (req, res) => {
  let _user = req.body.user;
  let name = _user.name;
  let password = _user.password;
  User.findOne({name: name}, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.redirect('/signup');
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.redirect('/signin');
      }
    });
  });
};

// logout
exports.logout = (req, res) => {
  delete req.session.user;
  res.redirect('/');
};

// user list page
exports.userlist = (req, res) => {
  User.fetch((err, users) => {
    res.render('userList', {
      title: 'website 用户列表页',
      users: users
    });
  });
};

// list delete movie
exports.delete = (req, res) => {
  let id = req.query.id;
  console.log('id-->', id);
  if (id) {
    User.remove({_id: id}, (err, user) => {
      console.log('user-->', user);
      if (err) {
        console.log(err);
      } else {
        res.send({success: 1});
      }
    });
  }
};

// middleware for user: user signin required
exports.signinRequired = (req, res, next) => {
  let user = req.session.user;
  if (!user) {
    res.redirect('/signin');
    return;
  }
  next();
};

// middleware for user: user admin required
exports.adminRequired = (req, res, next) => {
  let user = req.session.user;
  if (user.role > 10) {
    next();
  } else {
    res.redirect('/');
  }
};