import React, { useState } from "react";
import { Link } from "react-router-dom";
import dropdown from './images/drop.png';

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
                            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/" className="text-white hover:text-gray-300">Contact Us</Link>
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
                     {/* <input
                        type="search"
                        placeholder="Search for Products"
                        className="bg-white text-gray-800 px-3 py-2 rounded-lg focus:outline-none hidden md:block"
                       style={{ maxWidth: "250px" }} 
                     />  */}

                       <div className="md:flex items-center mt-2 md:mt-0 relative">
                        <div className="flex items-center">
                        <img src={dropdown} alt="filter" className="w-6 h-6 mr-2 cursor-pointer" onClick={()=> setShowDropdown(!showDropdown)}/>
                        <input
                        type="search"
                        placeholder="Search for products"
                        className="bg-white text-gray-800 px-3 py-1 rounded-lg focus:outline-none w-full md:w-auto"
                        onChange={handleSearch}
                        />

                        </div>
                        {showDropdown && (
                            <div className="absolute left-0 mt-2 bg-black text-white border border-gray-300 rounded-lg shadow-lg" style={{top:'100%',zIndex:10}}>

                            <ul className="py-4">
                              <li className="px-4 py-2 cursor-pointer" onClick={()=> handleFilterClick('Bag')}>Bag</li>
                              <li className="px-4 py-2 cursor-pointer" onClick={()=> handleFilterClick('Menswear')}>Menswear</li>
                              <li className="px-4 py-2 cursor-pointer" onClick={()=> handleFilterClick('Footwear')}>Footwear</li>
                              <li className="px-4 py-2 cursor-pointer" onClick={()=> handleFilterClick('Electronics')}>Electronics</li>
                            </ul>
                            </div>  
                        )}
                     </div>  
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
