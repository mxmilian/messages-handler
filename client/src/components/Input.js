import React from 'react';

const Input = ({ message, setMessage, sendMessage }) => (
  <form>
    <input
      type="text"
      placeholder="Type a command for arduino"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
    />
    <button onClick={sendMessage}>Send</button>
  </form>
);

export default Input;
