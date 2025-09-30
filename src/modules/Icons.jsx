// src/modules/Icons.jsx
import React from 'react';

export const FolderIcon = ({ isOpen }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-400 flex-shrink-0">
        {isOpen ? (
            <>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"></path>
            </>
        ) : (
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        )}
    </svg>
);

export const FileIcon = ({ filename }) => {
    const extension = filename.split('.').pop();
    let color = "text-gray-400";
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) color = "text-yellow-400";
    if (['py'].includes(extension)) color = "text-blue-400";
    if (['html', 'css'].includes(extension)) color = "text-orange-400";
    if (['md', 'json'].includes(extension)) color = "text-green-400";
    
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 ${color} flex-shrink-0`}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
};