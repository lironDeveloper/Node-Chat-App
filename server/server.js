var path = require('path');
const http = require('http');
var express = require('express');
var socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Listen to event of user connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Send greeting message to the new joined user
    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app!"));

    // Send new user joined message to all connected users
    socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined the chat room!"));

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        // socket.emit - emits an event to a single connection
        // io.emit - emits an event to all opened connections
        // socket.broadcast.emit - emits an event to all opened connection except of himself
        io.emit('newMessage', generateMessage(message.from, message.text));        
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("Admin", coords.latitude, coords.longtitude))
    })

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