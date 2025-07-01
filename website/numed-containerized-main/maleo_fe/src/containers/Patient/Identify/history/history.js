import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './history.css'; // Import CSS for styling

const History = () => {
  const [multiclassData, setMulticlassData] = useState([]);
  const [binaryData, setBinaryData] = useState([]);
  const baseURL = 'http://127.0.0.1:9090';
  const apiUrlMulticlass = `${baseURL}/MULTICLASS/list_images_and_content`;
  const apiUrlBinary = `${baseURL}/BINARY/list_images_and_content`;
  useEffect(() => {
    const fetchMulticlassData = async () => {
      try {
        const response = await axios.get(apiUrlMulticlass);
        setMulticlassData(response.data);
      } catch (error) {
        console.error('Error fetching multiclass data:', error);
      }
    };

    const fetchBinaryData = async () => {
      try {
        const response = await axios.get(apiUrlBinary);
        setBinaryData(response.data);
      } catch (error) {
        console.error('Error fetching binary data:', error);
      }
    };

    fetchMulticlassData();
    fetchBinaryData();
  }, []);

  return (
    <div className="history-container">
      <div className="history-section">
        <h2>Multiclass History</h2>
        <div className="scroll-box">
          <ul>
            {multiclassData.map((folder) => (
              <li key={folder.folder_name}>
                <h3>{folder.folder_name}</h3>
                <ul>
                  {folder.files.map((file) => (
                    <li key={file.result_content}>
                      <h4>Images:</h4>
                      <ul>
                        {file.images.map((image) => (
                          <li key={image}>{image}</li>
                        ))}
                      </ul>
                      <p>Result Content: {file.result_content}</p>
                      <p>Rating Content: {file.rating_content}</p>
                      <p>Comment Content: {file.comment_content}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="history-section">
        <h2>Binary History</h2>
        <div className="scroll-box">
          <ul>
            {binaryData.map((folder) => (
              <li key={folder.folder_name}>
                <h3>{folder.folder_name}</h3>
                <ul>
                  {folder.files.map((file) => (
                    <li key={file.result_content}>
                      <h4>Images:</h4>
                      <ul>
                        {file.images.map((image) => (
                          <li key={image}>{image}</li>
                        ))}
                      </ul>
                      <p>Result Content: {file.result_content}</p>
                      <p>Rating Content: {file.rating_content}</p>
                      <p>Comment Content: {file.comment_content}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
