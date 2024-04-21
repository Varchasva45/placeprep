import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import Playground from './components/Playground';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/playground" element={<Playground/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
