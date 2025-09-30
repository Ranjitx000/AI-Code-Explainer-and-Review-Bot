import React from 'react';
import Home from './home/Home';
import Codeview from './home/Codeview';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <nav>
        {/* Link with text */}
        <Link to="/Codeview"></Link>
      </nav>

      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Codeview route */}
        <Route path="/Codeview" element={<Codeview />} />
      </Routes>
    </Router>
  );
};

export default App;

