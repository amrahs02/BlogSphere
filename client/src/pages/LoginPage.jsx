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

  const login = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseURL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
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
    <div className="flex  justify-center items-center  bg-gray-100">
      <form
        className="bg-white p-8 sm:m-14 m-4  rounded-2xl shadow-lg max-w-sm w-full"
        onSubmit={login}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-2xl   focus:outline-none focus:border-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-3 bg-purple-500 text-white font-semibold rounded-2xl hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Login
        </button>
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Credentials for testing:</p>
          <p>Email: <strong>test@gmail.com</strong></p>
          <p>Password: <strong>test</strong></p>
          <p className="mt-4">New user?</p>
          <Link
            to="/register"
            className="text-purple-500 hover:text-purple-700 font-medium"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
