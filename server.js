'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

var messages = [{
    author: "Carlos Padillo",
    text: "hola",
}];

//var colors = [ "red", "blue", "black", "white", "cyan", "pink", "yellow", "green", "gray"];

let location = [];

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));

    socket.emit('messages', messages);

    socket.on('new-message', function(data) {
        messages.push(data);
        io.sockets.emit('messages', messages);
    })

    socket.on('change-color', function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        io.sockets.emit('color', color);
    })

    socket.on('lock-item', function(data) {
        var occuped_location = location.findIndex(x => x.area === data.area && x.date === data.date);
        if (!occuped_location) {
            location.push(data);
            return "Haz ocupado la locación para la fecha solicitada";
        } else {
            return "La locación está siendo usada por otro usuario";
        }
        //io.sockets.emit('messages', messages);
    });

    socket.on('unlock-item', function(data) {
        var index = location.findIndex(x => x.area === data.area && x.date === data.date);
        location.splice(index, 1);
        return "La locación fue liberada para el uso de otro usuario";
    });
});

/* setInterval(() => io.emit('time', new Date().toTimeString()), 1000); */