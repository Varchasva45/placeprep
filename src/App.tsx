import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import Problems from './components/Problems';

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/practice" element={<Problems/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
