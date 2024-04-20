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
<<<<<<< HEAD
          <Route path="/practice" element={<Problems/>} />
=======
          <Route path="/playground" element={<Playground/>} />
>>>>>>> 532d53e57ad47e0d4227e9b41d8a44476029b150
        </Routes>
      </Router>
    </div>
  );
}

export default App;
