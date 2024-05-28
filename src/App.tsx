import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './index.css';
import Playground from './components/Playground';
import Home from './components/Home';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/playground" element={<Playground/>} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
