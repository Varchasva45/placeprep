import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import { Button } from "../components/ui/button";
import { FaLocationDot } from "react-icons/fa6";
import { FaBuilding, FaGithub, FaLinkedin } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { GoChecklist } from "react-icons/go";
import { ChevronRight, Eye, Ghost, Medal } from "lucide-react";
import ProblemHeatMap from "../components/HeatMap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionsFullScreen from "../components/SubmissionsFullScreen";
import EditProfilePage from "../components/EditProfilePage";

const Profile = () => {
    const user = useRecoilValue(userState);
    const [selectedTab, setSelectedTab] = useState<string>('Recent AC');
    const [isEditProfilePageVisible, setIsEditProfilePageVisible] = useState<boolean>(true);

    useEffect(() => {
        
    }, []);

    var commitsPerDate: any = [];

    function generateFakeCommitData() {  
        for (let month = 0; month < 12; month++) { 
            const numberOfDays = new Date(2023, month + 1, 0).getDate();

            for (let day = 1; day <= numberOfDays; day++) {
                const currentDate = new Date(2023, month, day, 5);  
                commitsPerDate.push({
                    date: currentDate.toJSON().substring(0, 10),
                    count: Math.floor(Math.random() * 100)
                });
            }
        }
    }

    generateFakeCommitData();

    const items = [
        { title: 'Determine the Maximum Path Sum', time: '2 hours ago' },
        { title: 'Find the Longest Increasing Subsequence', time: '3 hours ago' },
        { title: 'Evaluate the Binary Tree Paths', time: '4 hours ago' },
        { title: 'Optimize Network Latency', time: '5 hours ago' },
        { title: 'Calculate the Shortest Path', time: '6 hours ago' },
        { title: 'Analyze the Stock Market Trends', time: '7 hours ago' },
        { title: 'Design a File System', time: '8 hours ago' },
        { title: 'Implement a Cache Mechanism', time: '9 hours ago' },
        { title: 'Determine the Maximum Path Sum', time: '2 hours ago' },
        { title: 'Find the Longest Increasing Subsequence', time: '3 hours ago' },
        { title: 'Evaluate the Binary Tree Paths', time: '4 hours ago' }
    ];

    return (
        <div className='mx-auto w-10/12 mt-6 mb-6 bg-gray'>
            <div className='lg:flex'>
                {/* Left Card */}
                <div className='flex-[0.4] h-full'>
                    <div className='bg-white p-4 rounded-lg shadow-lg'>
                        <div className='flex'>
                            <img src={user?.imageUrl} alt='profile' className='rounded-md' loading='lazy' />
                            <div className='px-4 flex flex-col justify-between'>
                                <div>
                                    <h1 className='font-semibold text-xl'>{user?.name}</h1>
                                    <p className='text-gray-600 text-sm'>{user?.email}</p>
                                </div>
                                <Link to={'/pricing'} className='text-md text-yellow-500 flex items-center cursor-pointer hover:text-yellow-600'>
                                    {user.isSubscribed ? 'Premium Plan' : 'Regular Plan'} 
                                    <span className='flex pt-[0.2rem]'>
                                        <ChevronRight className='h-4 w-4' />
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <p className='text-gray-600 font-semibold my-5 text-md'>Pre-final Year Engineering Student</p>

                        <Button onClick={() => setIsEditProfilePageVisible((prev) => !prev)} className='w-full bg-green-100 text-green-400 hover:bg-green-200'>
                            Edit Profile
                        </Button>

                        <div className='text-gray-600 my-5 text-md space-y-5'>
                            <h3 className='flex items-center'>
                                <FaLocationDot className='mr-3' />
                                Noida
                            </h3>
                            <p className='flex items-center truncate'>
                                <FaBuilding className='mr-3' />
                                Jaypee Institute of Information Technology
                            </p>
                            <h3 className='flex items-center cursor-pointer hover:text-black'>
                                <FaLinkedin className='mr-3' />
                                varchasvaarora
                            </h3>
                            <h3 className='flex items-center cursor-pointer hover:text-black'>
                                <FaGithub className='mr-3' />
                                Varchasva45
                            </h3>
                        </div>

                        <div className='h-[0.05rem] bg-gray-300'></div>

                        <div className='my-5'>
                            <h3 className='font-semibold text-lg'>Profile Stats</h3>
                            <div className='mt-3 space-y-5 text-gray-600 text-md'>
                                <h3 className='flex items-center cursor-pointer hover:text-black'>
                                    <Eye className='mr-3 text-blue-500 h-5 w-5' />
                                    Views <span className='pl-2 text-black'>1.4K</span>
                                </h3>
                                <h3 className='flex items-center cursor-pointer hover:text-black'>
                                    <Medal className='mr-3 h-5 w-5' />
                                    Respect <span className='pl-2 text-black'>8</span>
                                </h3>
                            </div>
                        </div>

                        <div className='h-[0.05rem] bg-gray-300'></div>

                        <div className='mt-5'>
                            <h3 className='font-semibold text-lg'>Languages</h3>
                            <div className='mt-5 mb-3 space-y-5 text-gray-600 text-md'>
                                <h3 className='flex items-center cursor-pointer hover:text-black justify-between'>
                                    <span className='mr-3 flex items-center bg-gray-200 px-2 rounded-2xl'>C++</span>
                                    <span className='mx-2 text-black'>264 <span className='text-gray-600'>problems solved</span></span>
                                </h3>
                                <h3 className='flex items-center cursor-pointer hover:text-black justify-between'>
                                    <span className='mr-3 flex items-center bg-gray-200 px-2 rounded-2xl'>Java</span>
                                    <span className='mx-2 text-black'>119 <span className='text-gray-600'>problems solved</span></span>
                                </h3>
                                <h3 className='flex items-center cursor-pointer hover:text-black justify-between'>
                                    <span className='mr-3 flex items-center bg-gray-200 px-2 rounded-2xl'>My SQL</span>
                                    <span className='mx-2 text-black'>310 <span className='text-gray-600'>problems solved</span></span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Cards */}
                <div className='flex-1 mt-4 lg:mt-0 lg:ml-4 items-center justify-center space-y-4'>
                    {isEditProfilePageVisible && 
                        <div className='shadow-lg rounded-lg bg-white'>
                            <EditProfilePage setIsEditProfilePageVisible={setIsEditProfilePageVisible} />
                        </div>
                    }

                    {!isEditProfilePageVisible && 
                        <>
                            {/* HeatMap */}
                            <div className='p-4 shadow-lg rounded-lg bg-white'>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                    <h1><span className='text-lg font-semibold text-black'>1,348 {' '}</span> Submissions in 2024</h1>
                                    <h1> Total Active Days: <span className='font-semibold text-black'>29</span></h1>
                                </div>
                                <div className='w-full flex items-center justify-center'>
                                    <ProblemHeatMap commitsData={commitsPerDate} />
                                </div>
                            </div>

                            {/* Submissions */}
                            <div className='shadow-lg rounded-lg bg-white p-4'>
                                {/* Top Nav */}
                                <div className='flex justify-between select-none'>
                                    <div className='flex text-md text-gray-600 font-semibold'>
                                        <h3 className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === 'Recent AC' ? 'bg-gray-100 rounded-md text-black' : ''}`} onClick={() => setSelectedTab('Recent AC')}>
                                            <GoChecklist className='w-7 h-6' />Recent AC
                                        </h3>
                                        <h3 className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === 'Lists' ? 'bg-gray-100 rounded-md text-black' : ''}`} onClick={() => setSelectedTab('Lists')}>
                                            <LuClipboardList className='w-7 h-6' />Lists
                                        </h3>
                                    </div>
                                    <SubmissionsFullScreen />
                                </div>

                                <div>
                                    {selectedTab === 'Recent AC' ? (
                                        items.length > 0 ? (
                                            <div className='pt-4'>
                                                {items.map((item, ind) => (
                                                    <div key={ind} className={`flex items-center justify-between rounded-md ${ind % 2 === 0 ? 'bg-gray-100' : ''} p-5`}>
                                                        <p className='font-semibold'>{item.title}</p>
                                                        <p className='text-gray-600 hidden md:flex'>{item.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='h-72 my-6 flex flex-col justify-center items-center gap-2 select-none'>
                                                <Ghost className='h-8 w-8 text-zinc-800' />
                                                <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                                                <p className='text-gray-600'>Let's solve your first problem!</p>
                                                <Button className='mt-5'>Solve Problems</Button>
                                            </div>
                                        )
                                    ) : (
                                        <div className='h-72 my-6 flex flex-col justify-center items-center gap-2 select-none'>
                                            <Ghost className='h-8 w-8 text-zinc-800' />
                                            <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
                                            <p className='text-gray-600'>There are no lists yet!</p>
                                            <Button className='mt-5'>Create List</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Profile;
