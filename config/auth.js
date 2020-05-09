module.exports = {
    ensureAuthenticated: function(req, res, next) {
        //passport deta ai ye method as middle ware use kr k har isko protected bana sakty hn
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
  };