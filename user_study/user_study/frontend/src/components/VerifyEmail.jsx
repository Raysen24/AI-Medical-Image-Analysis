import { Button, Input } from "@nextui-org/react";
import React, { useState } from 'react';
import AuthHeaderForm from "./AuthHeaderForm";
import { useLocation, useNavigate } from 'react-router-dom';
import { URL } from "../../api/APIconst";
import axios from 'axios';


function VerifyEmail() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = new URLSearchParams(location.search).get('token');
    
        if (form.password !== form.passwordConfirm) {
          alert('Passwords do not match');
          return;
        }
    
        try {
            const response = await axios.post(`${URL}/auth/reset-password`, {
                token,
                new_password: form.password
            });
            alert('Password reset successful');
            navigate('/login'); // Redirect to login page after successful reset
        } catch (error) {
            alert('Error resetting password');
        }
      };

    return (
        <div className="bg-senary p-8 rounded-2xl absolute inset-0 max-w-3xl h-[520px] flex flex-col mx-auto my-auto">
            {/* Header Section */}
            <div className="flex text-left gap-4 items-center mb-5 mt-3">
                <AuthHeaderForm 
                    text="Password Reset"
                />
            </div>

            {/* Center Section */}
            <div className="flex flex-1 justify-center items-center mb-5">
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-5 w-full">
                        <label htmlFor="password" className="block text-left mb-2 text-base font-semibold">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                            placeholder="Password" 
                            required 
                        />
                    </div>
                    <div className="mb-7 w-full">
                        <label htmlFor="passwordConfirm" className="block text-left mb-2 text-base font-semibold">
                            Confirm Password
                        </label>
                        <input 
                            type="password" 
                            id="passwordConfirm" 
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                            placeholder="Password" 
                            required 
                        />
                    </div>
                    <Button
                        fullWidth
                        radius="sm"
                        size="lg"
                        className="bg-quaternary text-white font-bold text-xl mb-5"
                        type="submit"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>

            {/* Footer Section */}
            <div className="text-center mb-3">
                <p className="font-medium">
                    Remember Your Password? <a className="text-blueish" href="/login">Login!</a>
                </p>
            </div>
        </div>
    );
}

export default VerifyEmail;
