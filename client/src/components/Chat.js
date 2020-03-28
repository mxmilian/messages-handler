import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import io from 'socket.io-client';
import Info from './Info';
import Input from './Input';
import Messages from './Messages';
import Online from './Online';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const ENDPOINT = 'localhost:1337';

  useEffect(() => {
    const { name, room } = querystring.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, () => {});

    return () => {
      socket.emit('disconnect', { name });
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
      console.log(messages);
    });
  }, [messages]);

  useEffect( () => {
    socket.on('roomData', ({users}) => {
      setUsers(users);
      console.log(users);
    })
  },[users]);

  const sendMessage = e => {
    e.preventDefault();
    if (message) socket.emit('sendMessage', message, () => setMessage(''));
  };
  console.log(messages, message);

  return (
    <div>
      <div>
        <Info room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <Online users={users}/>
    </div>
  );
};

export default Chat;
