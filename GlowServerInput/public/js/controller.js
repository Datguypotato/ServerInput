var joy = new JoyStick('joyDiv');
var position = {"x": 0, "y": 0};
var currPosition = {"x": 0, "y": 0};
const Socket = io();
var _ID;

Socket.on('connect', () =>
{
    Socket.emit("requestID");

    Socket.on("returnID", (ID) =>
    {
        _ID = ID;
        console.log("received ID: " + ID);
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
});

window.onbeforeunload = function(e)
{
    Socket.emit('exit', _ID);
}


