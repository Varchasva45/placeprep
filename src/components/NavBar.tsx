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
        <div className='h-14 w-[calc(100vw-3rem)] mx-auto flex items-center text-black'>

            <div className='w-full flex justify-between items-center'>

                <Link to="/" className='text-lg mr-6'>
                    PlacePrep
                </Link>

                <nav className='hidden lg:flex text-lg'>
                    <ul className='flex flex-row gap-6'>
                        <li>
                            <div className='group'>

                                <Link to="/interview" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/interview' ? 'bg-gray-300 ' : ''}`}>Interview <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10}/></span></Link>

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
                            <Link to="/problems" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/problems' ? 'bg-gray-300 ' : ''}`}>Problems</Link>
                        </li>
                        <li>
                            <div className='group'>

                                <Link to="/playground" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/playground' ? 'bg-gray-300 ' : ''}`}>Playground {' '} <span><FontAwesomeIcon icon={faChevronDown} height={10} width={10}/></span></Link>
                                
                                <div className='absolute invisible opacity-0 flex justify-center items-center bg-zinc-200 rounded-xl shadow-lg w-[180px] translate-x-[-17%] translate-y-[15%] translate-z-[-20%] group-hover:visible group-hover:translate-y-[6%] group-hover:translate-z-[20%]  group-hover:opacity-100 transition-all duration-200 z-50'>
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
                            <Link to="/explore" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/explore' ? 'bg-gray-300 ' : ''}`}>AI Documents</Link>
                        </li>
                        <li>
                            <Link to="/assistance" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/assistance' ? 'bg-gray-300 ' : ''}`}>Assistance</Link>
                        </li>
                        <li>
                            <Link to="/community" className={`rounded-xl p-2 hover:bg-gray-300 ${path === '/community' ? 'bg-gray-300 ' : ''}`}>Community</Link>
                        </li>
                    </ul>
                </nav>

                <div className='flex gap-5 text-lg'>
                    {auth.isAuthenticated ?
                    <>
                        <Link to={"/profile"}>
                            Profile
                        </Link>

                        <Link to={"/logout"} onClick={handleLogout}>
                            Logout
                        </Link>
                    </>   : 
                    <>
                        <Link to={"/login"}>
                            Login
                        </Link>
                        or
                        <Link to={"/signup"}>
                            Sign Up
                        </Link>
                    </>
                    }
                    
                </div>
            </div>
        </div>
        
    );
}

export default NavBar;
