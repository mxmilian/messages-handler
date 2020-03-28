const io = require('socket.io-client');

const ENDPOINT = 'https://messages-handler.herokuapp.com/';
const socket = io(ENDPOINT);

socket.on('connect', () => {
  console.log(`Connected with ${ENDPOINT}`);
});

socket.emit('join', {
  name: 'xD',
  room: 'room'
}, () => {});

socket.on('message',  message => {
  console.log(message.text);
});