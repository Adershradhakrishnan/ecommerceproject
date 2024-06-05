import React from 'react';
import Swal from 'sweetalert2';

const Signout = () => {
  const handleSignout = () => {
    // Your signout logic goes here
    // For example, clear localStorage, reset state, etc.
    localStorage.removeItem('token'); // Assuming you're using a token for authentication

    // Show SweetAlert2 alert message
    Swal.fire({
      icon: 'success',
      title: 'Signed Out',
      text: 'You have been signed out successfully.',
    }).then(() => {
      // Redirect the user to the homepage or login page
      window.location.href = '/';
    });
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
