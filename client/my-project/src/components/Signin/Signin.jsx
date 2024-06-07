import React, { useState } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Access to history object for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:3100/signin', {
            email: email,
            password: password,
        });

        if (response.data.success) {
            const { token, role ,email} = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('email',email);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
            });

            // Redirect based on role after successful sign-in
            if (role === 'seller') {
                navigate('/sellerlogin');
            } else if (role === 'buyer') {
                navigate('/');
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Invalid credentials. Please try again.",
            });
        }

        // Reset form fields after successful submission
        setEmail("");
        setPassword("");

    } catch (error) {
        console.error("Signin error:", error);
        console.log("response is", error.response);

        if (error.response && error.response.status === 401) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Invalid credentials. Please try again.",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to sign in. Please try again.",
            });
        }
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter Your Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Link to="/signup" className="text-indigo-500 hover:text-indigo-700 font-bold ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
