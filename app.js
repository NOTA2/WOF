const PORT = 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var conn = require('./config/db')();
var app = require('./config/express')();
var passport = require('./config/passport')(app);

var auth = require('./routes/auth')(passport);
app.use('/auth/', auth);


io.on('connection', (socket) => {
  console.log('connection');


  socket.on('testBeep', (data) => {
     socket.emit('testBeep', 'OK');
  })


  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

server.listen(PORT, function(){
  console.log('listening on :' + PORT);
});
