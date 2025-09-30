// src/shared/Loader.jsx
import React from 'react';

const Loader = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center h-full text-purple-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <p className="mt-3 text-sm">{message}</p>
    </div>
);

export default Loader;