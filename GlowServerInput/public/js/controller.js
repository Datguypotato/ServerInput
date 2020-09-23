var joy = new JoyStick('joyDiv');
var position = {"x": 0, "y": 0};
var socket = io();


setInterval(function()
{ 
    position.x = joy.GetX();
    position.y = joy.GetY();
    console.log("Joystick position: " + position.x + ", " + position.y); 
    io.emit('joy', position);
}, 100);