// client/src/components/PrivateChat/index.js
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrivateChat = ({ socket, user }) => {
  const [show, setShow] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('privateMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [socket]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && recipient) {
      const message = {
        sender: user.id,
        recipient: recipient,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      socket.emit('privateMessage', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Private Chat
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Private Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="message-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === user.id ? 'sent' : 'received'
                }`}
              >
                <span className="text">{message.text}</span>
                <span className="timestamp">{message.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Select a recipient"
              value={recipient || ''}
              onChange={handleRecipientChange}
            />
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PrivateChat;