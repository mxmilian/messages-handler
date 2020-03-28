import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('arduino');
  return(
    <div>
      <h1>Do something with arduino!</h1>
      <input placeholder="Name" type="text" onChange={e => setName(e.target.value)} />
      <select onChange={e => setRoom(e.target.value)}>
        <option value="arduino">Arduino</option>
        <option value="talk">Just talk</option>
      </select>
      <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
        <button type="submit">Join to arduino room</button>
      </Link>
    </div>
  )
};

export default Join;
