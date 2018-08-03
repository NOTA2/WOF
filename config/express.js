module.exports = function(){
  var app = require('express')();
  var session = require('express-session');
  var bodyParser = require('body-parser');
  var MySQLSessionStore = require('express-mysql-session')(session);

  app.set('views', './views/mysql');
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true }));
  app.use(session({
    secret : '##@)^#*#^(#^#*^#^%$###@#@!@#$%rlaehdgusdmsanjsrkfmfgkfwnfdksmsshadlek)',
    resave : false,
    saveUninitialized : true,
    store : new MySQLSessionStore({
      host : 'smusmutest.cky1tln47zkv.ap-northeast-2.rds.amazonaws.com',
      port : 3306,
      user : 'smusmu',
      password : 'Ehdngus23$',
      database : 'wof'
    })
  }));

  return app;
}
