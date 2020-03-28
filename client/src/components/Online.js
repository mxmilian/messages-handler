import React from 'react';

const Online = ({ users }) => (
  <div>
    <h3>Online users</h3>
    <ul>
      {users.forEach(el => console.log(el.name))}
    </ul>
  </div>
);

export default Online;
