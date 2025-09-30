// src/modules/SnippetPopup.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Loader from '../shared/Loader';

const SnippetPopup = React.forwardRef(({ explanation, initialPosition, onClose, onExplain, isLoading }, ref) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    const handleMouseDown = (e) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            setIsDragging(true);
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            setPosition({
                top: e.clientY - dragOffset.current.y,
                left: e.clientX - dragOffset.current.x,
            });
        }
    }, [isDragging]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (!position) return null;

    return (
        <div ref={ref} className="glass-panel absolute bg-gray-800/50 border border-purple-500/30 rounded-lg shadow-lg p-4 w-96 z-50 flex flex-col" style={{ top: position.top, left: position.left, maxHeight: '300px' }}>
            <div className="flex-shrink-0 cursor-move" onMouseDown={handleMouseDown}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer">&times;</button>
                <h4 className="font-bold mb-2 text-purple-300">AI Snippet Explanation</h4>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {isLoading ? (
                    <Loader message="Explaining..." />
                ) : explanation ? (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{explanation}</p>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-gray-400 mb-4">Explain the selected code?</p>
                        <button onClick={onExplain} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105">
                           ✨ Explain Snippet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default SnippetPopup;