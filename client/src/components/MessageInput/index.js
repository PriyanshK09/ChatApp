// client/src/components/MessageInput/index.js
import React, { useState } from "react";

import UploadFiles from "../UploadFiles";
import FilePreview from "../FilePreview";

const MessageInput = ({ sendMessage, startTyping, stopTyping, sendFile }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
      stopTyping();
    }

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        sendFile(file);
      });
      setFiles([]);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="message-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={startTyping}
        onBlur={stopTyping}
      />
      <button type="submit">Send</button>
      <UploadFiles sendFile={sendFile} />
      <div className="file-previews">
        {files.map((file, index) => (
          <FilePreview key={index} file={file} />
        ))}
      </div>
    </form>
  );
};

export default MessageInput;
