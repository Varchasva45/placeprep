import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { LucideSendHorizonal, MessageSquare } from "lucide-react";
import axios from "axios";
import { chatBotEndpoints } from "../services/apis";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import toast from "react-hot-toast";
import { Icons } from "../components/Icons";
import userState from "../recoil/atoms/user";
import { format } from "date-fns";

const ChatBot = () => {
  const pervChat = [
    "Discussing Project Deadlines",
    "Meeting Summary: Q1 Review",
    "Brainstorming New Ideas",
    "Customer Feedback Analysis",
    "Team Building Activities",
    "Product Launch Strategy",
    "Weekly Sync-Up",
    "Sales Performance Review",
    "Budget Planning",
    "Technical Issue Resolution",
    "Market Research Findings",
    "Onboarding New Employees",
    "Client Meeting Recap",
    "Marketing Campaign Planning",
    "Software Development Updates",
    "Year-End Review Preparation",
  ];
  interface Message {
    text: string;
    isUserMessage: boolean;
    chatId: Number;
    userId: string;
    createdAt: string;
  }

  const [messages, setMessages] = useState<Message[] | null>([]);
  const [message, setMessage] = useState<string>("");
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { fetchMessages_API, sendMessage_API } = chatBotEndpoints;
  const chatId = 1;

  const fetchMessages = async () => {
    try {
      const response = await axios.get(fetchMessages_API + `/${chatId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

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

      const requestBody = {
        message,
        chatId: 1,
      };

      const response = await axios.post(sendMessage_API, requestBody, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setMessages((prevMessages) => {
          if (!prevMessages) {
            return [response.data.userMessage, response.data.AIMessage];
          } else {
            return [
              ...prevMessages,
              response.data.userMessage,
              response.data.AIMessage,
            ];
          }
        });
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex max-h-[calc(100vh-3.5rem)] w-full">
      <aside className="hidden h-full w-64 border-r bg-background md:block">
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          <div className="border-t px-4 py-4">
            <h3 className="mb-2 text-sm font-medium">Previous Chats</h3>
            <div className="space-y-2 truncate">
              {pervChat.map((chat, index) => (
                <div>
                  <Link
                    to="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    key={index}
                  >
                    <span>{chat}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex h-12 items-center border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <BotIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">Placeprep's Copilot</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 px-5">
            <div className="grid gap-4 h-full">
              {messages && messages.length > 0 ? (
                messages.map((message, index) =>
                  message.isUserMessage ? (
                    <div
                      key={index}
                      className="flex items-end gap-2 justify-end lg:ml-48"
                    >
                      <div className="grid gap-1">
                        <div className="font-medium">You</div>
                        <div className=" rounded-lg rounded-br-none bg-blue-600 p-3 text-sm text-primary-foreground">
                          <p>{message.text}</p>
                          <div
                            className={
                              "text-xs select-none mt-2 w-full text-right text-blue-300"
                            }
                          >
                            {format(new Date(message.createdAt), "HH:mm")}
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
                    <div key={index} className="flex items-end gap-2 lg:mr-48">
                      <div className="h-6 w-6">
                        <Icons.logo className="bg-zinc-300 rounded-sm text-zinc-200 p-1 h-6 w-6" />
                      </div>
                      <div className="grid gap-1">
                        <div className="font-medium">Chatbot</div>
                        <div className="rounded-lg rounded-bl-none bg-muted p-3 text-sm">
                          <p>{message.text}</p>
                          <div
                            className={
                              "text-xs select-none mt-2 w-full text-right text-zinc-500"
                            }
                          >
                            {format(new Date(message.createdAt), "HH:mm")}
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

function SendIcon(props: any) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default ChatBot;
