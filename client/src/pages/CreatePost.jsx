import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // to style ReactQuill component 
import { Navigate } from 'react-router-dom';
import Editor from '../../src/Editor';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://blog-hub-api-kow3.onrender.com';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const createNewPost = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        const response = await fetch(`${baseURL}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        setLoading(false); // Stop loading after response
        if (response.ok) {
            setRedirect(true);
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    const cancelPost = () => {
        setRedirect(true);
    };

    return (
        <div className="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="fixed inset-0 backdrop-blur-sm"></div>
            <svg onClick={cancelPost} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-red-800 hover:bg-red-500 bg-white rounded-xl sm:top-12 top-20 absolute size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <div className="relative sm:w-1/2 m-8 w-full mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 z-10">
                <h2 className="text-xl font-bold text-gray-800">Create a New Post</h2>
                
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
                        <span className="ml-2 text-emerald-500">Creating post...</span>
                    </div>
                ) : (
                    <form onSubmit={createNewPost} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Enter the title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                            <input
                                type="text"
                                placeholder="Enter a brief summary"
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                            <input
                                type="file"
                                onChange={e => setFiles(e.target.files)}
                                className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <Editor value={content} onChange={setContent} disabled={loading} />
                        </div>
                        <button
                            className={`w-full py-2 bg-emerald-600 text-white font-medium rounded-2xl hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading} // Disable button during loading
                        >
                            Create Post
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreatePost;
