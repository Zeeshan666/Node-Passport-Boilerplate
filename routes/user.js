const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const Users = require("../Models/Users");

Router.get("/Login", (req, res) => {
  res.render("login");
});
Router.get("/Register", (req, res) => {
  res.render("register");
});
Router.post("/Register", (req, res) => {
  const { password, password2, email, name } = req.body;
  let errors = [];
  if (!password || !password2 || !email || !name) {
    errors.push({ msg: "please fill all fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password donot match" });
  }
  if (password.length < 0) {
    errors.push({ msg: "Password should be Six char long" });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Users.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
// Login
Router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  Router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
module.exports = Router;
