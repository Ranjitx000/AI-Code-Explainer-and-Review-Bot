// src/services/geminiService.js

import { cleanAiResponse } from '../utils/formatHelpers';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Calls the Gemini API with a specific prompt.
 * @param {string} prompt - The prompt to send to the model.
 * @param {boolean} expectJson - Whether to parse the response as JSON.
 * @returns {Promise<string|Object>} The processed response from the AI.
 */
export const callGemini = async (prompt, expectJson = false) => {
    if (!API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not set in your environment variables.");
    }
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch (e) {
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }
        throw new Error(`Gemini API Error: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        throw new Error("AI returned an empty or invalid response.");
    }

    const cleanedText = cleanAiResponse(rawText);

    if (expectJson) {
        try {
            return JSON.parse(cleanedText);
        } catch (error) {
            console.error("Failed to parse AI JSON response:", cleanedText);
            throw new Error("AI returned malformed JSON.");
        }
    }
    
    return cleanedText;
};