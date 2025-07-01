import axios from 'axios'
import { URL } from "./APIconst"

export const uploadImage = async(patient_id, file) => {
    try {
        const token = localStorage.getItem('token');
            
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        
        const formData = new FormData();
        formData.append('upload_file', file);

        const response = await axios.post(`${URL}/s3/doctor_image/upload/${patient_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response
    } catch (error) {
        console.error('Sign u failed:', error)
    }
}

export const deleteImage = async(image_id) => {
    try {
        const token = localStorage.getItem('token');
            
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        const response = await axios.delete(`${URL}/s3/delete-image/${image_id}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response
    } catch (error) {
        console.error('Sign u failed:', error)
    }
}

export const fetchImagesFromS3 = async(patient_id) => {
    try {
        const token = localStorage.getItem('token');
            
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        const response = await axios.get(`${URL}/s3/fetch_images/${patient_id}`);
        return response.data.images; // Assuming API returns image details
    } catch (error) {
        console.error('Fetching images failed:', error);
        return [];
    }
};