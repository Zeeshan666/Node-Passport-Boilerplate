const express = require('express')
require('dotenv').config()
const app = express();
const expressLayout =require('express-ejs-layouts')
const PORT =process.env.PORT|5000
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');

//db string
const connect = mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true});
connect.then(()=>console.log("db connected successfully")).catch((err)=>console.log(err))
//views
app.use(expressLayout)
app.set('view engine','ejs')
// Passport Config
require('./config/passport')(passport);
//BodyParser
app.use(express.urlencoded({extended:false}))
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  //connect flash
  app.use(flash())
  // Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/user'))

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})