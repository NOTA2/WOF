module.exports = function(passport){
  var conn = require('../config/db')();
  var hasher = require('pbkdf2-password')();
  var route = require('express').Router();

  route.post('/register', (req, res) => {
    var sql = 'SELECT * fROM users WHERE authId=?'
    conn.query(sql, ['local:'+req.body.username], (err, results) =>{
      if(err){
        console.log(err);
        return res.json({});
      }
      if(results[0] != undefined)  //검색 결과가 있을 시 리턴
        return res.json({'state':'overlap'});
      else{
        hasher({password : req.body.password}, (err, pass, salt, hash) => {
          var user = {
            authId : 'local:'+req.body.username,
            username : req.body.username,
            name : req.body.name,
            password : hash,
            salt : salt
          }

          var sql = 'INSERT INTO users SET ?';
          conn.query(sql, user, (err, results) => {
            if(err){
              console.log(err);
            } else{
              delete user.password;
              delete user.salt;
              res.json(user);
            }
          });
        });
      }
    });
  });

  route.post('/displayName', (req, res) =>{
    //닉네임이 있는지 확인
    var sql = 'SELECT * fROM users WHERE displayName=?'
    conn.query(sql, [req.body.displayName], (err, results) =>{
      if(err){
        console.log(err);
        return res.json({'state':'err'});
      }
      //검색 결과가 없을 시
      if(results[0] == undefined){
        var sql = 'UPDATE users SET displayName=? WHERE authId=?'
        conn.query(sql, [req.body.displayName, req.body.authId], (err, results) =>{
          if(err){
            console.log(err);
            return res.json({'state':'err'});
          }
          else{
            return res.json({'state':'true'});
          }
        });
      }
      //검색 결과가 있을 시
      else{
        return res.json({'state':'overlap'});
      }
    });
  })


  route.post('/login', passport.authenticate('local'),
    function (req, res) {
      delete req.user.password;
      delete req.user.salt;
      return res.json(req.user);
    });

  route.get('/logout', (req, res) => {
    req.logout();
    req.session.save(() => {
    })
  })

  // route.post('/facebook', passport.authenticate('facebook', {scope : 'email'}));
  //
  //
  // route.get('/facebook/callback',
  //   passport.authenticate('facebook'),
  //   function (req, res) {
  //     return res.json(req.user);
  // });

  return route
};
