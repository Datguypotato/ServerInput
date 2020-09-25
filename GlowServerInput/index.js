const port = 8888;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express')
var player = require('./Classes/player');

var players = []

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/html/index.html');
});

io.on('connect', (socket) => 
{
  var webPlayer = new player();

  console.log("Client connected with id " + webPlayer.id);

  socket.broadcast.emit("register", {id: webPlayer.id});
  socket.broadcast.emit("spawn", webPlayer);

  socket.on("joy", (data) => {

    webPlayer.position.x = data.x;
    webPlayer.position.y = data.y;

    socket.broadcast.emit("joy", webPlayer);
    //console.log("Joystick position received: " + data.x + ", " + data.y + "\nfrom id: " + webPlayer.id);
  });
});

io.on('connection', (socket) => {

});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});