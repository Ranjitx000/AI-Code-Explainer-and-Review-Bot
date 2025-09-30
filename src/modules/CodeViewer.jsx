import React from 'react';
import Button from '../shared/Button';

const CodeViewer = React.forwardRef(({ file, editedContent, onContentChange, onDownload }, ref) => {
    if (!file) {
        return (
            <div className="flex-grow flex items-center justify-center text-gray-500 h-full">
                <p>Select a file to begin analysis.</p>
            </div>
        );
    }

    return (
        <div className="p-4 overflow-hidden h-full code-viewer-bg flex flex-col" ref={ref}>
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <h3 className="text-lg font-semibold text-white truncate pr-4">
                    {file.path}
                </h3>
                <Button onClick={onDownload} className="py-1 px-3 text-sm">
                    Download
                </Button>
            </div>
            <textarea
                value={editedContent}
                onChange={(e) => onContentChange(e.target.value)}
                className="flex-1 w-full bg-transparent text-sm whitespace-pre font-mono resize-none border-none focus:outline-none p-2 -ml-2 text-gray-300 leading-relaxed"
                spellCheck="false"
            />
        </div>
    );
});

export default CodeViewer;