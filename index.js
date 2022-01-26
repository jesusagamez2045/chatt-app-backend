require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);


const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    let userName;

    socket.on('connected', (name) => {
        userName = name;
        socket.broadcast.emit('messages', { name: 'Server', message: `${name} Ha entrado en la sala` });
    });

    socket.on('message', (name, message) => {
        io.emit('messages', { name, message });
    });

    socket.on('disconnect', () => {
        io.emit('messages', { name: 'Server', message: `${userName} Ha abandonado la sala` });
    });
});

server.listen(process.env.PORT, () => {
    console.log('listening on port' + process.env.PORT);
});