import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';


// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://blog-hub-api-kow3.onrender.com';

// Utility function to generate initials from a name
const getInitials = (name) => {
    if (!name) return '';
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

const Post = ({ title, summary, cover, createdAt, updatedAt, author, _id }) => {
    const initials = author ? getInitials(author.username) : 'U';

    return (
        <div className="bg-gray-100 p-3 shadow-sm rounded-xl overflow-hidden max-w-2xl mx-auto my-8 transition-transform transform hover:shadow-lg">
            <div className="relative ">
                <Link to={`/post/${_id}`}>
                    <img
                        src={`${baseURL}/${cover}`}
                         alt={`${title} cover`}
                        className="object-cover rounded-xl w-full h-32"
                    />
                </Link>
            </div>

            <div className="p-2">
                <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                        {initials.split('').map((initial, index) => (
                            <div
                                key={index}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-white text-xl font-bold"
                                style={{ backgroundColor: getRandomColor() }}
                            >
                                {initial}
                            </div>
                        ))}
                    </div>
                    <div className="ml-4 flex flex-col">
                        <p className="text-lg text-gray-800 font-medium">{author ? author.username : 'Unknown'}</p>
                        <time className="text-sm text-gray-500">{formatISO9075(new Date(updatedAt))}</time>
                    </div>
                </div>

                <Link to={`/post/${_id}`}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 hover:text-indigo-600 transition-colors">{title}</h1>
                </Link>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{summary}</p>
            </div>
        </div>
    );
};

export default Post;
