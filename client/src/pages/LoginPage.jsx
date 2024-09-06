import { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Loading state

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the login starts
    const response = await fetch(`${baseURL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    setLoading(false); // Set loading to false after response
    if (response.ok) {
      const userInfo = await response.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      alert('Wrong username or password');
    }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <form
        className="bg-white p-8 sm:m-14 m-4 rounded-2xl shadow-lg max-w-sm w-full"
        onSubmit={login}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

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
            <span className="ml-2 text-emerald-500">Logging in...</span>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // Disable input during loading
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // Disable input during loading
            />
            <button
              type="submit"
              className={`w-full p-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button during loading
            >
              Login
            </button>
          </>
        )}

        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Credentials for testing:</p>
          <p>Email: <strong>test@gmail.com</strong></p>
          <p>Password: <strong>test</strong></p>
          <p className="mt-4">New user?</p>
          <Link
            to="/register"
            className="text-emerald-500 hover:text-emerald-700 font-medium"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
