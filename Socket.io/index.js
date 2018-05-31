// import SocketManager from './SocketManager';
const SocketManager = require("./SocketManager")
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(9000);
function handler (req, res) {
  
}

this.socketmanager = new SocketManager(io)
