import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Multiclass = () => {
  const [result, setResult] = useState(null);
  const [files, setFiles] = useState([]);

  const baseURL = 'http://127.0.0.1:9090';

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${baseURL}/MULTICLASS/files/`);
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handlePredict = async () => {
    try {
      console.log('Sending prediction request...');
      const response = await axios.post(`${baseURL}/MULTICLASS/predict`);
      console.log('Prediction response:', response.data);
      setResult(response.data['Predicted Label']);
    } catch (error) {
      console.error('Error fetching the prediction:', error);
      setResult('Error fetching the prediction');
    }
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await axios.post(`${baseURL}/MULTICLASS/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchFiles();
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Error uploading the file');
    }
  };

  const handleFileDelete = async (filename) => {
    try {
      await axios.delete(`${baseURL}/MULTICLASS/delete/${filename}`);
      fetchFiles();
      alert('File deleted successfully');
    } catch (error) {
      console.error('Error deleting the file:', error);
      alert('Error deleting the file');
    }
  };

  return (
    <div>
      <h3>Identify</h3>
      <button type="button" onClick={handlePredict}>Predict</button>
      {result && (
        <div>
          <h3>Prediction Result:</h3>
          <p>{result}</p>
        </div>
      )}
      <div>
        <h3>Upload Image</h3>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div>
        <h3>Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file}>
              {file}
              <button type="button" onClick={() => handleFileDelete(file)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Multiclass;
