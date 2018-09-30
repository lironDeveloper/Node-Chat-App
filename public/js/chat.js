var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages-list');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    // Checking if the user in the bottom of the messages list
    // True - after new message arrives, it will autoscroll the
    // list down
    // False - nothing changes
    if(clientHeight +
       scrollTop + 
       newMessageHeight + 
       lastMessageHeight >= 
       scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
 }

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);

    // Cutom event that sets up the room
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log("No errors!")
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');


});

socket.on('newMessage', function (message) {

    var formattedTime = moment(message.createdAt).format('HH:mm');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    jQuery('#messages-list').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
})

socket.on('newLocationMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('HH:mm');
    var template = jQuery('#message-location-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages-list').append(html);
    scrollToBottom();    
})

jQuery('#message-form').on('submit', function(e) {
    // We want to override the default behavior - refreshing the page 
    // After submiting
    e.preventDefault();

    var messageTextbox =  jQuery('[name=message]');

    // jQuery('[name=message]') - selecting all objects
    // that their name attribute is message
    
    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert("Your browser doesn't support this feature");
    }

    locationButton.attr('disabled', 'disabled').text("Sending location");

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text("Send location");
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled').text("Send location");        
        alert("The app can not fetch your location")
    })
})