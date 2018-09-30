$.get("/rooms", function(rooms) {
    var dropDown = jQuery('#live-rooms');
    
    // For every room, add it as an option
    rooms.forEach(function(room) {
        dropDown.append(`<option>${room}</option>`);
    });
}).fail(function(err) {
    alert(err);
});

jQuery('#join-room-button').on('click', function(e) {
    e.preventDefault();

    var dropDown = jQuery('#live-rooms');
    var name = jQuery('[name=name]').val();
    var roomNameByInput = jQuery('[name=room]').val().toLowerCase();
    var roomNameByDropDown = jQuery('#live-rooms').val().toLowerCase();
    var decidedRoom; 

    // Decide the final name and room
    if(roomNameByInput === "" &&
        roomNameByDropDown === "") {
        alert("Select a room to join to!");
    } else if(roomNameByInput !== "") {
        decidedRoom = roomNameByInput;
    } else if (roomNameByInput === "" &&
               roomNameByDropDown !== "") {
        decidedRoom = roomNameByDropDown;
    }

    if(decidedRoom && name) {
        $.get("/users/unique", { 
            name: name,
            room: decidedRoom
        }, function(isUnique) {
            if(!isUnique) {
                alert(`There is a user in this chat room named ${name} already, try another nick name`);
            } else {
                window.location.href = `/chat.html?name=${name}&room=${decidedRoom}`;
            }
        }).fail(function(err) {
            alert(err);
        });
    } else {
        alert("Select a room and display name");
    }
});