const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );
  if (existingUser) {
    return {
      error: 'This username is already taken 😔'
    };

    const user = {
      id,
      name,
      room
    };
    users.push(user);

    return {
      user
    };
  }
};
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = id => users.find(user => user.id === id);
const getRoomUsers = room => users.filter(user => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers
};
