import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
    
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className='w-full max-w-maxContent bg-blue-100 p-3 border-b-black border-b-[1px] flex justify-between'>
            <Link to="/">
                Logo
            </Link>

            <nav className='hidden md:flex'>
                <ul className='flex flex-row gap-10'>
                    <li>
                        <a href="/interview" className={path === '/interview' ? 'bg-gray-200' : ''}>Interview</a>
                    </li>
                    <li>
                        <a href="/practice" className={path === '/practice' ? 'bg-gray-200' : ''}>Practice</a>
                    </li>
                    <li>
                        <a href="/playground" className={path === '/playground' ? 'bg-gray-200' : ''}>Playground</a>
                    </li>
                    <li>
                        <a href="/explore" className={path === '/explore' ? 'bg-gray-200' : ''}>AI Explore</a>
                    </li>
                    <li>
                        <a href="/assistance" className={path === '/assistance' ? 'bg-gray-200' : ''}>Assistance</a>
                    </li>
                    <li>
                        <a href="/community" className={path === '/community' ? 'bg-gray-200' : ''}>Community</a>
                    </li>
                </ul>
            </nav>

            <div className='flex gap-6 pr-4'>
                <Link to={"/profile"}>
                    Profile
                </Link>

                <Link to={"/login"}>
                    Login
                </Link>
            </div>
        </div>
    );
}

export default NavBar;
