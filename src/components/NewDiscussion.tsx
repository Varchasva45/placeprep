import React, { useEffect, useState } from "react";
import { Send } from "react-feather";
import MarkdownEditor from "react-markdown-editor-lite";
import Markdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import axios from "axios";
import userState from "../recoil/atoms/user";
import { useRecoilValue } from "recoil";

interface EditorChangeEvent {
  text: string;
}

interface NewDiscussionProps {
  isOpen: boolean;
  onClose: () => void;
  setPosts: (posts: any) => void;
  initialTopic?: string;
  initialTag?: string;
  initialMarkdown?: string;
  postId?: string;
  mode?: "edit" | "create";
}

const NewDiscussion: React.FC<NewDiscussionProps> = ({
  isOpen,
  onClose,
  setPosts,
  initialTopic = "",
  initialTag = "",
  initialMarkdown = "",
  postId,
  mode,
}) => {
  const user = useRecoilValue(userState);
  const [topic, setTopic] = useState(initialTopic);
  const [tag, setTag] = useState(initialTag);
  const [markdown, setMarkdown] = useState(initialMarkdown);

  useEffect(() => {
    setTopic(initialTopic);
    setTag(initialTag);
    setMarkdown(initialMarkdown);
  }, [initialTopic, initialTag, initialMarkdown]);

  const handleEditorChange = ({ text }: EditorChangeEvent) => {
    setMarkdown(text);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/postDiscussion",
        {
          title: topic,
          content: markdown,
          tag: tag,
          createdBy: user.id,
          updatedBy: user.id,
          username: user.username,
        },
      );

      console.log(response);

      if (response.status === 201) {
        onClose();
        setPosts((prevPosts: any) => [response.data.post, ...prevPosts]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/users/updatePost/${postId}`,
        {
          title: topic,
          content: markdown,
          tag: tag,
        },
      );
      if (response.status === 200) {
        onClose();
        setPosts((prevPosts: any) => [response.data.post, ...prevPosts]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Collapsible open={isOpen}>
      <CollapsibleTrigger className="hidden" />
      <CollapsibleContent>
        <div className="relative p-4 border border-gray-300 rounded-md">
          {mode === "create" && (
            <Button className="absolute top-2 right-5" onClick={handleSubmit}>
              <Send size={24} />
            </Button>
          )}
          {mode === "edit" && (
            <Button className="absolute top-2 right-5" onClick={handleEdit}>
              Edit
            </Button>
          )}

          <h2 className="text-lg font-bold mb-2">Topic</h2>
          <Textarea
            placeholder="Enter the topic"
            className="w-full mb-4"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={1}
            maxLength={80}
          />
          <h2 className="text-lg font-bold mb-2">Tag</h2>
          <Textarea
            placeholder="Enter the tag"
            className="w-full mb-4"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            rows={1}
          />
          <h2 className="text-lg font-bold mb-2">Write your text</h2>
          <div className="flex flex-col md:flex-row">
            <div className="w-screen">
              <MarkdownEditor
                style={{ height: "300px" }}
                value={markdown}
                onChange={handleEditorChange}
                loggerMaxSize={200}
                renderHTML={(text) => <Markdown>{text}</Markdown>}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NewDiscussion;
