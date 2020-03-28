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
  socket.on('join', ({ name, room }, callback) => {
    //Creating a new user
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callback({ error });
    //Adding a new user to the declared room
    socket.join(user.room);

    //Sending the message to new user
    socket.emit('message', {
      user: 'Friendly bot',
      text: `Hello ${user.name}, welcome to the room: ${user.room} 👋😎 
      type !help if you need some help`
    });

    //Sending the message to users except the joining user
    socket.broadcast
      .to(user.room)
      .emit('message', {
        user: 'Friendly bot',
        text: `${user.name} has joined!`
      });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    callback();
  });

  //Listening for new messages
  socket.on('sendMessage', (message, callback) => {
    //Getting the message creator
    const user = getUser(socket.id);

    //Sending the message to the room
    io.to(user.room).emit('message', { user: user.name, text: message });

    if (message === '!help') {
      socket.emit(user.room).emit('message', {
        user: 'Friendly bot',
        text: `messages handler created by https://github.com/mxmilian, type !commands to see the available commands ✍️`
      });
    }

    if(message === '!commands') {
      socket.emit(user.room).emit('message', {
        user: 'Friendly bot',
        text: `These commands are used to handle arduino: '!led'`
      });
    }

    callback();
  });

  //Listening for disconnecting users
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Friendly bot',
        text: `${user.name} just has left the chat.😢`
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}👂`);
});
