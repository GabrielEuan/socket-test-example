'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

var messages = [{
    author: "Carlos Padillo",
    text: "hola",
}];

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
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);