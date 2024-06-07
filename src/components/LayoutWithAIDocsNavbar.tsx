import { Outlet } from 'react-router-dom';
import AIDocsNavbar from './AIDocsNavbar';

const LayoutWithAIDocsNavbar = () => {
  return (
    <div>
      <AIDocsNavbar />
      <Outlet /> 
    </div>
  );
};

export default LayoutWithAIDocsNavbar;