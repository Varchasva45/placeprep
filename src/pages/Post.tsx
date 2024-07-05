import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Label } from "../components/ui/label"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import "./style.css"
import userState from "../recoil/atoms/user"
import { useRecoilValue } from "recoil"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Dialog, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogTitle} from "../components/ui/dialog"



const Post = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { id } = useParams<{ id: string }>(); 
  const [userPost, setUserPost] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/postDiscussion/${id}`);
      setUserPost(response.data.post);
      setComments(response.data.post.comments);
    } catch (error) {
      console.log('Error fetching post:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

 
  // useEffect(() => {
  //   if (userPost) {
  //     console.log('Updated userPost:', userPost);
  //   }
  // }, [userPost]);

  const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/users/comments/${id}`, {
        content: newComment,
        createdBy: user.id,
        updatedBy: user.id,
        username: user.username

      });
      if (response.status === 200) {
        console.log('Comment posted:', response.data);
        setComments([response.data.comment, ...comments, ]);
        setNewComment('');
      }
    } catch (error) {
      console.log('Error posting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/users/deletePost/${id}`);
      if (response.status === 200) {
        console.log('Post deleted:', response.data);
        navigate('/community');
      }
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/users/deleteComment/${id}`);
      if (response.status === 200) {
        console.log('Comment deleted:', response.data);
        setComments(comments.filter((comment) => comment._id !== id));
      }
    } catch (error) {
      console.log('Error deleting comment:', error);
    }
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


const getInitials = (username: string) => {
  if (!username) return '';
  const names = username.split(' ');
  let initials = names[0].charAt(0);
  if (names.length > 1) {
    initials += names[1].charAt(0);
  }
  return initials.toUpperCase();
};

const handleEditClick = (comment: any) => {
  setEditingCommentId(comment._id);
  setEditContent(comment.content);
};

const handleEditChange = (e: any) => {
  setEditContent(e.target.value);
};

const handleSaveEdit = async (commentId: string) => {
  try{
    const response = await axios.patch(`http://localhost:3000/users/updateComment/${commentId}`, {
      content: editContent
    });
    if (response.status === 200) {
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          return { ...comment, content: editContent };
        }
        return comment;
      });
      setComments(updatedComments);
      setEditingCommentId(null);
    }
  } catch (error) {
    console.log('Error updating comment:', error);
  }
};


  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <article className="prose prose-gray dark:prose-invert">
    <div className="space-y-6 not-prose">
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{userPost?.title}</h1>
    <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
        <Avatar className="w-10 h-10 border">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>{getInitials(userPost?.username)}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{userPost?.username}</div>
    </div>
    <div className="text-muted-foreground text-sm">Posted on {formattedDate(userPost?.createdAt)}</div>
    {userPost?.createdBy === user.id && 
      <div className="flex items-center space-x-2 text-muted-foreground text-sm">
        <MdEdit className="hover:size-6 cursor-pointer" onClick={()=>{navigate(`/edit-post/${id}`)}}/>
        <Dialog>
          <DialogTrigger asChild>
        <MdDelete className="hover:size-6 cursor-pointer"/>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader><DialogTitle>Delete Post</DialogTitle></DialogHeader>
        <div>
          <p>Are you sure you want to delete this Post?</p>
          <div className="flex justify-start mt-4 gap-2">
            <Button onClick={handleDeletePost}>Delete</Button>
            <DialogClose><Button>Cancel</Button></DialogClose>
          </div>
        </div>
        </DialogContent>
        </Dialog>
        
      </div>}
    </div>
    </div>
    <p className="mt-1">
    <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                return !inline ? (
                  <pre className="code-block">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {userPost?.content}
          </ReactMarkdown>
    </p>
    </article>
    <div className="mt-12 space-y-6">
    <h2 className="text-2xl font-bold">Comments</h2>
    <form className="space-y-4">
    <div className="grid gap-3">
    <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" placeholder="Write your comment..." className="min-h-[120px]" value={newComment} onChange={(e)=>setNewComment(e.target.value)}/>
    </div>
    </div>
    <Button type="submit" onClick={handleSubmit}>Submit Comment</Button>
    </form>
    <div className="space-y-4 w-full">
    {comments?.map((comment: any)=>(
          <div className="flex items-start space-x-4 w-full">
          <Avatar className="w-10 h-10 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 w-full">
            <div className="flex items-center space-x-2">
              <div className="font-medium">{comment.username}</div>
              <div className="text-muted-foreground text-sm">{timeAgo(comment.createdAt)}</div>
              {comment.createdBy === user.id &&
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                  <MdEdit className="hover:size-6 cursor-pointer" onClick={() => handleEditClick(comment)}/>
                  <Dialog>
                  <DialogTrigger asChild>
                  <MdDelete className="hover:size-6 cursor-pointer"/>
                  </DialogTrigger>
                  <DialogContent>
                  <DialogHeader><DialogTitle>Delete Comment</DialogTitle></DialogHeader>
                  <div>
                    <p>Are you sure you want to delete this comment?</p>
                    <div className="flex justify-start mt-4 gap-2">
                      <Button onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
                      <DialogClose><Button>Cancel</Button></DialogClose>
                    </div>
                  </div>
                  </DialogContent>
                  </Dialog>
                  </div>
                }
            </div>
            {editingCommentId === comment._id ? (
              <div className="space-y-2">
                <Textarea id="comment" placeholder="Write your comment..." className="min-h-[120px]" value={editContent} onChange={handleEditChange}/>
                <div className="flex space-x-2">
                  <Button onClick={() => handleSaveEdit(comment._id)}>Save</Button>
                  <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>
          </div>
    ))}
    </div>
    </div>
    </div>
  )
}
export default Post