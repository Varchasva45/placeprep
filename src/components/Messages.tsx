import { useInfiniteQuery } from "react-query";
import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import axios from "axios";
import { Loader2, MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { useIntersection } from "@mantine/hooks";

const Messages = ({ fileId }: { fileId: string }) => {
  const user = useRecoilValue(userState);
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    "messages",
    async ({ pageParam }) => {
      const response = await axios.get(
        `http://localhost:3000/askPDF/getFileMessages?fileId=${fileId}&userId=${user.id}&cursor=${pageParam}`,
      );
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      keepPreviousData: true,
    },
  );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex max-h-[calc(100vh-3rem-7.5rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, ind) => {
          const isNextMessageSamePerson =
            combinedMessages[ind - 1]?.isUserMessage ===
            combinedMessages[ind]?.isUserMessage;
          if (ind === combinedMessages.length - 1) {
            return (
              <Message
                message={message}
                ref={ref}
                key={ind}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          } else {
            return (
              <Message
                message={message}
                key={ind}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
