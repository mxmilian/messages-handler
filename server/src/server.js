const express = require('express');
const http = require('http');
require('dotenv').config();
const socket = require('socket.io');
const morgan = require('morgan');
const helmet = require('helmet');
const { consoleHandle } = require('./middleware/middleware');
const { addUser, removeUser, getUser, getRoomUsers } = require('./users');
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use(consoleHandle);

io.on('connect', socket => {
  socket.on('join', ({ name, room }, errorHandler) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return errorHandler({ error });
    socket.join(user.room);
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`
    });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`})
    socket.on('disconnect', ({ name }) => {
      console.log(`The ${name} disconnect`);
    });
    errorHandler();
  });

});

app.route('/').get((req, res) => {
  try {
    res.status(200).json({
      status: 'access',
      data: {
        message: 'nice! job!'
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e.message
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}👂`);
});
