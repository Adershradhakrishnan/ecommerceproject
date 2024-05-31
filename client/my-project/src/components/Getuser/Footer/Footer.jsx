import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-orange-500 py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">ABOUT</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-300">About Us</a></li>
              <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-300">Careers</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">CATEGORIES</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-300">Clothes</a></li>
              <li><a href="#" className="hover:text-gray-300">Fashion</a></li>
              <li><a href="#" className="hover:text-gray-300">Footwears</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">HELP</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-300">Payments</a></li>
              <li><a href="#" className="hover:text-gray-300">Shipping</a></li>
              <li><a href="#" className="hover:text-gray-300">Cancellation&Returns</a></li>
            </ul>
          </div>
           <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">CONSUMER POLICY</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-300">Cancellation&Returns</a></li>
              <li><a href="#" className="hover:text-gray-300">Terms Of Use</a></li>
              <li><a href="#" className="hover:text-gray-300">Security</a></li>
            </ul>
          </div> 
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="text-center">
          <p>&copy; 2024 Your E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
);
};

export default Footer;
