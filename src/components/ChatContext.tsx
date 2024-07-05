import axios from "axios";
import { ReactNode, createContext, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { askPDFEndpoints } from "../services/apis";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: true,
});

const ChatContextProvider = ({
  fileId,
  children,
}: {
  fileId: string;
  children: ReactNode;
}) => {
  interface Message {
    id: string;
    text: string;
    createdAt: string;
    isUserMessage: boolean;
  }

  interface MessagePage {
    messages: Message[];
    nextCursor: number | null;
  }

  interface MessageQueryData {
    pages: MessagePage[];
    pageParams: string | null;
  }

  const { createFileMessage_API } = askPDFEndpoints;
  const queryClient = useQueryClient();
  const auth = useRecoilValue(authState);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const addMessage = () => {
    sendMessage(message);
  };

  const backupMessage = useRef<string>("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setMessage("");
      try {
        const apiUrl = `${createFileMessage_API}/${fileId}`;
        const response = await axios.post(
          apiUrl,
          {
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        return response.data.responseMessage;
      } catch (error) {
        throw new Error("Error while fetching response message");
      }
    },
    onMutate: async (message) => {
      backupMessage.current = message;
      await queryClient.cancelQueries("messages");
      const previousMessages: MessageQueryData | undefined =
        queryClient.getQueryData("messages");
      queryClient.setQueryData("messages", (old: any) => {
        if (!old)
          return {
            pages: [],
            pageParams: [],
          };

        let newPages = [...old.pages];

        newPages[0].messages = [
          {
            id: crypto.randomUUID(),
            text: message,
            isUserMessage: true,
            createdAt: new Date().toISOString(),
          },
          ...newPages[0].messages,
        ];

        return {
          ...old,
          pages: newPages,
        };
      });

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: (message: string) => {
      setIsLoading(false);
      queryClient.setQueryData("messages", (old: any) => {
        let newPages = [...old.pages];
        newPages[0].messages = [
          {
            id: crypto.randomUUID(),
            text: message,
            isUserMessage: false,
            createdAt: new Date().toISOString(),
          },
          ...newPages[0].messages,
        ];

        return {
          ...old,
          pages: newPages,
        };
      });
    },
    onError: () => {
      toast.error("Some error occurred, please try again");
      setMessage(backupMessage.current);
      queryClient.setQueryData("messages", (old: any) => {
        let newPages = [...old.pages];
        newPages[0].messages = newPages[0].messages.slice(1);
        return {
          ...old,
          pages: newPages,
        };
      });
    },
    onSettled: async () => {
      setIsLoading(false);
      await queryClient.invalidateQueries("messages");
    },
  });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
