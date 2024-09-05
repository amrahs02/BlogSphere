import React, { useEffect, useRef, useState } from 'react';
import Post from '../components/Post';
import { TailSpin } from 'react-loader-spinner'


// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetch(`${baseURL}/post`)
      .then(res => res.json())
      .then(posts => {
        setPosts(posts);
        setFilteredPosts(posts); // Initialize filteredPosts with all posts
        setIsLoading(false); // Data has been fetched
      })
      .catch(() => setIsLoading(false)); // Handle errors and stop loading
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query)
    );
    setFilteredPosts(results);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">

      {/* search function  */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-col md:flex-row items-center justify-end space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          ref={searchInputRef}
          placeholder="Search Blogs... (Ctrl + K)"
          className="w-full md:flex-grow border px-4 py-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition duration-200 ease-in-out"
        />
        <button
          type="submit"
          className="flex justify-center items-center w-full md:w-auto bg-purple-600 text-white px-4 py-3 rounded-2xl hover:bg-purple-800 transition-colors duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>

      {isLoading ? (
        <div className="flex mt-20 justify-center items-center">
          <TailSpin   // Type of spinner
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}

          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <div className="flex-grow">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Post
                  key={post._id}
                  {...post}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No posts found</p>
            )}
          </div>
          <div className="w-full md:w-1/4 bg-white border  border-slate-300 p-3 shadow- rounded-2xl m-8 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <p className="text-gray-600">No Tags found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
