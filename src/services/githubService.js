
// src/services/githubService.js

const GITHUB_API_URL = 'https://api.github.com';
// Optional: Add a personal access token for higher rate limits
// It's safer to use this through a backend, but for client-side apps, this is an option.
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN; 

const headers = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_API_TOKEN && { 'Authorization': `token ${GITHUB_API_TOKEN}` })
};

/**
 * Parses a GitHub URL to extract the owner and repo name.
 * @param {string} url - The full GitHub repository URL.
 * @returns {{owner: string, repo: string}|null}
 */
export const parseRepoUrl = (url) => {
    try {
        const { pathname } = new URL(url);
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
            const owner = pathParts[0];
            const repo = pathParts[1].replace(/\.git$/, '');
            return { owner, repo };
        }
    } catch (e) {
        return null;
    }
    return null;
};

/**
 * Fetches the file tree for a given repository and branch.
 * @param {string} owner - The repository owner.
 * @param {string} repo - The repository name.
 * @param {AbortSignal} signal - AbortController signal to cancel the request.
 * @returns {Promise<Array>} A list of file objects.
 */
export const fetchRepoTree = async (owner, repo, signal) => {
    const repoDetailsResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, { headers, signal });
    if (!repoDetailsResponse.ok) throw new Error(`GitHub API Error: ${repoDetailsResponse.status}. Check URL and if repo is public.`);
    
    const repoDetails = await repoDetailsResponse.json();
    const defaultBranch = repoDetails.default_branch;

    const treeResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers, signal });
    if (!treeResponse.ok) throw new Error(`GitHub API Error: ${treeResponse.status}. Failed to fetch file tree.`);
    
    const data = await treeResponse.json();
    if (data.truncated) {
        console.warn("Warning: The file tree from GitHub API is truncated because the repository is too large.");
    }
    return data.tree.filter(file => file.type === 'blob');
};

/**
 * Fetches the raw content of a specific file.
 * @param {string} owner - The repository owner.
 * @param {string} repo - The repository name.
 * @param {string} path - The path to the file.
 * @param {AbortSignal} signal - AbortController signal to cancel the request.
 * @returns {Promise<string>} The raw text content of the file.
 */
export const fetchFileContent = async (owner, repo, path, signal) => {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
        headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' },
        signal
    });
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
    return response.text();
};