import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${baseURL}/profile`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };


    fetchUserProfile();
  }, [setUserInfo]);

  const username = userInfo?.username?.split('@')[0];

  const logout = async () => {
    try {
      await fetch(`${baseURL}/logout`, {
        credentials: 'include',
        method: 'POST',
      });
      setUserInfo(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-emerald-500  m-2 rounded-2xl text-white shadow-lg">
      <div className="container mx-auto  flex justify-between items-center p-4">
        <Link to="/" className="text-2xl md:text-3xl font-bold hover:text-gray-200">
          .BlogSphere
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <nav
          className={`${isOpen ? "block" : "hidden"
            } md:flex md:items-center md:space-x-6 transition-all duration-300`}
        >
          {username ? (
            <>
              <span className="text-lg font-medium hidden md:block">
                Welcome, {username}
              </span>
              <Link
                className="flex mt-2 md:mt-0 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                to="/create"
              >
                Create Post
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>


              </Link>
              <button
                onClick={logout}
                className="flex mt-2 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                Logout
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>

              </button>
            </>
          ) : (
            <>
              <Link
                className="flex mt-2 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                to="/login"
              >
                Login
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
              <Link
                className="flex mt-2 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                to="/register"
              >
                Register
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
