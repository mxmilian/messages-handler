const io = require('socket.io-client');
const five = require('johnny-five');

const ENDPOINT = 'https://messages-handler.herokuapp.com/';
const socket = io(ENDPOINT);
const board = new five.Board();

socket.on('connect', () => {
  console.log(`Connected with ${ENDPOINT}`);
});

socket.emit('join', {
  name: 'ardunio-bot',
  room: 'room'
}, () => {});

board.on('ready', () => {
  const led = new five.Led(12);
  socket.on('message',  message => {
    const mess = message.text.toLowerCase();
    if(mess === '!ledon'){
      led.on();
    }
    if(mess === '!ledoff') {
      led.off();
    }
  });
});
