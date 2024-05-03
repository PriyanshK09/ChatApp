// client/src/components/UploadFiles/index.js
import React, { useState } from 'react';

const UploadFiles = ({ sendFile }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = () => {
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        sendFile(file);
      });
      setFiles([]);
    }
  };

  return (
    <div className="upload-files">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
      />
      <button onClick={handleUpload} disabled={files.length === 0}>
        Upload
      </button>
    </div>
  );
};

export default UploadFiles;