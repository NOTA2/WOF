module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host : 'smusmutest.cky1tln47zkv.ap-northeast-2.rds.amazonaws.com',
    user : 'smusmu',
    password : 'Ehdngus23$',
    database : 'wof'
  })
  conn.connect();

  return conn;
}
