import { Button, Input } from "@nextui-org/react";
import React, { useState } from 'react';
import AuthHeaderForm from "./AuthHeaderForm";
import axios from 'axios';
import { URL } from "../../api/APIconst"

function PasswordReset() {
    const [form, setForm] = useState({
        email: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            await axios.post(`${URL}/auth/forgot-password`, {
                email: form.email
            });
            alert('Password reset email sent');
            // Optionally, navigate to a different page or show a success message
            // navigate('/some-path');
        } catch (error) {
            alert('Error sending password reset email');
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
                        <label htmlFor="email" className="block text-left mb-2 text-base font-semibold">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                            placeholder="numed@gmail.com" 
                            required 
                        />
                    </div>
                    <Button
                        fullWidth
                        radius="sm"
                        size="lg"
                        className="bg-quaternary text-white font-bold text-xl mb-8"
                        type="submit"
                    >
                        Send
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

export default PasswordReset;
