import {Button, Input} from "@nextui-org/react";
import React, { useState } from 'react';
import AuthHeaderForm from "./AuthHeaderForm";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { register } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

function RegistrationForm() {
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const [form, setForm] = useState({
        username: '',
        email: '',
        birthdate: new Date(),
        gender: 'Choose one',
        password: '',
        passwordConfirm: '',
    })

    const nav = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectGender = (gender) => {
        setForm({
            ...form,
            gender: gender
        });
        setIsOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (form.password !== form.passwordConfirm) {
            return;
        }

        try {
            await register(form);
            nav("/login")
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="bg-senary p-8 rounded-2xl absolute mx-auto my-auto inset-0 max-w-3xl h-[520px]">
            <div className="flex text-left gap-4 items-center mb-5">
                <AuthHeaderForm 
                    text="Create an Account"
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="flex justify-between gap-10">
                        <div className="mb-5 flex-1">
                            <label htmlFor="username" className="block text-left mb-2 text-base font-semibold">
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                                placeholder="Your Full Name" 
                                required 
                            />
                        </div>
                        <div className="mb-5 flex-1">
                            <label htmlFor="email" className="block text-left mb-2 text-base font-semibold">
                                E-mail
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
                    </div>

                    <div className="flex justify-between gap-10">
                        <div className="mb-5 flex-1">
                            <label htmlFor="email" className="block text-left mb-2 text-base font-semibold">
                                Date of Birth
                            </label>
                            <input 
                                type="date" 
                                id="birthdate" 
                                name="birthdate"
                                value={form.birthdate}
                                onChange={handleChange}
                                className="custom-date-input bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                                placeholder="dd/mm/yyyy" 
                                required 
                            />
                        </div>
                        <div className="mb-5 flex-1">
                            <label htmlFor="gender" className="block text-left mb-2 text-base font-semibold">
                                Gender
                            </label>
                            <div className="relative text-left">
                                <button
                                    id="dropdownDefaultButton"
                                    data-dropdown-toggle="dropdown"
                                    className="bg-octonary placeholder-denary text-left text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-full p-3 flex justify-between items-center"
                                    type="button"
                                    onClick={toggleDropdown}
                                >
                                    {form.gender}
                                    <svg
                                        className="w-2.5 h-2.5 inline-block ml-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>

                                {isOpen && (
                                    <div
                                        id="dropdown"
                                        className="z-10 bg-septenary divide-y divide-gray-100 rounded-lg shadow w-full absolute mt-1"
                                    >
                                        <ul
                                            className="py-2 text-sm text-white"
                                            aria-labelledby="dropdownDefaultButton"
                                        >
                                            <li>
                                                <p className="block px-4 py-2 hover:bg-nonary" onClick={() => handleSelectGender('Male')}>Male</p>
                                            </li>
                                            <li>
                                                <p className="block px-4 py-2 hover:bg-nonary" onClick={() => handleSelectGender('Female')}>Female</p>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-between gap-10">
                        <div className="mb-5 flex-1">
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
                        <div className="mb-5 flex-1">
                            <label htmlFor="password" className="block text-left mb-2 text-base font-semibold">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={isConfirmVisible ? "text" : "password"}
                                    id="passwordConfirm" 
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                    className="bg-octonary placeholder-denary text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
                                    placeholder="Your Password" 
                                    required 
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-1/3 transform -translate-y-1/3 focus:outline-none"
                                    onClick={toggleConfirmVisibility}
                                >
                                    {isConfirmVisible ? (
                                        <FaEye className="text-2xl text-white mt-1" />
                                    ) : (
                                        <FaEyeSlash className="text-2xl text-white mt-1" />
                                    )}
                                </button>
                            </div>
                            

                        </div>
                    </div>
                </div>
                
                <Button
                    fullWidth
                    radius="sm"
                    size="lg"
                    className="bg-quaternary text-white font-bold text-xl mb-4"
                    type="submit"
                >
                    Sign Up
                </Button>
                <div class="text-center">
                    <p className="font-medium">
                        Already have an account? <a className="text-blueish" href="/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RegistrationForm;