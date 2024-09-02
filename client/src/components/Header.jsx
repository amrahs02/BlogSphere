import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/profile', {
          credentials: 'include',
        });
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
      await fetch('http://localhost:4000/logout', {
        credentials: 'include',
        method: 'POST',
      });
      setUserInfo(null);  // Update the UI
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between m-3 items-center p-4 bg-purple-600 text-white rounded-full shadow-lg">
      <Link to="/" className="ml-5 text-2xl md:text-3xl font-bold hover:text-gray-200">
        .BlogHub
      </Link>
      <nav className="flex items-center space-x-4 md:space-x-6 mt-2 md:mt-0">
        {username ? (
          <>
            <span className="text-sm md:text-lg font-medium">
              Welcome, {username}
            </span>
            <Link
              className="flex bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1 px-2 md:px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              to="/create"
            >
              Create Post
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" ml-1 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>



            </Link>
            <button
              onClick={logout}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1 px-2 md:px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1 px-2 md:px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1 px-2 md:px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              to="/register"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
