import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import {Link,useNavigate} from 'react-router-dom';
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

 
  const handleRoleChange = (e) => {
    setRole(e.target.value);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
      const response = await axios.post('http://localhost:3100/signup', {
          name: name,
          email: email,
          password: password,
          role: role
      });

      if (response.data) {
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.data.message,
          }).then((result) => {
              if (result.isConfirmed) {
                  // Redirect to signin page after successful signup
                  navigate('/'); // Assuming you are using React Router
              }
          });
      } else {
          Swal.fire({
              icon: "error",
              title: "Error",
              text: response.data.message ,
          });
      }
      
      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setPassword("");
      setRole("");

  } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to sign up. Please try again.",
      });
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                            Select Your Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={handleRoleChange}
                            className="input-field"
                        >
                            <option value="">Select...</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>

                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Already have an account?</span>{" "}
                        <Link to="/signin" className="text-green-500 hover:text-green-700 text-sm font-bold">
                            Sign In
                        </Link>
                    </div>
                </form>
      </div>
    </div>
  );
};

export default Signup;
