import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError('All fields (name, email, password) are required');
    }
    try {
      const url = `${API_URL}/auth/signup`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo)
      });
      const result = await response.json();

      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate('/login'), 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else {
        handleError(message);
      }

      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="container p-7 border-2 border-[#ffcfca] w-[90%] md:w-[30vw]
 mt-[8rem] rounded-3xl bg-[#fffbf0]">
      <h1 className="font-bold text-3xl text-center p-4">Sign Up</h1>
      <div className="flex items-center justify-center w-full">
        <form onSubmit={handleSignUp} className="w-full">
          <div className="p-2 flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={signupInfo.name}
              onChange={handleChange}
              placeholder="Enter your name..."
              className="border-2 rounded-lg p-2 border-[#ffcfca]"
              autoFocus
            />
          </div>

          <div className="p-2 flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={signupInfo.email}
              onChange={handleChange}
              placeholder="Enter your email..."
              className="border-2 rounded-lg p-2 border-[#ffcfca]"
            />
          </div>

          <div className="p-2 flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={signupInfo.password}
              onChange={handleChange}
              placeholder="Enter your password..."
              className="border-2 rounded-lg p-2 border-[#ffcfca]"
            />
          </div>

          <div className="flex flex-col p-2 gap-1">
            <button
              type="submit"
              className="w-full bg-[#ffcfca] text-black font-semibold p-2 rounded-3xl cursor-pointer"
            >
              Sign Up
            </button>
            <span>
              Already have an account?
              <Link className="text-brown font-bold" to="/login">
                {' '}
                Log In
              </Link>
            </span>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
