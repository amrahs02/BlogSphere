import { formatISO9075 } from 'date-fns';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { TailSpin } from 'react-loader-spinner';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

// Utility function to generate initials from a name
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  return parts.map(part => part.charAt(0).toUpperCase()).join('');
};

// Utility function to generate a random color for the initials

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${baseURL}/post/${id}`)
      .then(res => res.json())
      .then(postInfo => setPostInfo(postInfo));
  }, [id]);

  if (!postInfo) {
    return (
      <div className="flex mt-20 justify-center items-center">
        <TailSpin
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
    );
  }

  const initials = postInfo.author ? getInitials(postInfo.author.username) : 'U';

  return (
    <div className="post-page bg-gray-50 border border-gray-100 rounded-2xl max-w-4xl mx-auto py-5 px-6">
      <div className="flex flex-col md:flex-row justify-between border border-gray-200 bg-gray-100 rounded-2xl my-2 p-4 items-center">
        <div className="flex items-center mb-8 md:mb-0">
          <div className="author flex items-center space-x-4">
            <div className="flex space-x-2">
              {initials.split('').map((initial, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl text-white text-2xl font-bold"
                  style={{ backgroundColor: 'black' }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="ml-4">
              <p className="text-lg text-gray-900 font-semibold">
                {postInfo.author ? postInfo.author.username : 'Unknown'}
              </p>
              <time className="text-gray-500 text-sm">
                {formatISO9075(new Date(postInfo.updatedAt))}
              </time>
            </div>
          </div>
        </div>

        {userInfo.id === postInfo.author._id && (
          <div className="flex justify-end">
            <Link
              className="edit-btn flex justify-center items-center rounded-2xl py-2 md:py-3 font-semibold hover:bg-emerald-600 px-3 md:px-4 bg-emerald-700 text-white"
              to={`/edit/${postInfo._id}`}
            >
              <div className='mx-1' >Edit this post</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mx-1 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487L18.55 2.8a1.875 1.875 0 012.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <div className="image mb-10">
        <img
          src={`${baseURL}/${postInfo.cover}`}
          alt={`${postInfo.title} cover`}
          className="w-full h-60 md:h-80 object-cover border border-gray-300 rounded-2xl shadow-sm"
        />
      </div>

      <h1 className="text-2xl md:text-4xl bg-gray-100 rounded-2xl text-center font-extrabold text-gray-900 mb-6 leading-tight">
        {postInfo.title}
      </h1>
      <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
        {postInfo.summary}
      </p>

      <div
        className="prose prose-sm md:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
