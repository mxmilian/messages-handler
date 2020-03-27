const express = require('express');
const http = require('http');
require('dotenv').config();
const socket = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { consoleHandle } = require('./middleware/middleware');
const { addUser, removeUser, getUser, getRoomUsers } = require('./Model/users');
const router = require('./routes/router');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(router);
app.use(consoleHandle);

io.on('connect', socket => {
  //Listening for new users
  socket.on('join', ({ name, room }, errorHandler) => {
    //Creating a new user
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return errorHandler({ error });
    //Adding a new user to the declared room
    socket.join(user.room);

    //Sending the message to new user
    socket.emit('message', {
      user: 'Friendly helpfully bot',
      text: `Hello ${user.name}, welcome to the room: ${user.room}`
    });

    //Sending the message to users except the joining user
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    errorHandler();
  });

  //Listening for new messages
  socket.on('sendMessage', (message, errorHandler) => {
    //Getting the message creator
    const user = getUser(socket.id);

    //Sending the message to the room
    io.to(user.room).emit('message', { user: user.name, text: message });
    errorHandler();
  });

  //Listening for disconnecting users
  socket.on('disconnect', ({ name }) => {
    console.log(`The ${name} disconnect`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}👂`);
});
