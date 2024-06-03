import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './index.css';
import Playground from './components/Playground';
import Home from './components/Home';
import Login from './components/LoginForm';
import Signup from './components/SignupForm';
import ExploreLanding from './components/ExploreLanding';
import AddProblems from './components/AddProblems';
import AllProblems from './components/AllProblems';

const App: React.FC = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/playground' element={<Playground/>} />
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/explore' element={<ExploreLanding />}  />
          <Route path='/add-problems' element={<AddProblems />} />
          <Route path='/all-problems' element={<AllProblems />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
