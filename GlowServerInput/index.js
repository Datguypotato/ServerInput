const port = 8888;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { debug } = require('console');
var express = require('express')
var player = require('./Classes/player');

var players = []

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/html/index.html');
});

var currenTime = new Date().toUTCString();

io.on('connect', (socket) =>
{
  console.log("---------------------------------------------");
  console.log(currenTime + " connection made");

  var webPlayer = new player();

  socket.on("requestID", () =>
  {
    socket.emit("returnID", webPlayer.id);
    console.log("Returning ID: " + webPlayer.id)
  });

  socket.on("spawnPlayer", receivedUsername =>
  {
    webPlayer.username = receivedUsername;

    socket.broadcast.emit("register", {id: webPlayer.id});
    socket.broadcast.emit("spawn", webPlayer);
  });
  

  socket.on("joy", (data) => {

    webPlayer.position.x = data.x;
    webPlayer.position.y = data.y;

    socket.broadcast.emit("joy", webPlayer);
  });
  
  socket.on("kickPlayer", (data) =>
  {
    console.log("Kicking player with this id: " + data);

    socket.broadcast.emit("checkKicked", data);
  });

  socket.on("playerColor", (data) =>
  {
    socket.broadcast.emit("checkColor", data);
  });

  socket.on("playerIsTagger", (data) =>
  {
    console.log("received playerIsTagger data " + data);
    socket.broadcast.emit("checkIsTagger", data);

  });
  
  socket.on('exit', (id) =>
  {
    console.log(currenTime + " Disconnecting player with this id " + id);

    webPlayer.id = id;

    socket.broadcast.emit("webplayerdisconnect", webPlayer)
  });
  
});



http.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});