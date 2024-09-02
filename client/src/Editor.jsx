import React from 'react'
import ReactQuill from 'react-quill'


const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ]
};


const Editor = ({ value, onChange }) => {
    return (
        <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
        />

    )
}

export default Editor