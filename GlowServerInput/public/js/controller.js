var joy = new JoyStick('joyDiv');
var position = {"x": 0, "y": 0};
var currPosition = {"x": 0, "y": 0};
const Socket = io();
var _ID;

// window.addEventListener("resize", function () {
//      Here, remove previous joystick
//     joy = new JoyStick('joyDiv');
//     position = {"x": 0, "y": 0};
//     currPosition = {"x": 0, "y": 0};
// });

var button = document.getElementById("joinButton");
var inputfield = document.getElementById("inputfield");
var errorLabel = document.getElementById("errorLabel");

window.onload = function()
{
    button.onclick = JoinServer;
}

function JoinServer(e)
{
    console.log("which output: " + e.which + " keycoded output: " + e.keyCode);
    var keypressed = e.which || e.keyCode;

    {

        if(inputfield.value.length > 3)
        {
            Socket.emit("spawnPlayer", inputfield.value);
    
            //disable all the things needed to join and enable the joystick
            //inputfield.style.display = "none";
            button.style.display = "none";
            //usernameLabel.style.display = "none";
            errorLabel.textContent = "";

            // add ingame status
    
            //document.getElementById("joyDiv").style.display = "block";
        }
        else
        {
            errorLabel.textContent = "Name need to be atleast 4 characters or more"
        }
    }
}

Socket.on('connect', () =>
{
    Socket.emit("requestID");

    Socket.on("returnID", (ID) =>
    {
        _ID = ID;
        console.log("received ID: " + ID);
    });

    Socket.on("checkKicked", (data) =>
    {
        if(_ID == data)
        {
            errorLabel.textContent = "You have been kicked from te server";
            console.log("you have been kicked");
        }
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


