const express = require('express')
const Router =express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

Router.get('/',(req,res)=>{
    res.render('welcome')
})

// Dashboard
Router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
module.exports=Router