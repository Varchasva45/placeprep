import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import NewDiscussion from "../components/NewDiscussion"
import { Eye } from 'react-feather';
import { ChevronsLeft } from 'react-feather';
import { ChevronsRight } from 'react-feather';
import { BiSolidDislike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import axios from 'axios';
import userState from '../recoil/atoms/user';
import authState from '../recoil/atoms/auth';




const Community = ()=> {
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const [posts, setPosts] = useState<any>([]);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedPosts, setLikedPosts] = useState<any>([]);
  const [dislikedPosts, setDislikedPosts] = useState<any>([]);
  const [sortedBy, setSortedBy] = useState('createdAt');
  const pageSize = 10;
  

  const handleSortedBy = async (type: string) => {
    setSortedBy(type);
  }


  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${user.id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      console.log(response.data);
      setLikedPosts(response.data.userDetails.likedPosts);
      setDislikedPosts(response.data.userDetails.dislikedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchPosts = async (page: any) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/postDiscussion?page=${page}&pageSize=${pageSize}&sortedBy=${sortedBy}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [sortedBy, currentPage]);

  const handlePageChange = (page: any) => {
    if(page > 0 && page <= totalPages){
      setCurrentPage(page);
    }
  }

  const handleToggle = () => {
    setIsDiscussionOpen(!isDiscussionOpen);
  };

  function timeAgo(timestamp: string | Date): string {
    const now = new Date();
    const postDate = new Date(timestamp);

    const diff = now.getTime() - postDate.getTime();

    const seconds = Math.floor(diff / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    function getInterval(seconds: number, interval: string): string {
        const count = Math.floor(seconds / intervals[interval]);
        return count > 1 ? `${count} ${interval}s ago` : `${count} ${interval} ago`;
    }

    if (seconds >= intervals.year) {
        return getInterval(seconds, 'year');
    } else if (seconds >= intervals.month) {
        return getInterval(seconds, 'month');
    } else if (seconds >= intervals.day) {
        return getInterval(seconds, 'day');
    } else if (seconds >= intervals.hour) {
        return getInterval(seconds, 'hour');
    } else if (seconds >= intervals.minute) {
        return getInterval(seconds, 'minute');
    } else {
        return `${seconds} seconds ago`;
    }
}

const handleUpdate = async (id: number, type: string) => {
  try{
    const response = await axios.patch(`http://localhost:3000/users/postDiscussion/${id}`, {
      updatedData: type,
      userId: user.id
    });
    console.log(response)
    setPosts(posts.map((post: any) => 
      post._id === id ? { ...post, ...response.data.post } : post
    ));
  }
  catch(error){
    console.log(error);
  }
}

const handleUnlike = async (id: number, type: string) => {
  if(type === 'unlike'){
  setLikedPosts(likedPosts.filter((likedId: any) => likedId !== id));
  }else if(type === 'undislike'){
    setDislikedPosts(dislikedPosts.filter((dislikedId: any) => dislikedId !== id));
  }
}

const handleLike = async (id: number, type: string) => {
  if(type === 'like'){
  setLikedPosts([...likedPosts, id]);
  }else if(type === 'dislike'){
    setDislikedPosts([...dislikedPosts, id]);
  }
}


// function truncateContent(content: string, charLimit: number): string {
//   if (content.length > charLimit) {
//       return `${content.substring(0, charLimit)}...`;
//   }
//   return content;
// }

  return (
    <>
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link to={'/problems'} className="flex items-center gap-2">
            <DiscIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">Discussions</span>
          </Link>
          <div className="relative hidden sm:block">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search discussions..." className="w-[300px] rounded-md bg-muted pl-8" />
          </div>
        </div>
        
      <Button className="hidden sm:inline-flex" onClick={handleToggle}>
        {!isDiscussionOpen?"Start a New Discussion":"Close"}
      </Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-[240px] flex-col border-r bg-muted p-4 sm:flex">
          <div className="mb-4 text-lg font-semibold">Categories</div>
          <nav className="flex flex-col gap-2">
            <Link
              to={'/problems'}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              General
            </Link>
            <Link
              to={'/problems'}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Product Feedback
            </Link>
            <Link
              to={'/problems'}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Technical Support
            </Link>
            <Link
              to={'/problems'}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Announcements
            </Link>
            <Link
              to={'/problems'}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Off-Topic
            </Link>
          </nav>
        </div>
        {!isDiscussionOpen && <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-xl font-semibold">Latest Discussions</div>
              <div className='flex justify-between'>
              <div className="text-sm text-muted-foreground">Browse the latest discussions on our platform.</div>
              <div className='flex justify-evenly gap-5'>
                <div className="text-sm text-muted-foreground cursor-pointer hover:text-black" onClick={()=>handleSortedBy('createdAt')}>Latest</div>
                <div className="text-sm text-muted-foreground cursor-pointer hover:text-black" onClick={()=>handleSortedBy('likes')}>Most Liked</div>
                <div className="text-sm text-muted-foreground cursor-pointer hover:text-black" onClick={()=>handleSortedBy('views')}>Most Viewed</div>
              </div>
              </div>
            </div>
            <div className="grid gap-4">
              {posts.map((post: any, index: any) => (
              <Card className="grid grid-cols-[50px_1fr] gap-4 h-20">
                <div className="flex items-center justify-center rounded-md bg-accent text-accent-foreground h-20">
                  <Link to={`/post/${post._id}`}><MessageCircleIcon className="h-5 w-5" /></Link>
                </div>
                <div>
                  <div className="font-medium mt-1">
                    <Link to={`/post/${post._id}`} onClick={()=>handleUpdate(post._id, 'views')} >
                      {post.title}
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1 mt-1 text-gray-900">
                    <Link to="#" className="font-medium" >
                      {post.username}
                    </Link>
                    <span style={{marginLeft:'0.5rem'}}>
                    •{timeAgo(post.createdAt)}
                    </span>
                  </div>
                  {/* <div className="line-clamp-2 text-sm mb-1 text-gray-600">
                  <Markdown>{truncateContent(post.content, 50)}</Markdown>
                  </div> */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      {likedPosts.includes(post._id) ? <BiSolidLike className="h-4 w-4 hover:text-black cursor-pointer" onClick={()=>{handleUpdate(post._id, 'like'); handleUnlike(post._id, 'unlike')}} /> : <BiLike className="h-4 w-4 hover:text-black cursor-pointer" onClick={()=>{handleUpdate(post._id, 'like'); handleLike(post._id, 'like')}} />}
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {dislikedPosts.includes(post._id) ? <BiSolidDislike className="h-4 w-4 hover:text-black cursor-pointer" onClick={()=>{handleUpdate(post._id, 'dislike'); handleUnlike(post._id, 'undislike')}} /> : <BiDislike className="h-4 w-4 hover:text-black cursor-pointer" onClick={()=>{handleUpdate(post._id, 'dislike'); handleLike(post._id, 'dislike')}} />}
                      <span>{post.dislikes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 hover:text-black" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </Card>
              ))}
            </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft/>
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight/>
                </Button>
              </div>
          </div>
        </div>}: 
        {isDiscussionOpen && <div className="flex-1 overflow-auto p-4 sm:p-6">
            <NewDiscussion isOpen={isDiscussionOpen} onClose={handleToggle} setPosts={setPosts} mode="create" />
        </div>}
      </div>
    </div>
    </>
  )
}
export default Community

function DiscIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}


function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}


function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}