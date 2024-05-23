import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({setKeyword,onCategorySelect}) {
    const [showDropdown,setShowDropdown] = useState(false);

    const handleSearch= (e) =>{
        const searchKeyword = e.target.value;
        setKeyword(searchKeyword);
    };

    const handleFilterClick= (category)=>{
        setShowDropdown(false);
        onCategorySelect(category);
    }


    return (
        <nav className="bg-gradient-to-r from-blue-500 to-orange-500 py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    
                    {/* Logo */}
                     <div className="text-white text-xl font-bold">Mern Store</div> 
    
                    
                    {/* Navigation Links */}
                    <ul className="flex items-center space-x-4">
                        <li>
                            <Link to="/home" className="text-white hover:text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/contactus" className="text-white hover:text-gray-300">Contact Us</Link>
                        </li>
                       
                        <li>
                            <Link to="/signin" className="text-white hover:text-gray-300">Sign In</Link>
                        </li>
                        <li>
                            <Link to="/mycart" className="text-white hover:text-gray-300">My Cart</Link>
                        </li>
                        <li>
                            <Link to="/myorder" className="text-white hover:text-gray-300">My Order</Link>
                        </li>
                        <li>
                            <Link to="/mywishlist" className="text-white hover:text-gray-300">My Wishlist</Link>
                        </li>
                        <li>
                            <Link to="/signout" className="text-white hover:text-gray-300">SignOut</Link>
                        </li>
                    </ul>
    
                    {/* Search Input */}
                    <input
                        type="search"
                        placeholder="Search for Products"
                        className="bg-white text-gray-800 px-3 py-2 rounded-lg focus:outline-none hidden md:block"
                        style={{ maxWidth: "250px" }} 
                    />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
