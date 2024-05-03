// client/src/components/UserList/index.js
import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h3>Online Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;