var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 3101;

app.use(express.static('public'));

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

    // Start listening for mouse move events
    socket.on('drawing', function (data) {

        // This line sends the event (broadcasts it)
        // to everyone except to the origin client.
        socket.broadcast.emit('drawing', data);
    });
});

server.listen(port, () =>{
	console.log("server running in port: "+ port);
});

