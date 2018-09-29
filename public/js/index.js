var socket = io();

socket.on('connect', function() {
    console.log("Connected to server")
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('New message arrived!', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages-list').append(li);
});

jQuery('#message-form').on('submit', function(e) {
    // We want to override the default behavior - refreshing the page 
    // After submiting
    e.preventDefault();

    // jQuery('[name=message]') - selecting all objects
    // that their name attribute is message
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(data) {
        console.log(data);
    });
});