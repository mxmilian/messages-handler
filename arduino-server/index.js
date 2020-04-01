const io = require('socket.io-client');
const { Board, Led } = require('johnny-five');

const ENDPOINT = 'https://messages-handler.herokuapp.com/';
const socket = io(ENDPOINT);
const board = new Board();

socket.on('connect', () => {
  console.log(`Connected with ${ENDPOINT}`);
});

const name = 'ardunio-bot';
const room = 'arduino';

let rainbow = ["FF0000"];


socket.emit(
  'join',
  {
    name: name,
    room: room
  },
  () => {}
);

const validHEX = hex => {
  if (!hex || typeof hex !== 'string') return false;
  if (hex.substring(0, 1) === '#') hex = hex.substring(1);
  switch (hex.length) {
    case 3:
      return /^[0-9A-F]{3}$/i.test(hex);
    case 6:
      return /^[0-9A-F]{6}$/i.test(hex);
    case 8:
      return /^[0-9A-F]{8}$/i.test(hex);
    default:
      return false;
  }
  return false;
};

board.on('ready', () => {
  const led = new Led(11);
  const ledRGB = new Led.RGB({
    pins: {
      red: 3,
      green: 5,
      blue: 6
    }
  });

  socket.on('message', message => {
    const arduinoMessage = message.text.toLowerCase();

    if (arduinoMessage === '!ledon') {
      led.fadeIn();

      board.wait(100, () => {
        led.fadeOut();
      });
    }
    if (arduinoMessage === '!ledoff') {
      led.off();
    }
    if (arduinoMessage.startsWith('!led') && arduinoMessage.length ===  11){
      const hex = arduinoMessage.substring(4,11);
      if(validHEX(hex)){
        ledRGB.off();
        rainbow.push(hex);
        ledRGB.color(hex);
        console.log(`hex: ${hex}`);
      }
    }
    if(arduinoMessage === '!ledrainbow'){
      ledRGB.off();
      let index = 0;
      console.log(rainbow.length);
      board.loop(1000, () => {
        ledRGB.color(rainbow[index++]);
        if (index === rainbow.length) {
          index = 0;
        }
      });
    }
  });
});
