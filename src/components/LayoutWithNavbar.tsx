import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const LayoutWithNavbar = () => {
  return (
    <div>
      <NavBar />
      <Outlet /> 
    </div>
  );
};

export default LayoutWithNavbar;