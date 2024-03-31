import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


const NavBar: React.FC = () => {
    
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className='w-full max-w-maxContent shadow-lg bg-gray-300 flex py-3 justify-between'>

            <Link to="/" className='pl-4 font-bold'>
                PlacePrep
            </Link>

            <nav className='hidden lg:flex'>
                <ul className='flex flex-row gap-8'>
                    <li>
                        <div className='group'>

                            <a href="/interview" className={path === '/interview' ? 'bg-gray-200' : ''}>Interview</a>
                            <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10} className='pl-1'/></span>

                            <div className='absolute invisible opacity-0 flex justify-center items-center w-5/12 h-2/5  bg-blue-100 rounded-xl shadow-lg translate-x-[-25%] translate-y-[15%] translate-z-[-20%] group-hover:visible group-hover:translate-y-[6%] group-hover:translate-z-[20%]  group-hover:opacity-100 transition-all duration-200'>
                                <ul className='w-full h-full flex p-3'>
                                    <li className='w-full h-full flex flex-col justify-center items-center hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">AI Interview</a>
                                    </li>
                                    <li className='w-full h-full flex flex-col justify-center items-center hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">SDE Interview</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <a href="/practice" className={path === '/practice' ? 'bg-gray-200' : ''}>Coding Practice</a>
                    </li>
                    <li>
                        <div className='group'>

                            <a href="/playground" className={path === '/playground' ? 'bg-gray-300' : ''}>Playground</a>
                            <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10} className='pl-1'/></span>

                            <div className='absolute invisible opacity-0 flex justify-center items-center bg-blue-100 rounded-xl shadow-lg w-[180px] translate-x-[-25%] translate-y-[15%] translate-z-[-20%] group-hover:visible group-hover:translate-y-[8%] group-hover:translate-z-[20%]  group-hover:opacity-100 transition-all duration-200'>
                                <ul className='w-full text-center flex flex-col p-3'>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">Python</a>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">Java</a>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">C++</a>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">C</a>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <a href="/playground">JavaScript</a>
                                    </li>
                                </ul>
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
