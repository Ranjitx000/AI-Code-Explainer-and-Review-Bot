// src/utils/promptTemplates.js

export const prompts = {
    generalExplanation: (filePath, code, question) => `
        Analyze the following code from the file "${filePath}".
        User's question: "${question || 'Provide a high-level explanation of what this code does.'}"
        Provide a clear and concise explanation. Format the response using markdown.

        Code:
        \`\`\`
        ${code}
        \`\`\`
    `,
    mindMap: (filePath, code) => `
        Generate a hierarchical JSON object representing the structure of the code below.
        The root node should be the file name. Each node must have a "name" (string) and "type" (string, e.g., "function", "class", "import").
        Nested structures should be in a "children" array.
        IMPORTANT: Respond with only the raw JSON object, without any surrounding text or markdown formatting.

        File: ${filePath}
        Code:
        \`\`\`
        ${code}
        \`\`\`
    `,
    codeQuality: (filePath, code) => `
        Analyze the code in "${filePath}" for quality, bugs, and potential improvements.
        Provide suggestions as a JSON array. Each object in the array must have three keys: "line" (number or "N/A"), "issue" (string), and "suggestion" (string).
        IMPORTANT: Respond with only the raw JSON array, without any surrounding text or markdown formatting.

        Code:
        \`\`\`
        ${code}
        \`\`\`
    `,
    autoComment: (code) => `
        Add helpful, concise inline comments to the following code.
        Return only the complete, updated code with the comments added. Do not add any explanation, just the raw code.

        Code:
        \`\`\`
        ${code}
        \`\`\`
    `,
    unitTests: (code, language) => {
        const framework = language === 'python' ? 'PyTest' : 'Jest/React Testing Library';
        return `
            Generate unit tests for the following code using the ${framework} framework.
            Provide only the test code in a single code block. Do not add any explanations or surrounding text.

            Code:
            \`\`\`
            ${code}
            \`\`\`
        `;
    },
    snippetExplanation: (snippet) => `
        Explain the following code snippet concisely. Focus on its purpose and functionality.

        Snippet:
        \`\`\`
        ${snippet}
        \`\`\`
    `
};