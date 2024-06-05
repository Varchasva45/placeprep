import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './index.css';
import Playground from './pages/Playground';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIDocsLanding from './pages/AIDocsLanding';
import AIDocsDashboard from './pages/AIDocsDashboard';
import AuthenticatedRoute from './components/AuthticatedRoute';
import AddProblems from './pages/AddProblems';
import AllProblems from './pages/AllProblems';
import PdfChatPage from './pages/PdfChatPage';

const App = () => {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/playground' element={<Playground />} />
          <Route path='/interview' element={<Landing />} />
          <Route path='/problems' element={<Landing />} />
          <Route path='/assistance' element={<Landing />} />
          <Route path='/community' element={<Landing />} />
          <Route path='/explore' element={<AIDocsLanding />}  />
          <Route path='/dashboard' element={<AuthenticatedRoute><AIDocsDashboard/></AuthenticatedRoute>} />
          <Route path='/dashboard/:pdfId' element={<AuthenticatedRoute><PdfChatPage /></AuthenticatedRoute>} />
          <Route path='/dashboard' element={<AIDocsDashboard/>} />
          <Route path='/add-problems' element={<AddProblems />} />
          <Route path='/all-problems' element={<AllProblems />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
