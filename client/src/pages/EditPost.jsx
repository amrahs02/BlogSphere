import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // to style ReactQuill component 
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../Editor';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://blog-hub-api-kow3.onrender.com';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        setLoading(true);
        fetch(`${baseURL}/post/${id}`)
            .then(res => res.json())
            .then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
                setLoading(false); // Stop loading once data is fetched
            });
    }, [id]);

    const updatePost = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when updating
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }

        const res = await fetch(`${baseURL}/post/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include'
        });

        setLoading(false); // Stop loading after the request is finished
        if (res.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />;
    }

    const cancelPost = () => {
        setRedirect(true);
    }

    return (
        <div className="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            {loading && (
                <div className="fixed inset-0 bg-opacity-50 bg-gray-900 flex items-center justify-center z-20">
                    <div className="loader border-t-4 border-emerald-500 rounded-full w-16 h-16 animate-spin"></div>
                    <div className="fixed inset-0 backdrop-blur-sm"></div>
                </div>
            )}
            <svg onClick={cancelPost} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-red-800 hover:text-white bg-white rounded-xl hover:bg-red-500 sm:top-12 top-20 absolute size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <div className="relative w-4/5 mx-auto m-8 p-6 bg-white rounded-2xl shadow-lg space-y-6 z-10">
                <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
                <form onSubmit={updatePost} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            placeholder="Enter the title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                        <input
                            type="file"
                            onChange={e => setFiles(e.target.files)}
                            className="w-full p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <Editor value={content} onChange={setContent} />
                    </div>
                    <button className="w-full py-2 bg-emerald-600 text-white font-medium rounded-2xl hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
