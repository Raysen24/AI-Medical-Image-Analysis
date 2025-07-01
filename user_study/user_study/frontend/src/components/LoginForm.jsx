import {Button, Input} from "@nextui-org/react";
import React, { useState } from 'react';
import AuthHeaderForm from "./AuthHeaderForm";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { login } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { URL } from "../../api/APIconst"

function LoginForm() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const logbookData = {
        date: new Date().toISOString(),
        last_patient: null,
        patient_count: 0,
        completed: false
    };

    const nav = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        console.log(form.username);
        console.log(form.password);

        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', form.password);

        try {
            const response = await login(formData);
            const token = response.data.access_token;  // Adjust based on actual API response
            console.log(response.data.access_token);
            localStorage.setItem('token', token);  // Store the token
            nav("/consent");

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            console.log('Creating logbook:', logbookData);
            const createLogbookResponse = await axios.post(`${URL}/logbooks/create`, logbookData);
            if (createLogbookResponse.status === 201) {
                console.log('Logbook created successfully:', response.data);
            } 
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="bg-senary p-8 rounded-2xl absolute mx-auto my-auto inset-0 max-w-3xl h-[520px]">
            <div className="flex text-left gap-4 items-center mb-10 mt-3">
                <AuthHeaderForm 
                    text="A New AI-Based Telemedicine for COVID-19 Patients"
                />
            </div>
            <form onSubmit={handleLogin}>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-left mb-2 text-base font-semibold">
                        Email
                    </label>
                    <input 
                        type="email" 
                        id="username" 
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                        placeholder="numed@gmail.com" 
                        required 
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block text-left mb-2 text-base font-semibold">
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            type={isVisible ? "text" : "password"}
                            id="password" 
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                            placeholder="Your Password" 
                            required 
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/3 transform -translate-y-1/3 focus:outline-none"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? (
                                <FaEye className="text-2xl text-white mt-1" />
                            ) : (
                                <FaEyeSlash className="text-2xl text-white mt-1" />
                            )}
                        </button>
                    </div>
                </div>
                <div class="mb-5 text-end">
                    <a href="/resetpass" className="text-blueish font-semibold">Forgot Your Password?</a>
                </div>

                <Button
                    fullWidth
                    radius="sm"
                    size="lg"
                    className="bg-quaternary text-white font-bold text-xl mb-8"
                    type="submit"
                >
                    Login
                </Button>
                <div class="text-start">
                    <p className="font-medium">
                        Do not have an account? <a className="text-blueish" href="/register">Register Now!</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;