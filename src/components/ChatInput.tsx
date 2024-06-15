import { LucideSendHorizontal } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

type ChatInputProps = {
  isDisabled: boolean;
};

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { handleInputChange, addMessage, message, isLoading } =
    useContext(ChatContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                autoFocus
                placeholder="Enter your question..."
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    !isDisabled &&
                    !isLoading &&
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    message.trim() !== ""
                  ) {
                    e.preventDefault();
                    addMessage();
                  }

                  textAreaRef.current?.focus();
                }}
                value={message}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                disabled={isLoading || isDisabled}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                type="submit"
                onClick={() => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <LucideSendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
