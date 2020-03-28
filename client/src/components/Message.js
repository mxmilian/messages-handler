import React from 'react';

const Message = ({ name, message: {user, text} }) => {
  let isSend = false;
  const trimmedName = name.trim().toLowerCase();
  if(user === trimmedName) isSend = true;

  return (
    isSend ? (
      <div>
        <h1>{trimmedName}</h1>
        <h3>{text}</h3>
      </div>
      ) : (
      <div>
        <h1>{user}</h1>
        <h3>{text}</h3>
      </div>
      )
  );
};

export default Message;
