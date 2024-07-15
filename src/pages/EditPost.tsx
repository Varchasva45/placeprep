import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewDiscussion from "../components/NewDiscussion";
import axios from "axios";

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [post, setPost] = useState<any>(null);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/postDiscussion/${id}`,
      );
      setPost(response.data.post);
    } catch (error) {
      console.log("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleToggle = () => {
    setIsDiscussionOpen(!isDiscussionOpen);
  };

  useEffect(() => {
    if (!isDiscussionOpen) {
      navigate(`/post/${id}`);
    }
  }, [isDiscussionOpen, navigate, id]);

  if (!isDiscussionOpen) {
    return null;
  } else {
    return (
      <>
        {isDiscussionOpen && (
          <NewDiscussion
            isOpen={isDiscussionOpen}
            onClose={handleToggle}
            setPosts={setPosts}
            initialTopic={post?.title}
            initialTag={post?.tag}
            initialMarkdown={post?.content}
            postId={id}
            mode="edit"
          />
        )}
      </>
    );
  }
};

export default EditPost;
