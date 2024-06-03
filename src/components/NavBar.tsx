import React from 'react';
import { useRecoilValue, useSetRecoilState} from 'recoil';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";
import authState from '../recoil/atoms/auth';

const NavBar: React.FC = () => {
    
    const location = useLocation();
    const path = location.pathname;
    const auth = useRecoilValue(authState);
    const setAuthState = useSetRecoilState(authState);

    const handleLogout = () => {
      Cookies.remove('token');
      Cookies.remove('user');
      setAuthState({ isAuthenticated: false, token: null });
    }

    return (
        <div className='bg-white w-full max-w-maxContent flex py-4 justify-between'>

            <Link to="/" className='pl-4 font-bold'>
                PlacePrep
            </Link>

            <nav className='hidden lg:flex'>
                <ul className='flex flex-row gap-8'>
                    <li>
                        <div className='group'>

                            <Link to="/interview" className={`rounded-full p-2 ${path === '/interview' ? 'bg-gray-200' : ''}`}>Interview</Link>
                            <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10}/></span>

                            <div className='absolute invisible opacity-0 flex justify-center items-center w-5/12 h-2/5 bg-blue-100 rounded-xl shadow-lg translate-x-[-25%] translate-y-[15%] translate-z-[-20%] group-hover:visible group-hover:translate-y-[6%] group-hover:translate-z-[20%]  group-hover:opacity-100 transition-all duration-200'>
                                <ul className='w-full h-full flex p-3'>
                                    <li className='w-full h-full flex flex-col justify-center items-center hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">AI Interview</Link>
                                    </li>
                                    <li className='w-full h-full flex flex-col justify-center items-center hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">SDE Interview</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <Link to="/practice" className={`rounded-full p-2 ${path === '/practice' ? 'bg-gray-200' : ''}`}>Coding Practice</Link>
                    </li>
                    <li>
                        <div className='group'>

                            <Link to="/playground" className={`rounded-full p-2 ${path === '/playground' ? 'bg-gray-300' : ''}`}>Playground</Link>
                            <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10}/></span>

                            <div className='absolute invisible opacity-0 flex justify-center items-center bg-blue-100 rounded-xl shadow-lg w-[180px] translate-x-[-25%] translate-y-[15%] translate-z-[-20%] group-hover:visible group-hover:translate-y-[8%] group-hover:translate-z-[20%]  group-hover:opacity-100 transition-all duration-200'>
                                <ul className='w-full text-center flex flex-col p-3'>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">Python</Link>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">Java</Link>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">C++</Link>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">C</Link>
                                    </li>
                                    <li className='w-full hover:bg-white rounded-lg p-2'>
                                        <Link to="/playground">JavaScript</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <Link to="/explore" className={`rounded-full p-2 ${path === '/explore' ? 'bg-gray-200' : ''}`}>AI Docs Explore</Link>
                    </li>
                    <li>
                        <Link to="/assistance" className={`rounded-full p-2 ${path === '/assistance' ? 'bg-gray-200' : ''}`}>Coding Assistance</Link>
                    </li>
                    <li>
                        <Link to="/community" className={`rounded-full p-2 ${path === '/community' ? 'bg-gray-200' : ''}`}>Community</Link>
                    </li>
                </ul>
            </nav>

            <div className='flex gap-6 pr-4'>
                {auth.isAuthenticated ?
                  <>
                    <Link to={"/profile"}>
                      Profile
                    </Link>
                    or
                    <Link to={"#"} onClick={handleLogout}>
                      Logout
                    </Link>
                  </>   : 
                  <>
                    <Link to={"/signup"}>
                        Signup
                    </Link>
                    or
                    <Link to={"/login"}>
                        Login
                    </Link>
                  </>
                }
                
            </div>
        </div>
    );
}

export default NavBar;
