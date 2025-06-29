"use client";

import React from 'react';

const Loading = () => {
    return (
        <>
          <div className="flex items-center justify-center min-h-screen bg-transparent">
  <div className="relative w-24 h-24">
    {/* First 3D Square */}
    <div className="absolute inset-0 transform-style-preserve-3d animate-spin3D bg-gradient-to-tr from-teal-600 via-purple-500 to-yellow-500 rounded-xl shadow-2xl"></div>

    {/* Second 3D Square */}
    <div className="absolute inset-0 transform-style-preserve-3d animate-spin3DReverse bg-gradient-to-tr from-pink-500 via-indigo-500 to-green-400 rounded-xl shadow-2xl"></div>

    {/* Third 3D Square */}
    <div className="absolute inset-0 transform-style-preserve-3d animate-spin3DSlow bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-400 rounded-xl shadow-2xl"></div>
  </div>
</div>



        </>
    );
};

export default Loading;