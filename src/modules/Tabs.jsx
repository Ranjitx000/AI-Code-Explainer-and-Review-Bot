import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import MindMap from './MindMap';
import Loader from '../shared/Loader';
import Button from '../shared/Button';

const TabButton = ({ name, activeTab, onClick, title }) => (
    <button
        onClick={() => onClick(name)}
        className={`py-3 px-5 text-sm font-medium transition-colors duration-300 ${
            activeTab === name ? 'tab-active' : 'text-gray-400 hover:bg-purple-500/10'
        }`}
    >
        {title}
    </button>
);

const Tabs = ({ activeTab, setActiveTab, analysis, isLoading, onGenerate, onAsk, error }) => {
    const [question, setQuestion] = useState('');
    
    const handleAsk = () => {
        onAsk(question);
    };

    const renderContent = () => {
        if (isLoading) return <Loader message="AI is thinking..." />;
        if (error) return <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>;

        switch (activeTab) {
            case 'explanation':
                return (
                    <div>
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                                placeholder="Ask a specific question about the code..."
                                className="w-full p-2 bg-gray-900/50 border border-purple-500/30 rounded-l-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <Button onClick={handleAsk} disabled={isLoading} className="rounded-l-none">
                                Ask AI
                            </Button>
                        </div>
                        {analysis.explanation ? (
                             <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(analysis.explanation.replace(/\n/g, '<br />')) }}></div>
                        ) : <p className="text-gray-400">Ask a general question or something specific about the code in the editor.</p>}
                    </div>
                );
            case 'mindmap':
                return analysis.mindMapData ? <MindMap data={analysis.mindMapData} /> : <p className="text-gray-400">Click "Generate" to create a mind map of the code's structure.</p>;
            case 'quality':
                return analysis.quality?.length > 0 ? (
                    <div className="space-y-4">
                        {analysis.quality.map((item, index) => (
                            <div key={index} className="glass-panel p-3 rounded-md border-l-4 border-yellow-400">
                                <p className="font-semibold text-yellow-300">Line {item.line}: {item.issue}</p>
                                <p className="text-gray-300 mt-1">{item.suggestion}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-400">Click "Generate" to analyze code quality and get improvement suggestions.</p>;
            case 'comment':
                 return <p className="text-gray-400">Click "Generate" to add comments to the code in the editor above.</p>;
            case 'tests':
                return analysis.testCode ? (
                     <pre className="bg-gray-900/80 p-4 rounded-md text-sm whitespace-pre-wrap break-all"><code>{analysis.testCode}</code></pre>
                ) : <p className="text-gray-400">Click "Generate" to create unit tests for the current file.</p>;
            default:
                return null;
        }
    };
    
    // Determine if the "Generate" button should be shown for the current tab
    const showGenerateButton = ['mindmap', 'quality', 'comment', 'tests'].includes(activeTab);

    return (
        <div className="flex-1 flex flex-col panel-bg glass-panel overflow-hidden min-h-0">
            <div className="flex border-b border-purple-500/20 flex-wrap flex-shrink-0 justify-between items-center pr-4">
                <div>
                    <TabButton name="explanation" title="AI Assistant" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="mindmap" title="Mind Map" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="quality" title="Code Quality" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="comment" title="Auto Comment" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="tests" title="Generate Tests" activeTab={activeTab} onClick={setActiveTab} />
                </div>
                {showGenerateButton && <Button onClick={() => onGenerate(activeTab)} disabled={isLoading}>✨ Generate</Button>}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default Tabs;
