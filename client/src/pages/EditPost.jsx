import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // to style ReactQuill component 
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../Editor';




const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('https://blog-hub-api-kow3.onrender.com/post/' + id)
            .then(res => {
                res.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content);
                });
            });
    }, [id]); // Add dependency array here
    

    const updatePost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        // data.set('cover', cover);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const res = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include'
        });

        if (res.ok) {
            setRedirect(true);
        }
    }


    if (redirect) {
        return <Navigate to={'/post/' + id} />;
    }

    return (
        <div className="inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="fixed inset-0 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 z-10">
                <h2 className="text-xl font-bold text-gray-800">Create a New Post</h2>
                <form onSubmit={updatePost} className="space-y-4">
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
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
