import React from 'react';

const Info = ({ room }) => (
  <div>
    <div>
      <h3>Room name: {room}</h3>
    </div>
    <div>
      <a href="/">exit chat</a>
    </div>
  </div>
);

export default Info;
