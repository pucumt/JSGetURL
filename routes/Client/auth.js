module.exports = {
checkLogin: function(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录!'); 
      res.redirect('/login');
      return;
    }
    next();
  },
  checkNotLogin: function(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!'); 
      res.redirect('back');//返回之前的页面
      return;
    }
    next();
  },
};