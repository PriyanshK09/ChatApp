// client/src/components/Sidebar/index.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ socket }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    socket.on('rooms', (roomList) => {
      setRooms(roomList);
    });

    socket.on('newRoom', (room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    });

    return () => {
      socket.off('rooms');
      socket.off('newRoom');
    };
  }, [socket]);

  const joinRoom = (roomName) => {
    socket.emit('joinRoom', roomName);
  };

  const createRoom = () => {
    if (newRoomName.trim() !== '') {
      socket.emit('createRoom', newRoomName);
      setNewRoomName('');
    }
  };

  return (
    <div className="sidebar">
      <h2>Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room}>
            <NavLink to={`/room/${room}`} onClick={() => joinRoom(room)}>
              {room}
            </NavLink>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="New Room"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={createRoom}>Create</button>
      </div>
      <div>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;