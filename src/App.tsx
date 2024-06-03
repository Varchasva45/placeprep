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
import ExploreDashboard from './components/ExploreDashboard';
import AuthenticatedRoute from './components/AuthticatedRoute';
import ChatPage from './components/ChatPage';

const App: React.FC = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {/* <Route path='/playground' element={<AuthenticatedRoute><Playground/></AuthenticatedRoute>} /> */}
          <Route path='/playground' element={<Home />} />
          <Route path='/interview' element={<Home />} />
          <Route path='/problems' element={<Home />} />
          <Route path='/assistance' element={<Home />} />
          <Route path='/community' element={<Home />} />
          <Route path='/explore' element={<ExploreLanding />}  />
          <Route path='/dashboard' element={<AuthenticatedRoute><ExploreDashboard/></AuthenticatedRoute>} />
          <Route path='/dashboard/:pdfId' element={<AuthenticatedRoute><ChatPage/></AuthenticatedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
