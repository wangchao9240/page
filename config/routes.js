let _ = require('lodash');
let Index = require('../app/controllers/index.js');
let User = require('../app/controllers/user.js');
let Movie = require('../app/controllers/movie.js');
let Comment = require('../app/controllers/comment.js');
let Category = require('../app/controllers/category.js');

module.exports = (app) => {
  // pre handeler user
  app.use((req, res, next) => {
    let _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  // index page
  app.get('/', Index.index);

  // user
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/logout', User.signinRequired, User.logout);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.delete);

  // movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.admin);
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.new);
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.delete);

  // comment
  app.post('/user/comment', User.signinRequired, Comment.save);

  // Category
  app.post('/admin/category/new', User.signinRequired, User.adminRequired, Category.save);
  app.get('/admin/category', User.signinRequired, User.adminRequired, Category.categoryAdmin);
  app.get('/admin/categorylist', User.signinRequired, User.adminRequired, Category.list);
  app.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update);
  app.delete('/admin/categorylist', User.signinRequired, User.adminRequired, Category.delete);

  // results
  app.get('/results', Index.search);

  // test
  app.get('/test', (req, res) => {
    res.send({
      result: 1
    });
  });
};