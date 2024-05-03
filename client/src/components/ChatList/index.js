// client/src/components/ChatList/index.js
import React from 'react';

const ChatList = ({ rooms, joinRoom }) => {
  return (
    <div className="chat-list">
      <h3>Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room} onClick={() => joinRoom(room)}>
            {room}
          </li>
        ))}
      </ul>
    </div>
  );
};
