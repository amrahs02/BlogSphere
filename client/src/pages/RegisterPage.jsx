import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseURL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status !== 200) {
      alert('User registration failed');
    } else {
      alert('User registered successfully');
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100">
      <form
        className="bg-white p-8 sm:m-14 m-4  rounded-2xl shadow-lg max-w-sm w-full"
        onSubmit={register}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl hover:bg-emerals-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Register
        </button>
        <div className="text-center  mt-4 text-sm text-gray-500">
          <p>Already a user?</p>
          <Link
            to="/login"
            className="text-emerald-500 hover:text-emerald-700 font-medium"
          >
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
