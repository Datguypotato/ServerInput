const port = 8888;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var express = require('express')
var player = require('./Classes/player');
var unitySocket;

var players = []

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/html/index.html');
});

var currenTime = new Date().toUTCString();

io.on('connect', (socket) =>
{
  console.log("---------------------------------------------");

  var webPlayer = new player();


  console.log(currenTime + " Client connected with id " + webPlayer.id);
  console.log("returning id " + webPlayer.id)
  socket.emit("GetID", (webPlayer.id));

  if(unitySocket != null)
  {
    socket.broadcast.emit("register", {id: webPlayer.id});
    socket.broadcast.emit("spawn", webPlayer);

    socket.on("joy", (data) => {

      webPlayer.position.x = data.x;
      webPlayer.position.y = data.y;
  
      unitySocket.broadcast.emit("joy", webPlayer);
      console.log("Joystick position received: " + data.x + ", " + data.y + "\nfrom id: " + webPlayer.id);
    });
  
  }

  socket.on('exit', (id) =>
  {
    console.log(currenTime + " Disconnecting player with this id " + id);
    socket.broadcast.emit('disconnected', id)
  });

});

io.on('connection', (socket) => {
  unitySocket = socket;
  console.log(currenTime + " Unity connected");
});

http.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});