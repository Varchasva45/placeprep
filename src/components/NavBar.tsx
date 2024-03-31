import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


const NavBar: React.FC = () => {
    
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className='w-full max-w-maxContent bg-white flex py-3 justify-between shadow-lg'>

            <Link to="/" className='pl-4 font-bold'>
                PlacePrep
            </Link>

            <nav className='hidden lg:flex'>
                <ul className='flex flex-row gap-8'>
                    <li>
                        <a href="/interview" className={`${path === '/interview' ? 'bg-gray-200' : ''} rounded-2xl`}>Interview</a>
                        <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10} className='pl-1'/></span>
                    </li>
                    <li>
                        <a href="/practice" className={path === '/practice' ? 'bg-gray-200' : ''}>Coding Practice</a>
                    </li>
                    <li>
                        <div>
                            <a href="/playground" className={path === '/playground' ? 'bg-gray-200' : ''}>Playground</a>
                            <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10} className='pl-1'/></span>
                            <div className='z-[1000]'>
                                DropDown List
                            </div>
                        </div>
                    </li>
                    <li>
                        <a href="/explore" className={path === '/explore' ? 'bg-gray-200' : ''}>AI Docs Explore</a>
                    </li>
                    <li>
                        <a href="/assistance" className={path === '/assistance' ? 'bg-gray-200' : ''}>Coding Assistance</a>
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
