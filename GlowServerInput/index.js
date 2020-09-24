const port = 8888;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express')
//var player = require('./Classes/player');

//var players = []

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/html/index.html');
});

io.on('connection', (socket) => {

  //var webPlayer = new player();
  //var thisPlayerID = webPlayer.id;

  console.log("Client connected");
  socket.on("joy", (data) => {

    socket.broadcast.emit("joy", data);
    console.log("Joystick position received: " + data.x + ", " + data.y);
  });
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});