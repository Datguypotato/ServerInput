var joy = new JoyStick('joyDiv');
var position = {"x": 0, "y": 0};
var currPosition = {"x": 0, "y": 0};
const Socket = io();
var _ID;


window.onbeforeunload = function(e)
{
    Socket.emit('exit', _ID);
}

Socket.on("connect", () =>
{
    console.log("Connected");

    Socket.on("GetID", (data) =>
    {
        console.log(data);
        _ID = data
    });
});


setInterval(function()
{ 
    position.x = joy.GetX();
    position.y = joy.GetY();

    if(currPosition.x != position.x || currPosition.y != position.y)
    {
        //console.log("my id is " + id);
        console.log("Joystick position: " + position.x + ", " + position.y); 

        Socket.emit('joy', position);
    }
    currPosition.x = position.x;
    currPosition.y = position.y;

}, 100);
