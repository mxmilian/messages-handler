import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import socket from 'socket.io-client';
const Chat = ({ location }) => {
  useEffect(() => {
    const data = querystring.parse(location.search);
    console.log(location.search);
    console.log(data);
  });

  return <h1>Chat</h1>;
};

export default Chat;
