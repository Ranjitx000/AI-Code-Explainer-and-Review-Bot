// src/shared/Button.jsx
import React from 'react';

const Button = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ${className}`}
    >
        {children}
    </button>
);

export default Button;