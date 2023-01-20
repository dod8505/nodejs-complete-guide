const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isAuthenticated;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('63670219ddeb8a399fd34c39')
    .then((user) => {
      req.session.user = user;
      req.session.isAuthenticated = true;
      req.session.save(() => {
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => res.redirect('/'));
};
