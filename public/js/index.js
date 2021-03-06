var socket = io();

socket.on('connect', function () {
    console.log("Connected:", socket);
});

socket.on('disconnect', function () {
    console.log("Disconnected:", socket);
});

socket.on('newMessage', function (message) {
    console.log("New Message", message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}: `)
    a.attr('href', message.url);
    li.append(a);

    $('#messages').append(li);
});

$(document).ready(function(){
    $('#message-form').on('submit', function(e){
        console.log("CLICK");
        e.preventDefault();
        socket.emit('createMessage', {
            from: 'User',
            text: $('[name="message"]').val()
        }, function () {

        });
    });

    var locationButton = $('#send-location');
    locationButton.on('click', function () {
        if(!navigator.geolocation){
            return alert('Geolocation not supported by your browser.');
        }

        navigator.geolocation.getCurrentPosition(function(position){
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function(){
            alert('Unable to fetch location.');
        });
    });
});
