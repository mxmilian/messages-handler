import React from 'react';

const Online = ({ users }) => (
  <div>
    <h3>Online users</h3>
    {users.map((user, i) => (
      <ul key={i}>
        <li>
          {user.name}
        </li>
      </ul>
    ))}
  </div>
);

export default Online;
