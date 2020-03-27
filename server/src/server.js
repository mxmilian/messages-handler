const express = require('express');
const http = require('http');
require('dotenv').config();
const socket = require('socket.io');
const morgan = require('morgan');
const helmet = require('helmet');
const { consoleHandle } = require('./middleware/middleware');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use(consoleHandle);

io.on('connect', socket => {
  console.log('New connection 😳');

  socket.on('join', ({ name, room }, errorHandler) => {
    console.log(name, room);
    const error = true;

    if (error) {
      errorHandler({ error: 'error' });
    }
  });

  socket.on('disconnect', ({ name }) => {
    console.log(`The ${name} disconnect`);
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
