import { useState } from 'react';

export function CreatePostModal({ onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (title && content) {
        onSubmit(title, content);
        onClose();
        }
    };

    return (
        <div style={styles.overlay}>
        <div style={styles.modal}>
            <button onClick={onClose} style={styles.closeButton}>X</button>
            <h2>Create a New Post</h2>
            <div>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
            />
            </div>
            <div>
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={styles.textarea}
            />
            </div>
            <button onClick={handleSubmit} style={styles.submitButton}>Create Post</button>
        </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '600px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        margin: '10px 0',
        height: '20px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    textarea: {
        width: '100%',
        margin: '10px 0',
        height: '200px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    submitButton: {
        backgroundColor: '#1563B8',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default CreatePostModal;
