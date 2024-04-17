import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import Playground from './components/Playground';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/playground" element={<Playground/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
