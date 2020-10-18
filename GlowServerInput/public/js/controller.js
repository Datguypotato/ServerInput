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

var ghostColorLabel = document.getElementById("ghostColorLabel");
var isTaggerLabel = document.getElementById("isTaggerLabel");


window.onload = function()
{
    button.onclick = JoinServer;
}

function JoinServer(e)
{
    if(inputfield.value.length > 3)
    {
        Socket.emit("spawnPlayer", inputfield.value);

        button.style.display = "none";
        errorLabel.textContent = "";
    }
    else
    {
        errorLabel.textContent = "Name need to be atleast 4 characters or more"
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

    Socket.on("checkColor", (data) =>
    {
        if(data[0] == _ID)
        {
            red = data[1] * 255;
            blue = data[2] * 255;
            green = data[3] * 255;
            errorLabel.style.color = rgb(red, blue, green);
            errorLabel.textContent = "Your ghost color";
        }
    });

    Socket.on("checkIsTagger", data =>
    {   
        console.log("received data " + data);
        if(data[0] == _ID)
        {
            if(data[1] == true)
            {
                isTaggerLabel.textContent = "You are the tagger";
            }
            else
            {
                isTaggerLabel.textContent = "You are not the tagger";
            }
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

function rgb(r, g, b){
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(",r,",",g,",",b,")"].join("");
  }

window.onbeforeunload = function(e)
{
    Socket.emit('exit', _ID);
}


