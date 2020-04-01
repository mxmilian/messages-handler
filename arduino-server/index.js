const io = require('socket.io-client');
const { Board, Led, LCD } = require('johnny-five');

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

const LCDdisplay = message => {
  const lcd = new LCD({
    controller: 'PCF8574'
  });

  const allMes =  message.substring(0, 32);
  const first = allMes.substring(0,18);
  const second = allMes.substring(18, 30);
  lcd.cursor(0, 0).print(first);
  lcd.cursor(1, 0).print(second);
  if(message.length >= 29) lcd.cursor(1, 13).print('...');

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
    LCDdisplay(arduinoMessage);
  });
});
