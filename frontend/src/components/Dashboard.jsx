import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const tagColors = [
  'bg-pink-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200',
  'bg-purple-200', 'bg-pink-300', 'bg-yellow-300', 'bg-green-300'
];

const API_URL = "http://localhost:8080";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');

  const fileInputRef = useRef(null);


  useEffect(() => {

    const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

    setLoggedInUser(localStorage.getItem('loggedInUser'));
    fetchImages();
    fetchTags();
  }, []);

  const fetchImages = async (search = '') => {
    try {
      const res = await fetch(`${API_URL}/products${search ? `?search=${search}` : ''}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
},
      });
      const data = await res.json();
      setImages(data);
    } catch (err) {
      handleError(err.message || "Something went wrong")
;
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/products/tags`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setAllTags(data);
    } catch (err) {
      handleError(err.message || "Something went wrong")
;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return handleError('Select an image first');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      if (tags) formData.append('tags', tags);

      const res = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      handleSuccess('Image uploaded!');
      setSelectedImage(null);
      setTags('');
      fileInputRef.current.value = "";
      fetchImages();
      fetchTags();
    } catch (err) {
      handleError(err.message || "Something went wrong")
;
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      handleSuccess('Image deleted');
      fetchImages();
      fetchTags();
    } catch (err) {
      handleError(err.message || "Something went wrong")
;
    }
  };

  const handleSearch = () => {
    const search = searchTerm.split(',').map(t => t.trim()).filter(t => t !== '').join(',');
    fetchImages(search);
  };

  const handleFilter = (tag) => {
    fetchImages(tag);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully!');
    setTimeout(() => window.location.href = '/login', 500);
  };

  return (
    <div  className="dashboard  w-[100%] min-h-screen bg-[#fffbf0]">
      {/* Header */}
      <div className="flex justify-between items-center  p-5 rounded-xl">
        <h1 className="text-2xl font-bold"
        >MOMO</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Hello, {loggedInUser}</span>
          <button
            onClick={handleLogout}
            className="bg-[#ffcfca] text-[#000] font-semibold px-4 py-2 rounded-lg hover:border-2 hover:bg-transparent hover:border-[#fb5a49] hover:text-[#fb5a49]"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <div className=' p-7 min-h-screen'>
        <form onSubmit={handleUpload} className="flex flex-wrap gap-4 mb-6">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          className="border-2 p-2 rounded-xl border-[#ffcfca] text-[#648d49]"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border-2 p-2 rounded-xl border-[#ffcfca] flex-1 min-w-[200px] text-[#648d49]"
        />
        <button type="submit" className="bg-[#ffcfca] text-[#000] font-semibold px-4 py-2 rounded-2xl hover:border-2 hover:border-[#648d49] hover:text-[#648d49] hover:bg-transparent">
          Upload
        </button>
      </form>

      {/* Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 p-2 rounded-xl border-[#ffcfca] flex-1 min-w-[200px] text-[#648d49]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#ffcfca] text-[#000] font-semibold px-4 py-2 rounded-2xl hover:border-2 hover:border-[#648d49] hover:text-[#648d49] hover:bg-transparent"
        >
          Search
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => fetchImages()}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          All
        </button>
        {allTags.map((tag, index) => (
          <button
            key={tag}
            onClick={() => handleFilter(tag)}
            className={`px-3 py-1 rounded cursor-pointer ${tagColors[index % tagColors.length]}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img._id} className="mb-4 break-inside-avoid relative">
              <img
                src={`http://localhost:8080${img.imageUrl}`}
                alt="uploaded"
                className="w-full rounded-2xl"
              />
              <button
                onClick={() => handleDelete(img._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              <div className="p-2">
                {/* AI Description */}
                {img.description && (
                  <p className="text-sm text-gray-600">
                    {img.description}
                  </p>
                )}

                {/* AI Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {img.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#ffcfca] text-black px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>


            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
      </div>
      

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
