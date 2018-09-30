var path = require('path');
const http = require('http');
var express = require('express');
var socketIO = require('socket.io');
const _ = require('lodash');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// Listen to event of user connection
io.on('connection', (socket) => {

    // Listens to event of joining to new room
    socket.on('join', (params, callback) => {

        // Validation for params
        if(!isRealString(params.room) || !isRealString(params.name)) {
            callback("Name and room are required");
        }

        socket.join(params.room);
        // to leave a room - socket.leave(name of room);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // Updating the client side of the users list in the 
        // current room
        io.to(params.room).emit('updateUserList', 
                                users.getUserList(params.room));

        // Sending message to all room to acknowlede new user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} joind the room`));

        // Sending message to the user who joined the room
        socket.emit('newMessage', generateMessage("Admin", `Hello ${params.name}, welcome to room ${params.room}`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        // socket.emit - emits an event to a single connection
        // io.emit - emits an event to all opened connections, in a room, use io.to('room name').emit
        // socket.broadcast.emit - emits an event to all opened connection except of himself, in a room, use socket.broadcast.to('room name').emit

        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));        
        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {

        var user = users.getUser(socket.id);
        
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longtitude))
        }
    })

    // Listen to user disconnection
    socket.on('disconnect', () => {

        // Removing the leaving user from the users list
        var userLeft = users.removeUser(socket.id);

        if(userLeft) {
            // updating users list after user left
            io.to(userLeft.room).emit('updateUserList', users.getUserList(userLeft.room));

            // Telling everybody the user left
            io.to(userLeft.room).emit('newMessage', generateMessage("Admin", `${userLeft.name} left the chat room`));            
        }
    });
});

// Middleware to serve public directory
app.use(express.static(publicPath));

// Getting all current live rooms
app.get('/rooms', (req, res) => {
    res.send(users.getAllRooms());
});

// Checking the uniqueness of the display name in chat room
app.get('/users/unique', (req, res) => {
    var currDisplayName = req.query.name;
    var currDecidedRoom = req.query.room;

    console.log(currDisplayName, currDecidedRoom);
    if(_.includes(users.getUserList(currDecidedRoom), currDisplayName)){
        res.send(false);
    } else {
        res.send(true);
    }
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});