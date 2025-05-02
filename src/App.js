import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Storage } from '@aws-amplify/storage';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    try {
      console.log('Uploading file:', file.name);
      const result = await Storage.put(`sermons/${file.name}`, file, {
        metadata: { title, theme },
        contentType: file.type,
      });
      console.log('Upload result:', result);
      alert('Sermon uploaded successfully!');
      setFile(null);
      setTitle('');
      setTheme('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Sermon</h2>
      <input
        type="text"
        placeholder="Sermon Title"
        className="border p-2 mb-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Theme (e.g., Faith)"
        className="border p-2 mb-2 w-full"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />
      <input
        type="file"
        accept=".pdf,.txt,.mp3,.mp4"
        className="border p-2 mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={!file}
      >
        Upload
      </button>
    </div>
  );
}

export default withAuthenticator(App);