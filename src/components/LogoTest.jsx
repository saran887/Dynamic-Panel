
import React, { useState } from 'react';
import axios from 'axios';

export default function LogoTest({ userId }) {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch logo for user
  const fetchLogo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/auth/logo/${userId}`);
      setLogo(res.data.logoPath);
      setMessage('');
    } catch (err) {
      setLogo(null);
      setMessage('No logo found for this user.');
    }
    setLoading(false);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Upload logo for user
  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.logo.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('userId', userId);
    try {
      await axios.post('/api/auth/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Logo uploaded!');
      fetchLogo();
    } catch (err) {
      setMessage('Upload failed.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Logo</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Logo'}
          </button>
        </form>
        {preview && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Preview:</p>
            <img src={preview} alt="preview" className="mx-auto mt-2 rounded shadow h-16" />
          </div>
        )}
        <button
          onClick={fetchLogo}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Current Logo'}
        </button>
        {logo && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Current Logo:</p>
            <img src={`http://localhost:5000${logo}`} alt="logo" className="mx-auto mt-2 rounded shadow h-16" />
            <div className="text-xs text-gray-400 mt-1">{logo.split('.').pop().toUpperCase()} file</div>
          </div>
        )}
        {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
      </div>
    </div>
  );
}
