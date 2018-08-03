module.exports = function(app){
  var conn = require('./db')();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = require('pbkdf2-password')();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy((username, password, done) => {

    var sql = 'SELECT * FROM users WHERE authId=?';

    conn.query(sql, ['local:'+username], (err, results) => {
      if(err)
        done(null, false);

      var user = results[0];

      if(!user)
        return done(null, false);

      hasher({password : password, salt : user.salt}, (err, pass, salt, hash) => {
        if(hash === user.password)
          done(null, user);
        else
          done(null, false);
      });
    });
  }));

  // passport.use(new FacebookStrategy({
  //     clientID: "252280288933816",
  //     clientSecret: "4482c8f9edc683d0f374c190b5df55e6",
  //     callbackURL: "http://13.209.6.8:3000/auth/facebook/callback",
  //     profileFields : ['id', 'emails', 'gender', 'link', 'locale',
  //     'name', 'timezone', 'updated_time', 'verified', 'displayName']
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //
  //     var authId = 'facebook:' + profile.id;
  //     var sql = 'SELECT * FROM users WHERE authId=?'
  //
  //     conn.query(sql, [authId], (err, results) =>{
  //       console.log('쿼리문');
  //       //이미 등록되어 있으면.
  //       if(results.length > 0){
  //         done(null, results[0]);
  //       }
  //       else{
  //         var sql = 'INSERT INTO users SET ?';
  //
  //         var newuser = {
  //           'authId': authId,
  //           'username' : profile.emails[0].value,
  //           'name' : profile.displayName
  //         }
  //
  //         conn.query(sql, newuser, (err, results) =>{
  //           if(err){
  //             console.log(err);
  //             done('Error');
  //           }
  //           else{
  //             done(null, newuser);
  //           }
  //         });
  //       }
  //     });
  //   }
  // ));

  passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user.authId);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserializeUser');
    var sql = 'SELECT * fROM users WHERE authId=?'

    conn.query(sql, [id], (err, results) =>{
      if(err){
        console.log(err);
        return done('There is no user');
      }

      else
        return done(null, results[0])
    });
  });

  return passport
}
