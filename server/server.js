var path = require('path');
const http = require('http');
var express = require('express');
var socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Listen to event of user connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Listen to user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected from server');
    });
});


// Middleware to serve public directory
app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});