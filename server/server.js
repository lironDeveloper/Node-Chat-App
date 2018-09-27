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

    // Send greeting message to the new joined user
    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat app!",
        createdAt: new Date().getTime()
    });

    // Send new user joined message to all connected users
    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: "New user joined the chat room!",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log(message);
        // socket.emit - emits an event to a single connection
        // io.emit - emits an event to all opened connections
        // socket.broadcast.emit - emits an event to all opened connection except of himself
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });        
    });

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