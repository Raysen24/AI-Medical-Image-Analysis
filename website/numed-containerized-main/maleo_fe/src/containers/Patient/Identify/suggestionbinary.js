import React, { useState } from 'react';
import axios from 'axios';

const SuggestionBinary = () => {
  const [subfolder, setSubfolder] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');

  const baseURL = 'http://127.0.0.1:9090';

  const createCommentFile = async () => {
    try {
      const formData = new FormData();
      formData.append('subfolder', subfolder);
      formData.append('content', content);

      const response = await axios.post(`${baseURL}/BINARY/create-comment-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error.response ? error.response.data.detail : 'Error creating comment file');
    }
  };

  const createRating = async () => {
    try {
      const formData = new FormData();
      formData.append('subfolder', subfolder);
      formData.append('content', rating);

      const response = await axios.post(`${baseURL}/BINARY/create-rating`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message);
      window.location.reload();
    } catch (error) {
      setMessage(error.response ? error.response.data.detail : 'Error creating rating');
    }
  };

  return (
    <div>
      <h1>Suggestion Binary</h1>
      <div>
        <label htmlFor="subfolder">Subfolder:</label>
        <input
          id="subfolder"
          type="text"
          value={subfolder}
          onChange={(e) => setSubfolder(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="rating">Rating (1-5):</label>
        <input
          id="rating"
          type="text"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={createCommentFile}>Create Comment File</button>
        <button type="button" onClick={createRating}>Create Rating</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SuggestionBinary;
