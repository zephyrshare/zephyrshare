'use client';

import React, { useState } from 'react';

// Change here: Explicitly type the useState for selectedFile
export default function S3FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);

      console.log('Selected file:', e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus('');

    try {
      // disable CORS
      const presignedUrl = await fetch('https://jfuusa39s4.execute-api.us-east-1.amazonaws.com/file/upload', {
        headers: {
          'authorization': 'Bearer 70b9a1e6-42f0-41fc-9e35-767e1e57a910',
        },
        mode: 'no-cors',
      })
        .then((res) => res.json())
        .then((data) => data.presignedUrl);

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null); // Consider if you really want to reset the file selection after upload
    }
  };

  return (
    <div>
      <input type="file" accept="*" onChange={handleFileInput} />
      <button onClick={uploadFile} disabled={isUploading}>
        Upload to S3
      </button>
      {isUploading && <p>Upload progress:</p>}{' '}
      {/* Note: This will not update without an alternative progress mechanism */}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
