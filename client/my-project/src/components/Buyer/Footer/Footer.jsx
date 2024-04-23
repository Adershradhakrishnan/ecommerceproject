import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-orange-500 py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-300">Category 1</a></li>
              <li><a href="#" className="hover:text-gray-300">Category 2</a></li>
              <li><a href="#" className="hover:text-gray-300">Category 3</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>123 Street Name, City, Country</p>
            <p>Email: example@example.com</p>
            <p>Phone: +1234567890</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-instagram"></i></a>
            </div>
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
