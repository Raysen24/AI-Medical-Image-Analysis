import axios from 'axios'
import { URL } from "./APIconst"

export const predictImageBinary = async(patient_id) => {
    try {
        const response = await axios.get(`${URL}/predict/BINARY/predict?patient_id=${patient_id}`);
        return response
    } catch (error) {
        console.error("Predict binary image failed:", error)
    }
}

export const predictImageMulticlass = async(patient_id) => {
    try {
        const response = await axios.get(`${URL}/predict/MULTICLASS/predict?patient_id=${patient_id}`);
        return response
    } catch (error) {
        console.error("Predict multiclass image failed:", error)
    }
}

export const getPatientPredictResults = async(patient_id) => {
    try {
        const response = await axios.get(`${URL}/predict/patients/data/${patient_id}`);
        return response
    } catch (error) {
        console.error("Get patient data failed:", error)
    }
}

export const updateBinary = async(binary_id, comment, sesuai_tidaksesuai) => {
    try {
        const response = await axios.post(
            `${URL}/predict/BINARY/comment-rating?binary_id=${binary_id}`, {
                comment,
                sesuai_tidaksesuai,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Update binary failed:", error);
    }
};

export const updateMulticlass = async(multiclass_id, comment, sesuai_tidaksesuai) => {
    try {
        const response = await axios.post(
            `${URL}/predict/MULTICLASS/comment-rating?multiclass_id=${multiclass_id}`, {
                comment,
                sesuai_tidaksesuai,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Update multiclass failed:", error);
    }
}