import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // to style ReactQuill component 
import { Navigate } from 'react-router-dom';
import Editor from '../../src/Editor';



const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const createNewPost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include'

        });
        if (response.ok) {
            setRedirect(true);
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    const cancelPost = () => {
        setRedirect(true);
    }


        return (
            <div className="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                

                <div className="fixed inset-0 backdrop-blur-sm"></div>
                <svg onClick={cancelPost} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-red-800  bg-white rounded-lg sm:top-12 top-20  absolute size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <div className="relative sm:w-1/2 w-full mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 z-10">
                    <h2 className="text-xl font-bold text-gray-800">Create a New Post</h2>
                    <form onSubmit={createNewPost} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="Enter the title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                            <input
                                type="text"
                                placeholder="Enter a brief summary"
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                            <input
                                type="file"
                                onChange={e => setFiles(e.target.files)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <Editor value={content} onChange={setContent} />
                        </div>
                        <button className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            Create Post
                        </button>
                    </form>
                </div>
            </div>
        );
};

export default CreatePost;
