import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Sparkles,
  Bug,
  Zap,
  Shield,
  Code,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const codeSnippet = `
function analyzeCode(code) {
  // AI-powered analysis starts here...
  if (code.includes('sql') && !code.includes('parameterized')) {
    // 💡 AI Suggestion:
    // Potential SQL injection risk found.
    // Use prepared statements for security.
  }
  return 'No major issues found.';
}`;

  useEffect(() => {
    if (isTyping) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(codeSnippet.slice(0, i));
        i++;
        if (i > codeSnippet.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30); // Typing speed
    }
  }, [isTyping, codeSnippet]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative">
      {/* Background Gradient & Particle Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 opacity-90 z-0"></div>
      <div className="absolute inset-0 z-0">
        <div className="particle-container w-full h-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle absolute rounded-full bg-cyan-400 opacity-0"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16 w-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 animate-pulse-slow">
              Smarter Code Reviews. Powered by AI.
            </h1>
            <p className="mt-6 text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
              Ship clean code faster with automated analysis and suggestions.
            </p>
            <div className="mt-10">
              <button className="relative group overflow-hidden px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 hover:scale-105">
    <Link to="/Codeview">          <span className="relative z-10">Start Your Free Review</span> </Link> 
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white transition-all duration-300"></div>
              </button>
            </div>
          </div>
          {/* Animated AI Brain/Holographic Icon */}
          <div className="relative mt-20 w-94 h-64 md:w-64 md:h-64 animate-spin-slow">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-20"></div>
            <div className="absolute inset-4 rounded-full bg-slate-950"></div>
            <div className="absolute inset-0 flex items-center justify-center text-7xl">
              <Sparkles className="w-16 h-16 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="feature-card p-6 rounded-3xl backdrop-blur-md bg-white/10 border border-gray-700 hover:border-violet-500 transition-all duration-300 transform hover:-translate-y-2">
              <Bug className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Bug Detection</h3>
              <p className="text-gray-300">
                Instantly identify and fix bugs before they make it to production.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="feature-card p-6 rounded-3xl backdrop-blur-md bg-white/10 border border-gray-700 hover:border-violet-500 transition-all duration-300 transform hover:-translate-y-2">
              <Zap className="w-12 h-12 text-fuchsia-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Performance Boost</h3>
              <p className="text-gray-300">
                Get suggestions to optimize your code for maximum speed and efficiency.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="feature-card p-6 rounded-3xl backdrop-blur-md bg-white/10 border border-gray-700 hover:border-violet-500 transition-all duration-300 transform hover:-translate-y-2">
              <Shield className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Security Scan</h3>
              <p className="text-gray-300">
                Proactively scan for vulnerabilities and prevent security breaches.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="feature-card p-6 rounded-3xl backdrop-blur-md bg-white/10 border border-gray-700 hover:border-violet-500 transition-all duration-300 transform hover:-translate-y-2">
              <Code className="w-12 h-12 text-fuchsia-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Clean Code Suggestions</h3>
              <p className="text-gray-300">
                Improve code readability and maintainability with intelligent tips.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 w-full">
          <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/10 border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              See It in Action
            </h2>
            <div className="relative font-mono text-sm md:text-base text-gray-300 p-6 rounded-xl bg-slate-900 border border-gray-700 overflow-hidden">
              <pre className="whitespace-pre-wrap">
                {typedText}
              </pre>
              {isTyping && <span className="caret inline-block w-2 h-4 bg-fuchsia-500 animate-blink"></span>}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
            What Developers Say
          </h2>
          <div className="flex justify-center">
            {/* Simple Testimonial Cards */}
            <div className="max-w-md backdrop-blur-md bg-white/10 border border-gray-700 rounded-3xl p-8 text-center mx-4">
              <img
                src="https://placehold.co/80x80/6d28d9/ffffff?text=Avatar"
                alt="Developer Avatar"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-violet-500"
              />
              <p className="italic text-gray-200">
                "This tool has transformed our workflow. We catch so many more bugs now and our code quality has never been better."
              </p>
              <p className="mt-4 font-semibold text-cyan-400">Ranjit pawar, Lead Engineer</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16 w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Ready to Build Smarter?
          </h2>
          <button className="relative group px-12 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 hover:scale-110 shadow-lg">
            <span className="relative z-10 flex items-center justify-center">
              Start Your Free Review
              <ArrowRight className="ml-2 w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white transition-all duration-300"></div>
          </button>
        </section>

        {/* Custom CSS for animations */}
        <style>
          {`
          .animate-pulse-slow {
            animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
            animation-fill-mode: both;
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-blink {
            animation: blink 1s step-end infinite;
          }
          @keyframes blink {
            from, to { visibility: hidden; }
            50% { visibility: visible; }
          }
          .particle-container .particle {
            animation: particle-float infinite ease-in-out;
          }
          @keyframes particle-float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
            50% { transform: translateY(-200px) scale(1.5); opacity: 0.5; }
          }
          .feature-card:nth-child(1) { animation-delay: 0.2s; }
          .feature-card:nth-child(2) { animation-delay: 0.4s; }
          .feature-card:nth-child(3) { animation-delay: 0.6s; }
          .feature-card:nth-child(4) { animation-delay: 0.8s; }
          `}
        </style>
      </main>
    </div>
  );
};

export default Home;