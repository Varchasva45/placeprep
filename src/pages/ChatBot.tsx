import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
  CopyIcon,
  LucideSendHorizonal,
  MessageSquare,
  PanelLeft,
  Pencil,
  SquarePen,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { chatBotEndpoints } from "../services/apis";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import toast from "react-hot-toast";
import { Icons } from "../components/Icons";
import userState from "../recoil/atoms/user";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./ChatBotstyle.css";
import { BsThreeDots } from "react-icons/bs";
import { useInfiniteQuery } from "react-query";
import { useIntersection } from "@mantine/hooks";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

const ChatBot = () => {
  interface Message {
    text: string;
    isUserMessage: boolean;
    chatId: Number;
    userId: string;
    createdAt: string;
  }

  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [message, setMessage] = useState<string>("");
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { fetchMessages_API, sendMessage_API } = chatBotEndpoints;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [chats, setChats] = useState<any>([]);
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
  const [newChatName, setNewChatName] = useState<string>("");

  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    "messages",
    async ({ pageParam }) => {
      const response = await axios.get(
        fetchMessages_API + `/${id}?cursor=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    },
  );

  const tempMessages = data?.pages.flatMap((page) => page.messages) || [];
  console.log("tempMessages", tempMessages.length);

  const lastMessageRef = useRef<any>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries)=>{
      const entry = entries[0];
      console.log("entry",entry);
    })
    observer.observe(lastMessageRef.current!);
  }, []);

  useEffect(() => {
    if (entry?.isIntersecting) {
      console.log("fetching next page");
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/chatbot/chats",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      if (response.data.success) {
        setChats(response.data.chats);
      }
    } catch (error: any) {
      toast.error("Failed to fetch chats");
    }
  };

  useEffect(() => {
    fetchChats();
    // inputRef.current?.focus();
  }, []);

  const handleCopy = (index: number) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        fetchMessages_API + `/${id}?cursor=undefined`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        toast.error("Failed to fetch messages");
      }
    } catch (error: any) {
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      console.log("message", message);
      let chatId = id;
      if (chatId == undefined) {
        chatId = await handleCreateChat();
      }
      console.log("chatId", chatId);
      const requestBody = {
        message,
        chatId,
      };

      const response = await axios.post(sendMessage_API, requestBody, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setMessages((prevMessages) => {
          if (!prevMessages) {
            return [response.data.AIMessage, response.data.userMessage];
          } else {
            return [
              response.data.AIMessage,
              response.data.userMessage,
              ...prevMessages,
            ];
          }
        });
        setChats((prevChats: any) => {
          const newChats = [...prevChats];
          const chatIndex = newChats.findIndex(
            (chat: any) => chat._id === chatId,
          );
          newChats[chatIndex].name = response.data.chat.name;
          return newChats;
        });
        setMessage("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (id != undefined) {
      fetchMessages();
    }
  }, [id]);

  const handleCreateChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chatbot/createChat",
        {
          name: "New Chat",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      if (response.data.success) {
        setChats((prevChats: any) => {
          return [response.data.chat, ...prevChats];
        });
        navigate(`/copilot/${response.data.chat._id}`);
        return response.data.chat._id;
      } else {
        toast.error("Failed to create chat");
      }
    } catch (error: any) {
      toast.error("Failed to create chat");
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      try {
        const chatId = chats[editModeIndex!]._id;
        const response = await axios.put(
          `http://localhost:3000/api/chatbot/chats/${chatId}`,
          {
            name: newChatName,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );
        if (response.data.success) {
          setChats((prevChats: any) => {
            const newChats = [...prevChats];
            newChats[editModeIndex!].name = newChatName;
            return newChats;
          });
          setEditModeIndex(null);
        } else {
          toast.error("Failed to update chat name");
        }
      } catch (error: any) {
        toast.error("Failed to update chat name");
      }
    }
  };

  const handleEditChatName = (index: number, name: string) => {
    setEditModeIndex(index);
    setNewChatName(name);
  };

  const handleDelete = async (chatId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/chatbot/chats/${chatId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      if (response.data.success) {
        setChats((prevChats: any) => {
          return prevChats.filter((chat: any) => chat._id !== chatId);
        });
      }
    } catch (error: any) {
      toast.error("Failed to delete chat");
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-3 border-b bg-background h-12 gap-4">
          <button onClick={() => setDrawerOpen(!drawerOpen)}>
            <PanelLeft className="h-6 w-6" />
          </button>
          <button onClick={handleCreateChat}>
            <SquarePen className="h-6 w-6" />
          </button>
        </div>
        {drawerOpen && (
          <aside className="md:block h-full w-64 border-r bg-background">
            <div className="h-[calc(100vh-4rem)] overflow-auto">
              <div className="border-t px-4 py-4">
                <h3 className="mb-2 text-sm font-medium">Previous Chats</h3>
                <div className="space-y-2 truncate">
                  {chats.map((chat, index: number) => (
                    <div key={index}>
                      <Link
                        to={`/copilot/${chat._id}`}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted justify-between"
                      >
                        {editModeIndex == index ? (
                          <input
                            value={newChatName}
                            onChange={(e) => {
                              setNewChatName(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            className=" outline-none focus:border-blue-500"
                          />
                        ) : (
                          <span className="truncate">{chat?.name}</span>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            {editModeIndex !== index && (
                              <span>
                                <BsThreeDots className="hover:bg-slate-200 " />
                              </span>
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="flex gap-8 cursor-pointer"
                              onClick={() =>
                                handleEditChatName(index, chat.name)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex gap-8 cursor-pointer"
                              onClick={() => handleDelete(chat._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex h-12 items-center border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <BotIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">Placeprep's Copilot</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="gap-4 h-full flex flex-col-reverse overflow-auto p-4">
              {tempMessages && tempMessages.length > 0 ? (
                tempMessages.map((message, index) =>
                  
                  message.isUserMessage ? (
                    <div
                      ref={index === tempMessages.length - 1 ? lastMessageRef : null}
                      key={index}
                      className="flex items-end gap-2 justify-end lg:ml-48"
                    >
                      <div className="grid gap-1">
                        <div className="font-medium">You</div>
                        <div className=" rounded-lg rounded-br-none bg-blue-600 p-3 text-sm text-primary-foreground">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
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
                              },
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                          <div
                            className={
                              "text-xs select-none mt-2 w-full text-right text-blue-300"
                            }
                          >
                            {message.createdAt &&
                              format(new Date(message.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </div>

                      {user.imageUrl ? (
                        <img
                          className="rounded-sm h-6 w-6"
                          src={user.imageUrl}
                        ></img>
                      ) : (
                        <Icons.user className="bg-blue-600 rounded-sm text-zinc-200 p-1 h-6 w-6" />
                      )}
                    </div>
                  ) : (
                    <div
                      key={index}
                      ref={index === tempMessages.length - 1 ? lastMessageRef : null}
                      className="flex items-end gap-2 lg:mr-48"
                    >
                      <div className="h-6 w-6">
                        <Icons.logo className="bg-zinc-300 rounded-sm text-zinc-200 p-1 h-6 w-6" />
                      </div>
                      <div className="grid gap-1">
                        <div className="font-medium">Chatbot</div>
                        <div className="rounded-lg rounded-bl-none bg-muted p-3 text-sm">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const codeString = String(children).trim();
                                const index = message.text.indexOf(codeString);
                                return !inline ? (
                                  <div className="code-block-wrapper">
                                    <pre className="code-block">
                                      <CopyToClipboard
                                        text={codeString}
                                        onCopy={() => handleCopy(index)}
                                      >
                                        <button className="copy-button">
                                          {copiedIndex == index ? (
                                            "Copied!"
                                          ) : (
                                            <CopyIcon className="h-4 w-4" />
                                          )}
                                        </button>
                                      </CopyToClipboard>
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  </div>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                          <div
                            className={
                              "text-xs select-none mt-2 w-full text-right text-zinc-500"
                            }
                          >
                            {message.createdAt &&
                              format(new Date(message.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                  <h3 className="font-semibold text-xl">
                    You&apos;re all set!
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Ask your first question to Placeprep's Copilot.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-gray-100 px-4 py-3">
            <div className="relative">
              <Textarea
                rows={1}
                ref={textAreaRef}
                value={message}
                autoFocus
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="pt-3 resize-none pr-12 text-base scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                // disabled={isLoading || isDisabled}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                type="submit"
                onClick={() => {
                  handleSendMessage(message);
                  textAreaRef.current?.focus();
                }}
              >
                <LucideSendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BotIcon(props: any) {
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
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

export default ChatBot;
