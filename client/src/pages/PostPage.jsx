import { formatISO9075 } from 'date-fns';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { TailSpin } from 'react-loader-spinner'


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
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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
    return <div className="flex mt-20 justify-center items-center">
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
    </div>;
  }

  const initials = postInfo.author ? getInitials(postInfo.author.username) : 'U';

  return (
    <div className="post-page max-w-4xl mx-auto py-12 px-6">
      <div className='flex justify-between items-center' >

        <div className="flex items-center mb-8">
          <div className="author flex items-center space-x-4">
            <div className="flex space-x-2">
              {initials.split('').map((initial, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-full text-white text-2xl font-bold"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="ml-4">
              <p className="text-xl text-gray-900 font-semibold">
                {postInfo.author ? postInfo.author.username : 'Unknown'}
              </p>
              <time className="text-gray-500 text-sm">
                {formatISO9075(new Date(postInfo.updatedAt))}
              </time>
            </div>
          </div>

        </div>
        {userInfo.id === postInfo.author._id && (
          <div className="flex  justify-end mb-8">
            <Link className='edit-btn' to={`/edit/${postInfo._id}`} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit this post </Link>

          </div>
        )}
      </div>



      <div className="image mb-10">
        <img
          src={`${baseURL}/${postInfo.cover}`}
          alt={`${postInfo.title} cover`}
          className="w-full h-80 object-cover rounded-lg shadow-xl"
        />
      </div>

      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{postInfo.title}</h1>
      <p className="text-lg text-gray-700 mb-8 leading-relaxed">{postInfo.summary}</p>

      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
