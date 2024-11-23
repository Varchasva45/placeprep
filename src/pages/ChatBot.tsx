import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
  CopyIcon,
  Loader2,
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
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useIntersection } from "@mantine/hooks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import Cookies from "js-cookie";

const ChatBot = () => {
  // interface IMessage {
  //   text: string;
  //   isUserMessage: boolean;
  //   chatId: Number;
  //   userId: string;
  //   createdAt: string;
  // }
  interface IChat {
    _id: string;
    isDeleted: boolean;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }

  const { id } = useParams();
  const navigate = useNavigate();
  const [promptMessage, setPromptMessage] = useState<string>("");
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const { fetchMessages_API, sendMessage_API } = chatBotEndpoints;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [chats, setChats] = useState<IChat[] | []>([]);
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
  const [newChatName, setNewChatName] = useState<string>("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const backupMessageRef = useRef<string>("");
  const lastMessageRef = useRef<HTMLDivElement>();
  const isAuthenticated = auth.isAuthenticated;

  // Infinite Query
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    "chatMessages",
    async ({ pageParam }) => {

      try {
        if (id == undefined) {
          return;
        }
  
        const response = await axios.get(
          fetchMessages_API + `/${id}?cursor=${pageParam}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );
        
        return response.data;
      } catch (error: any) {
        if(error.response.status === 401) {
          Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
          });
  
          window.location.href = '/login'
        }
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    },
  );

  const messages =
    data && data.pages[0]
      ? data.pages.flatMap((page) => page?.messages)
      : undefined;
  // console.log('message Length', messages?.length);
  // console.log('nextCursor', data?.pages[data?.pages.length - 1]?.nextCursor);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    // console.log('entry', entry);
    if (entry?.isIntersecting) {
      // console.log('isIntersecting')
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const fetchChats = async () => {

    if(!isAuthenticated) {
      return ;
    }

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

      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      toast.error("Failed to fetch chats");
    }
  };

  const restartChat = async () => {
    if (id == undefined) {
      return;
    }

    try {
      setLoading(true);
      await queryClient.invalidateQueries("chatMessages");
      queryClient.removeQueries("chatMessages");
      queryClient.refetchQueries("chatMessages");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch messages, please refresh the page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    restartChat();
  }, [id]);

  const handleCopy = (index: number) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  // old sending message function
  // const handleSendMessage = async (promptMessage: string) => {
  //   try {
  //     let chatId = id;
  //     if (chatId == undefined) {
  //       chatId = await handleCreateChat();
  //     }

  //     const requestBody = {
  //       message: promptMessage,
  //       chatId,
  //     };

  //     const response = await axios.post(sendMessage_API, requestBody, {
  //       headers: {
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //     });

  //     if (response.data.success) {
  //       setChats((prevChats: IChat[]) => {
  //         const newChats = [...prevChats];
  //         const chatIndex = newChats.findIndex(
  //           (chat: IChat) => chat._id === chatId,
  //         );
  //         newChats[chatIndex].name = response.data.chat.name;
  //         return newChats;
  //       });
  //       setPromptMessage("");
  //     } else {
  //       console.log(response.data.message);
  //       toast.error("Failed to send message");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to send message");
  //   }
  // };

  // New sending message function using useMutation
  console.log('messages', messages);
  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: async (chatId: string) => {
      try {
        console.log("Reached here mutationFn");
        // Input message khaali karo
        setPromptMessage("");

        // Message khaali hai to return kar jao
        if (promptMessage.length == 0) {
          return;
        }

        // Message ko api bhejo
        const requestBody = {
          message: promptMessage, // Using the function parameter instead of promptMessage
          chatId,
        };

        const response = await fetch(sendMessage_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(requestBody),
        });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const reader = response?.body?.getReader();
      if(!reader){
        console.log("Reader not found");
      }

      const decoder = new TextDecoder();
      let done = false;
      let aiMessage = '';

      queryClient.setQueryData("chatMessages", (oldData: any) => {
        const newMessage = {
          id: crypto.randomUUID(),
          text: promptMessage,
          isUserMessage : true,
          createdAt: new Date().toISOString(),
        };

        if (!oldData) {
          return {
            pages: [{ messages: [newMessage] }],
            pageParams: [],
          };
        }

        const newPages = [...oldData.pages];
        newPages[0].messages = [newMessage, ...newPages[0].messages];

        return {
          ...oldData,
          pages: newPages,
        };
      });
      
      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        aiMessage += decoder.decode(value, { stream: !done });
        queryClient.setQueryData("chatMessages", (oldData: any) => {
          if (!oldData) return oldData;

          const newPages = [...oldData.pages];
          const lastPage = newPages[0].messages;

          if (!lastPage || lastPage.length === 0) {
            newPages[0].messages = [{
              id: crypto.randomUUID(),
              text: aiMessage,
              isUserMessage: false,
              chatId,
              userId: user.id,
            }];
          } else {
            newPages[0].messages[0].text = aiMessage;
            newPages[0].messages[0].isUserMessage = false;
          }

          return {
            ...oldData,
            pages: newPages,
          };
        });

      }
      } catch (error) {
        console.log(error);
        throw new Error("Failed to send message");
      }
    },
    onMutate: async () => {
      setLoading(true);
      // Backup message ko store kar lo
      backupMessageRef.current = promptMessage;

      // Ongoing queries ko cancel karo
      await queryClient.cancelQueries("chatMessages");

      // Previous messages ko get karo -> isko get kyu kara abhi baad me dekhenge
      const previousMessages: any = queryClient.getQueryData("chatMessages");

      // Temporary data ko update karo for optimistic updates
      queryClient.setQueryData("chatMessages", (old: any) => {
        if (!old || old.pages[0] == undefined) {
          if (old.pages[0] == undefined) {
            return {
              pages: [
                {
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      text: promptMessage,
                      isUserMessage: true,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  success: true,
                },
              ],
              pageParams: [],
            };
          }

          return {
            pages: [],
            pageParams: [],
          };
        }

        // Old data me hamne apna user message ko add kiya
        let newPages = [...old.pages];

        newPages[0].messages = [
          {
            id: crypto.randomUUID(),
            text: promptMessage,
            isUserMessage: true,
            createdAt: new Date().toISOString(),
          },
          ...newPages[0].messages,
        ];

        // Return karo new data
        return {
          ...old,
          pages: newPages,
        };
      });

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page: any) => page?.messages) ?? [],
      };
    },
    onSuccess: () => {
      // try {
      //   // Response se actual message ko extract karo
      //   console.log('Message:', message);
      //   // const message = response.data.message;
      //   // Yaha pe woh kaam karna hai jo hoga success hone pe hoga
      //   queryClient.setQueryData('chatMessages', (old: any) => {
      //     let newPages = [...old.pages];
      //     newPages[0].messages = [
      //       {
      //         id: crypto.randomUUID(),
      //         text: message,
      //         isUserMessage: false, // Check this as it might need to be `true`
      //         createdAt: new Date().toISOString(),
      //       },
      //       ...newPages[0].messages,
      //     ];
      //     return {
      //       ...old,
      //       pages: newPages,
      //     };
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
    },
    onError: () => {
      try {
        setPromptMessage(backupMessageRef.current);
        queryClient.setQueryData("chatMessages", (old: any) => {
          let newPages = [...old.pages];
          newPages[0].messages = newPages[0].messages.slice(1);
          return {
            ...old,
            pages: newPages,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    onSettled: () => {
      setLoading(false);
      queryClient.invalidateQueries("chatMessages");
    },
  });

  const handleCreateChat = async () => {

    if(!isAuthenticated) {
      toast.error('Please login first to create a chat');
      return;
    }

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
        setChats((prevChats: IChat[]) => {
          return [response.data.chat, ...prevChats];
        });
        navigate(`/copilot/${response.data.chat._id}`);
        return response.data.chat._id;
      } else {
        toast.error("Failed to create chat");
      }
    } catch (error: any) {

      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      toast.error("Failed to create chat");
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
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
          setChats((prevChats: IChat[]) => {
            const newChats = [...prevChats];
            newChats[editModeIndex!].name = newChatName;
            return newChats;
          });
          setEditModeIndex(null);
        } else {
          toast.error("Failed to update chat name");
        }
      } catch (error: any) {

        if(error.response.status === 401) {
          Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
          });
  
          window.location.href = '/login'
        }

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
        setChats((prevChats: IChat[]) => {
          return prevChats.filter((chat: IChat) => chat._id !== chatId);
        });
      }
    } catch (error: any) {

      if(error.response.status === 401) {
        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

        window.location.href = '/login'
      }

      toast.error("Failed to delete chat");
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-r bg-background h-12 gap-4">
          <button onClick={handleCreateChat}>
            <SquarePen className="h-6 w-6" />
          </button>
          <button onClick={() => setDrawerOpen(!drawerOpen)}>
            <PanelLeft className="h-6 w-6" />
          </button>
        </div>
        {drawerOpen && (
          <aside className="md:block h-full w-64 border-r bg-background">
            <div className="h-[calc(100vh-4rem)] overflow-auto">
              <div className="border-t px-4 py-4">
                <h3 className="mb-2 text-sm font-medium">Previous Chats</h3>
                <div className="space-y-2 truncate">
                  {chats.map((chat: IChat, index: number) => (
                    <div key={index}>
                      <Link
                        to={`/copilot/${chat._id}`}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted justify-between ${chat._id === id ? "bg-muted" : ""}`}
                      >
                        {editModeIndex == index ? (
                          <input
                            value={newChatName}
                            onChange={(e) => {
                              setNewChatName(e.target.value);
                            }}
                            onKeyDown={() => handleKeyDown}
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
          <div className="flex h-12 items-center justify-center border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <BotIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">Placeprep's Copilot</span>
            </div>
          </div>
          <div className="flex-1 h-full overflow-auto">
            <div className="gap-4 h-full w-full flex flex-col-reverse overflow-auto p-4">
              {isLoading ? (
                <>
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    <h3 className="font-semibold text-xl">
                      Loading Conversation...
                    </h3>
                    <p className="text-zinc-500 text-sm">Please wait</p>
                  </div>
                </>
              ) : messages && messages.length > 0 ? (
                messages.map((message, index) =>
                  message.isUserMessage ? (
                    <div
                      // ref={index === messages.length - 1 ? lastMessageRef : null}
                      key={index}
                      className="flex items-end gap-2 justify-end lg:ml-48"
                    >
                      <div
                        className="grid gap-1"
                        ref={index === messages.length - 1 ? ref : null}
                      >
                        <div className="font-medium">You</div>
                        <div className=" rounded-lg rounded-br-none bg-blue-600 p-3 text-sm text-primary-foreground">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                className,
                                children,
                                ...props
                              }) {
                                return !true ? (
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
                      // ref={index === messages.length - 1 ? lastMessageRef : null}
                      className="flex items-end gap-2 lg:mr-48"
                    >
                      <div className="h-6 w-6">
                        <Icons.logo className="bg-zinc-300 rounded-sm text-zinc-200 p-1 h-6 w-6" />
                      </div>
                      <div
                        className="grid gap-1"
                        ref={index === messages.length - 1 ? ref : null}
                      >
                        <div className="font-medium">Chatbot</div>
                        <div className="rounded-lg rounded-bl-none bg-muted p-3 text-sm">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                className,
                                children,
                                ...props
                              }) {
                                const codeString = String(children).trim();
                                const index = message.text.indexOf(codeString);
                                return !true ? (
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
                isAuthenticated 
                ? <div className="flex-1 flex h-full flex-col items-center justify-center gap-2">
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                      <h3 className="font-semibold text-xl">
                        You&apos;re all set!
                      </h3>
                      <p className="text-zinc-500 text-sm">
                        Ask your first question to Placeprep's Copilot.
                      </p>
                  </div>
                : <div className="flex-1 flex h-full flex-col items-center justify-center gap-2">
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                    <h3 className="font-semibold text-xl">
                      You&apos;re not logged in!
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      Please login to ask your first question to Placeprep's Copilot.
                    </p>
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-gray-100 px-4 py-3">
            <div className="relative">
              <Textarea
                disabled={!isAuthenticated || isLoading || loading}
                rows={1}
                ref={textAreaRef}
                value={promptMessage}
                autoFocus
                onChange={(e) => setPromptMessage(e.target.value)}
                placeholder="Type your message..."
                className="pt-3 resize-none pr-12 text-base scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                disabled={!isAuthenticated || isLoading || loading}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                type="submit"
                onClick={async () => {
                  // handleSendMessage(promptMessage);
                  if (id == undefined) {
                    let chatId = await handleCreateChat();
                    sendMessageMutation(chatId);
                  } else {
                    sendMessageMutation(id);
                  }
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
