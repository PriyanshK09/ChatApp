// client/src/components/ChatWindow/index.js
import React, { useState, useEffect, useRef } from 'react';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';

const ChatWindow = ({ socket, room }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', (users) => {
      setTypingUsers(users);
    });

    socket.on('roomHistory', (history) => {
      setMessages(history);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('roomHistory');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (message) => {
    socket.emit('sendMessage', { room, message });
  };

  const startTyping = () => {
    socket.emit('startTyping', room);
  };

  const stopTyping = () => {
    socket.emit('stopTyping', room);
  };

  return (
    <div className="chat-window">
      <h2>Room: {room}</h2>
      <MessageList messages={messages} typingUsers={typingUsers} />
      <MessageInput
        sendMessage={sendMessage}
        startTyping={startTyping}
        stopTyping={stopTyping}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;