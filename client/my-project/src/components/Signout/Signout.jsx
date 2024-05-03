import React from 'react';

const Signout = () => {
  const handleSignout = () => {
    // Your signout logic goes here
    // For example, clear localStorage, reset state, etc.
    localStorage.removeItem('token'); // Assuming you're using a token for authentication
    // Redirect the user to the homepage or login page
    window.location.href = '/';
    // Show alert message
    alert('You have been signed out.');
  };

  return (
    <div className="flex items-center justify-center">
      <button onClick={handleSignout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
        Sign out
      </button>
      {/* <span className="text-gray-600">Click to sign out</span> */}
    </div>
  );
};

export default Signout;
