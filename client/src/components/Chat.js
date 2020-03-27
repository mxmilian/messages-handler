import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:1337';

  useEffect(() => {
    const { name, room } = querystring.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, () => {
    });

    return () => {
      socket.emit('disconnect', { name });
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  return (
    <div>
    </div>
  );
};

export default Chat;
