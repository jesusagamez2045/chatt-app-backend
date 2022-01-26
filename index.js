require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);


// configurar CORS
app.use(cors());

// directorio publico
app.use(express.static('public'));


const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: ["http://localhost:3001", "http://localhost:3000", "https://chatt-app-prueba.herokuapp.com"],
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

// la spa
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.listen(process.env.PORT, () => {
    console.log('listening on port' + process.env.PORT);
});