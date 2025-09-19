
import React, { useState } from 'react';
import axios from 'axios';

export default function BlogPostForm({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [blogs, setBlogs] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage('Title and description are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', userId);
    if (image) formData.append('image', image);
    try {
      await axios.post('/api/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Blog post created!');
      setTitle('');
      setDescription('');
      setImage(null);
      setPreview(null);
      fetchBlogs();
    } catch (err) {
      setMessage('Failed to create blog post.');
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`/api/blog/user/${userId}`);
      setBlogs(res.data.blogs);
    } catch (err) {
      setBlogs([]);
    }
  };

  React.useEffect(() => {
    if (userId) fetchBlogs();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {preview && (
          <div className="flex justify-center mt-2">
            <img src={preview} alt="preview" className="h-28 rounded shadow border" />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
          Post Blog
        </button>
      </form>
      {message && <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Blog Posts</h3>
        {blogs.length === 0 && <p className="text-gray-500">No blogs yet.</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map(blog => (
            <div key={blog.id} className="p-4 border rounded-lg bg-gray-50 shadow hover:shadow-md transition">
              <h4 className="font-bold text-lg text-blue-800 mb-1">{blog.title}</h4>
              <div className="text-xs text-gray-400 mb-2">{new Date(blog.createdAt).toLocaleString()}</div>
              {blog.image && (
                <img src={`http://localhost:5000${blog.image}`} alt="blog" className="h-32 w-full object-cover rounded mb-2 border" />
              )}
              <p className="text-gray-700 mb-2 line-clamp-3">{blog.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
