// client/src/components/FilePreview/index.js
import React from 'react';

const FilePreview = ({ file }) => {
  const renderPreview = () => {
    if (file.type.includes('image')) {
      return <img src={URL.createObjectURL(file)} alt={file.name} />;
    } else if (file.type.includes('video')) {
      return (
        <video controls>
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      );
    } else if (file.type.includes('audio')) {
      return (
        <audio controls>
          <source src={URL.createObjectURL(file)} type={file.type} />
        </audio>
      );
    } else {
      return <span>{file.name}</span>;
    }
  };

  return <div className="file-preview">{renderPreview()}</div>;
};

export default FilePreview;