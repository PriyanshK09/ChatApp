// client/src/components/MessageList/index.js
import React from 'react';

const MessageList = ({ messages, typingUsers }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className="message">
          <span className="username">{message.username}</span>
          <span className="text">{message.text}</span>
          <span className="timestamp">{message.timestamp}</span>
        </div>
      ))}
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.map((user, index) => (
            <span key={index}>{user} is typing</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
