import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import "./index.css";
import Playground from "./pages/Playground";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AIDocsLanding from "./pages/AIDocsLanding";
import AIDocsDashboard from "./pages/AIDocsDashboard";
import AuthenticatedRoute from "./components/AuthticatedRoute";
import AddProblems from "./pages/AddProblems";
import AllProblems from "./pages/AllProblems";
import PdfChatPage from "./pages/PdfChatPage";
import LayoutWithAIDocsNavbar from "./components/LayoutWithAIDocsNavbar";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import Pricing from "./pages/Pricing";
import Test from "./components/Test";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="light h-full w-full">
      <Toaster />
      <Router>
        <Routes>
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/u/:userid" element={<Profile />} />
            <Route path="/explore" element={<AIDocsLanding />} />
          </Route>

          <Route path="/problems" element={<Landing />} />
          <Route path="/sheets" element={<Landing />} />
          <Route path="/interview" element={<Landing />} />
          <Route path="/playground" element={<Playground />} />

          <Route element={<LayoutWithAIDocsNavbar />}>
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <AIDocsDashboard />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/dashboard/:pdfId"
              element={
                <AuthenticatedRoute>
                  <PdfChatPage />
                </AuthenticatedRoute>
              }
            />
          </Route>

          <Route path="/assistance" element={<Landing />} />
          <Route path="/community" element={<Landing />} />
          <Route path="/add-problems" element={<AddProblems />} />
          <Route path="/all-problems" element={<AllProblems />} />
          <Route path="/test" element={<Test></Test>} />

          <Route element={<LayoutWithNavbar />}>
            <Route path="*" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
