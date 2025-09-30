import React, { useState, useRef, useCallback } from 'react';
import { parseRepoUrl, fetchRepoTree, fetchFileContent } from '../services/githubService';
import { callGemini } from '../services/geminiService';
import { prompts } from '../utils/promptTemplates';
import { buildFileTree } from '../utils/formatHelpers';

import FileTree from '../modules/FileTree';
import CodeViewer from '../modules/CodeViewer';
import SnippetPopup from '../modules/SnippetPopup';
import Tabs from '../modules/Tabs';
import Button from '../shared/Button';
import Loader from '../shared/Loader';

const Codeview = () => {
    // State for Repo and Files
    const [repoUrl, setRepoUrl] = useState('https://github.com/d3/d3');
    const [repoInfo, setRepoInfo] = useState(null);
    const [fileTree, setFileTree] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [editedContent, setEditedContent] = useState(''); // New state for editable content
    
    // State for AI Analysis
    const [analysis, setAnalysis] = useState({});
    const [activeTab, setActiveTab] = useState('explanation');

    // State for Snippet Explanation
    const [snippetPopup, setSnippetPopup] = useState(null);
    const [selectedSnippet, setSelectedSnippet] = useState('');
    const [snippetExplanation, setSnippetExplanation] = useState('');
    const [isSnippetLoading, setIsSnippetLoading] = useState(false);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isTabLoading, setIsTabLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Refs
    const codeViewerRef = useRef(null);
    const snippetPopupRef = useRef(null);
    const fetchControllerRef = useRef(null);
    
    // State and Refs for Resizable Panels
    const [leftPanelWidth, setLeftPanelWidth] = useState(25);
    const [topPanelHeight, setTopPanelHeight] = useState(60);
    const isResizingVertical = useRef(false);
    const isResizingHorizontal = useRef(false);
    const mainContentRef = useRef(null);

    // --- Resizing Logic (as before) ---
    const handleVerticalResize = useCallback((e) => {
        if (isResizingVertical.current) {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 15 && newWidth < 75) setLeftPanelWidth(newWidth);
        }
    }, []);

    const handleHorizontalResize = useCallback((e) => {
        if (isResizingHorizontal.current && mainContentRef.current) {
            const mainPanelRect = mainContentRef.current.getBoundingClientRect();
            const newHeight = ((e.clientY - mainPanelRect.top) / mainPanelRect.height) * 100;
            if (newHeight > 20 && newHeight < 80) setTopPanelHeight(newHeight);
        }
    }, []);

    const stopResizing = useCallback(() => {
        isResizingVertical.current = false;
        isResizingHorizontal.current = false;
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleVerticalResize);
        window.removeEventListener('mousemove', handleHorizontalResize);
        window.removeEventListener('mouseup', stopResizing);
    }, [handleVerticalResize, handleHorizontalResize]);

    const startVerticalResize = useCallback((e) => {
        e.preventDefault();
        isResizingVertical.current = true;
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', handleVerticalResize);
        window.addEventListener('mouseup', stopResizing);
    }, [handleVerticalResize, stopResizing]);

    const startHorizontalResize = useCallback((e) => {
        e.preventDefault();
        isResizingHorizontal.current = true;
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleHorizontalResize);
        window.addEventListener('mouseup', stopResizing);
    }, [handleHorizontalResize, stopResizing]);
    
    // --- Data & File Handling Logic ---
    const handleLoadRepo = async () => {
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        const info = parseRepoUrl(repoUrl);
        if (!info) {
            setError("Invalid GitHub repository URL.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setFileTree({});
        setSelectedFile(null);
        setFileContent('');
        setEditedContent('');
        setAnalysis({});
        setRepoInfo(info);

        try {
            const files = await fetchRepoTree(info.owner, info.repo, controller.signal);
            setFileTree(buildFileTree(files));
        } catch (err) {
            if (err.name !== 'AbortError') setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileClick = async (file) => {
        if (selectedFile?.path === file.path) return;
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        setIsLoading(true);
        setError(null);
        setSelectedFile(file);
        setFileContent('');
        setEditedContent('');
        setAnalysis({});
        setActiveTab('explanation');

        try {
            const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, file.path, controller.signal);
            setFileContent(content);
            setEditedContent(content); // Initialize editable content
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(`Failed to fetch file: ${err.message}`);
                setSelectedFile(null);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleContentChange = (newContent) => {
        setEditedContent(newContent);
    };

    const handleDownloadFile = () => {
        if (!selectedFile || editedContent === null) return;
        const blob = new Blob([editedContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedFile.path.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    // --- AI Interaction Logic ---
    const handleGenerateForTab = async (tabName, question = '') => {
        if (!fileContent) return;
        setIsTabLoading(true);
        setError(null);
        
        try {
            let result;
            switch(tabName) {
                case 'explanation':
                    result = await callGemini(prompts.generalExplanation(selectedFile.path, editedContent, question));
                    setAnalysis(prev => ({ ...prev, explanation: result }));
                    break;
                case 'mindmap':
                    result = await callGemini(prompts.mindMap(selectedFile.path, editedContent), true);
                    setAnalysis(prev => ({ ...prev, mindMapData: result }));
                    break;
                case 'quality':
                    result = await callGemini(prompts.codeQuality(selectedFile.path, editedContent), true);
                    setAnalysis(prev => ({ ...prev, quality: result }));
                    break;
                case 'comment':
                    result = await callGemini(prompts.autoComment(editedContent));
                    setEditedContent(result); // Directly update the editor
                    break;
                case 'tests':
                    const lang = selectedFile.path.split('.').pop();
                    result = await callGemini(prompts.unitTests(editedContent, lang));
                    setAnalysis(prev => ({ ...prev, testCode: result }));
                    break;
                default:
                    throw new Error("Unknown analysis type");
            }
        } catch (err) {
             setError(err.message);
        } finally {
            setIsTabLoading(false);
        }
    };

    const handleMouseUp = (e) => {
        if (snippetPopupRef.current?.contains(e.target)) return;
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text && codeViewerRef.current?.contains(selection.anchorNode)) {
            setSelectedSnippet(text);
            setSnippetExplanation('');
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setSnippetPopup({ left: e.clientX + 15, top: e.clientY });
        } else {
            setSnippetPopup(null);
        }
    };

    const handleExplainSnippet = async () => {
        if (!selectedSnippet) return;
        setIsSnippetLoading(true);
        try {
            const result = await callGemini(prompts.snippetExplanation(selectedSnippet));
            setSnippetExplanation(result);
        } catch (err) {
            setSnippetExplanation(`Error: ${err.message}`);
        } finally {
            setIsSnippetLoading(false);
        }
    };
    
    return (
        <div className="main-bg text-gray-200 min-h-screen font-sans flex flex-col">
            <header className="sidebar-bg p-4 border-b border-purple-500/20 flex items-center justify-between flex-shrink-0">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                    <span className="text-purple-400">AI</span> Code Explainer
                </h1>
            </header>
            
            <main className="flex flex-1 overflow-hidden">
                <aside 
                    className="sidebar-bg p-4 flex flex-col overflow-y-auto flex-shrink-0"
                    style={{ flexBasis: `${leftPanelWidth}%` }}
                >
                    <div className="mb-4">
                        <label htmlFor="repo-url" className="block text-sm font-medium mb-2 text-purple-300">GitHub Repository</label>
                        <div className="flex">
                            <input type="text" id="repo-url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLoadRepo()} placeholder="https://github.com/owner/repo" className="w-full p-2 bg-gray-900/50 border border-purple-500/30 rounded-l-md focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                            <Button onClick={handleLoadRepo} disabled={isLoading || !repoUrl} className="rounded-l-none">
                                {isLoading && !Object.keys(fileTree).length ? '...' : 'Load'}
                            </Button>
                        </div>
                    </div>
                    {error && !Object.keys(fileTree).length && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
                    <h2 className="text-lg font-semibold mt-4 border-b border-purple-500/20 pb-2 mb-2 text-white">File Explorer</h2>
                    {isLoading && Object.keys(fileTree).length === 0 ? <Loader/> : <FileTree tree={fileTree} onFileClick={handleFileClick} selectedFile={selectedFile} />}
                </aside>
                
                <div 
                    onMouseDown={startVerticalResize}
                    className="w-1.5 flex-shrink-0 cursor-col-resize bg-gray-900/50 hover:bg-purple-600 transition-colors duration-200"
                />
                
                <section ref={mainContentRef} className="flex-1 flex flex-col relative bg-gray-900 overflow-hidden">
                     <SnippetPopup ref={snippetPopupRef} initialPosition={snippetPopup} explanation={snippetExplanation} isLoading={isSnippetLoading} onClose={() => setSnippetPopup(null)} onExplain={handleExplainSnippet} />

                    <div 
                        className="overflow-hidden flex flex-col"
                        style={{ height: `${topPanelHeight}%` }}
                        onMouseUp={handleMouseUp}
                    >
                        <CodeViewer 
                            ref={codeViewerRef} 
                            file={selectedFile} 
                            editedContent={editedContent}
                            onContentChange={handleContentChange}
                            onDownload={handleDownloadFile}
                        />
                    </div>

                    <div 
                        onMouseDown={startHorizontalResize}
                        className="h-1.5 cursor-row-resize bg-gray-900/50 hover:bg-purple-600 transition-colors duration-200"
                    />

                    <div className="flex-1 flex flex-col min-h-0">
                       {selectedFile && <Tabs activeTab={activeTab} setActiveTab={setActiveTab} analysis={analysis} isLoading={isTabLoading} onGenerate={handleGenerateForTab} onAsk={(q) => handleGenerateForTab('explanation', q)} error={error} />}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Codeview;
