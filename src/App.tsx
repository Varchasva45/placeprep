import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          {/* Define your routes here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
