
import React from 'react';

const Signout = () => {
  const handleSignout = () => {
    // Your signout logic goes here
    // For example, clear localStorage, reset state, etc.
    localStorage.removeItem('token'); // Assuming you're using a token for authentication
    // Redirect the user to the homepage or login page
    window.location.href = '/';
  };

  return (
    <button onClick={handleSignout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Sign out
    </button>
  );
};

export default Signout;
