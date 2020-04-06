const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let PORT = process.env.PORT || 3000;
let HOSTNAME = process.env.HOSTNAME || `http://localhost:${PORT}`;
const gameController = require('./controllers/game.controller.js');
global.gameStore = {};

app.set('view engine', 'ejs');
app.use('/assets', express.static('public/assets'))

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/:roomId', gameController.gamePage);
app.param('roomId', gameController.roomById)

io.on('connection', (client) => {
  console.log('client connected');

  client.on('PLAYER_MOVE', (data) => {
    io.emit('PLAYER_MOVE', data);
  })

  client.on('disconnect', () => {
    console.log('disconnected');
  });
})

http.listen(PORT, () => {
  console.log(`Server started at: ${ HOSTNAME }`);
});