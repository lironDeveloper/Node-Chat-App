var socket = io();

socket.on('connect', function() {
    console.log("Connected to server")
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('HH:MM');

    console.log('New message arrived!', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages-list').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('HH:MM');
    
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);

    jQuery('#messages-list').append(li);
})

jQuery('#message-form').on('submit', function(e) {
    // We want to override the default behavior - refreshing the page 
    // After submiting
    e.preventDefault();

    var messageTextbox =  jQuery('[name=message]');

    // jQuery('[name=message]') - selecting all objects
    // that their name attribute is message
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert("Geolocation not supported by your broseer")
    }

    locationButton.attr('disabled', 'disabled').text("Sending location...");

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text("Send location");
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled').text("Send location");        
        alert("Unable to fetch location")
    })
})