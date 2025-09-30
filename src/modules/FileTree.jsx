// src/modules/FileTree.jsx
import React, { useState } from 'react';
import { FolderIcon, FileIcon } from './Icons';

const TreeRenderer = ({ nodes, onFileClick, selectedFile, pathPrefix = '' }) => {
    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (path) => {
        setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
    };
    
    // Sort so folders appear before files
    const sortedKeys = Object.keys(nodes).sort((a, b) => {
        const nodeA = nodes[a];
        const nodeB = nodes[b];
        if (nodeA.type === nodeB.type) return a.localeCompare(b); // sort alphabetically
        return nodeA.type === 'folder' ? -1 : 1; // folders first
    });

    return sortedKeys.map(key => {
        const currentNode = nodes[key];
        const currentPath = pathPrefix ? `${pathPrefix}/${key}` : key;
        
        if (currentNode.type === 'folder') {
            const isOpen = openFolders[currentPath];
            return (
                <div key={currentPath}>
                    <div onClick={() => toggleFolder(currentPath)} className="flex items-center p-1.5 rounded-md cursor-pointer transition-colors duration-200 hover:bg-purple-500/20 text-gray-300">
                        <FolderIcon isOpen={isOpen} />
                        <span className="truncate text-sm select-none">{key}</span>
                    </div>
                    {isOpen && (
                        <div className="pl-4 border-l border-purple-500/20">
                            <TreeRenderer nodes={currentNode.children} onFileClick={onFileClick} selectedFile={selectedFile} pathPrefix={currentPath} />
                        </div>
                    )}
                </div>
            );
        } else { // File
            return (
                 <div key={currentPath} onClick={() => onFileClick(currentNode.file)} className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors duration-200 hover:bg-purple-500/20 ${selectedFile?.path === currentNode.file.path ? 'bg-purple-500/30 text-white' : 'text-gray-400'}`}>
                    <FileIcon filename={key} />
                    <span className="truncate text-sm select-none">{key}</span>
                </div>
            );
        }
    });
};

const FileTree = ({ tree, onFileClick, selectedFile }) => {
    return <TreeRenderer nodes={tree} onFileClick={onFileClick} selectedFile={selectedFile} />;
};

export default FileTree;