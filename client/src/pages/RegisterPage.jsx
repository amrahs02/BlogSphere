import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const register = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the registration starts
    const response = await fetch(`${baseURL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false); // Set loading to false when the registration ends

    if (response.status !== 200) {
      alert('User registration failed');
    } else {
      alert('User registered successfully');
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <form
        className="bg-white p-8 sm:m-14 m-4 rounded-2xl shadow-lg max-w-sm w-full"
        onSubmit={register}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-5 w-5 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span className="ml-2 text-emerald-500">Registering...</span>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // Disable input while loading
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // Disable input while loading
            />
            <button
              type="submit"
              className={`w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button while loading
            >
              Register
            </button>
          </>
        )}

        <div className="text-center mt-4 text-sm text-gray-500">
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
