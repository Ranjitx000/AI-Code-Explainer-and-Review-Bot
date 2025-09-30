// src/utils/formatHelpers.js

/**
 * Builds a nested tree structure from a flat list of file paths.
 * @param {Array<Object>} files - A flat list of file objects from the GitHub API.
 * @returns {Object} A nested object representing the file tree.
 */
export const buildFileTree = (files) => {
    const tree = {};
    files.forEach(file => {
        const pathParts = file.path.split('/');
        let currentLevel = tree;

        pathParts.forEach((part, index) => {
            if (index === pathParts.length - 1) {
                // It's a file
                currentLevel[part] = { type: 'file', file: file };
            } else {
                // It's a folder
                if (!currentLevel[part]) {
                    currentLevel[part] = { type: 'folder', children: {} };
                }
                currentLevel = currentLevel[part].children;
            }
        });
    });
    return tree;
};

/**
 * Cleans the raw text response from the Gemini API.
 * It removes markdown code blocks (```json, ```) and trims whitespace.
 * @param {string} text - The raw text from the API.
 * @returns {string} The cleaned text, ready for JSON parsing or display.
 */
export const cleanAiResponse = (text) => {
    return text.replace(/```(json|javascript|python|typescript)?\n/g, '').replace(/```/g, '').trim();
};