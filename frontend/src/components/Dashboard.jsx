import React, { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const tagColors = [
  "bg-pink-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-purple-200",
  "bg-pink-300",
  "bg-yellow-300",
  "bg-green-300",
];

// ✅ backend from ENV
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  const fileInputRef = useRef(null);

  // ------------------ LOAD DATA ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoggedInUser(localStorage.getItem("loggedInUser"));
    fetchImages();
    fetchTags();
  }, []);

  // ------------------ FETCH IMAGES ------------------
  const fetchImages = async (search = "") => {
    try {
      const res = await fetch(
        `${API_URL}/products${search ? `?search=${search}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setImages(data);
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  // ------------------ FETCH TAGS ------------------
  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/products/tags`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setAllTags(data);
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  // ------------------ UPLOAD ------------------
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedImage) return handleError("Select an image first");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      if (tags) formData.append("tags", tags);

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      handleSuccess("Image uploaded!");

      setSelectedImage(null);
      setTags("");
      fileInputRef.current.value = "";

      fetchImages();
      fetchTags();
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  // ------------------ DELETE ------------------
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      handleSuccess("Image deleted");

      fetchImages();
      fetchTags();
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  // ------------------ SEARCH ------------------
  const handleSearch = () => {
    const search = searchTerm
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "")
      .join(",");

    fetchImages(search);
  };

  // ------------------ FILTER ------------------
  const handleFilter = (tag) => {
    fetchImages(tag);
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    handleSuccess("Logged out successfully!");

    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  return (
    <div className="dashboard w-full min-h-screen bg-[#fffbf0]">
      {/* HEADER */}
      <div className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">MOMO</h1>

        <div className="flex items-center gap-4">
          <span>Hello, {loggedInUser}</span>
          <button
            onClick={handleLogout}
            className="bg-[#ffcfca] px-4 py-2 rounded-lg font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* UPLOAD */}
      <div className="p-7">
        <form
          onSubmit={handleUpload}
          className="flex flex-wrap gap-4 mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="border-2 p-2 rounded-xl"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border-2 p-2 rounded-xl flex-1"
          />

          <button
            type="submit"
            className="bg-[#ffcfca] px-4 py-2 rounded-2xl"
          >
            Upload
          </button>
        </form>

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by tags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 p-2 rounded-xl flex-1"
          />

          <button
            onClick={handleSearch}
            className="bg-[#ffcfca] px-4 py-2 rounded-2xl"
          >
            Search
          </button>
        </div>

        {/* TAG FILTERS */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => fetchImages()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            All
          </button>

          {allTags.map((tag, index) => (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              className={`px-3 py-1 rounded ${
                tagColors[index % tagColors.length]
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* IMAGE GRID */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.length ? (
            images.map((img) => (
              <div
                key={img._id}
                className="mb-4 break-inside-avoid relative"
              >
                <img
                  src={`${API_URL}${img.imageUrl}`}
                  alt="uploaded"
                  className="w-full rounded-2xl"
                />

                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                >
                  ×
                </button>

                <div className="p-2">
                  {img.description && (
                    <p className="text-sm text-gray-600">
                      {img.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {img.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#ffcfca] px-2 py-1 rounded-full"
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
