const PORT = 3000;

var conn = require('./config/db')();
var app = require('./config/express')();
var passport = require('./config/passport')(app);

var auth = require('./routes/auth')(passport);
app.use('/auth/', auth);


var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('connection');


  socket.on('abc', (data) => {
    console.log('hello');
    console.log(data);
     socket.emit('abc', '병신드류ㅠ');
  })


  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

server.listen(PORT, function(){
  console.log('listening on :' + PORT);
});
