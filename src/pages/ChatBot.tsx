/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LupBO7TzgMG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"

const ChatBot = () => {
  return (
    <div className="flex h-[calc(100vh - 3.5rem)] w-full">
      <aside className="hidden h-full w-64 border-r bg-background md:block">
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          <div className="border-t px-4 py-4">
            <h3 className="mb-2 text-sm font-medium">Previous Chats</h3>
            <div className="space-y-2">
              <Link
                to="#"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                
              >
                <Avatar className="h-6 w-6 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <span>Acme Inc</span>
              </Link>
              <Link
                to="#"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                
              >
                <Avatar className="h-6 w-6 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </Link>
              <Link
                to="#"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                
              >
                <Avatar className="h-6 w-6 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <span>Jane Smith</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b bg-background px-4 md:px-6">
              <div className="flex items-center gap-2">
                <BotIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Chatbot</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 mx-5">
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-medium">Chatbot</div>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                      <p>Hello! I'm an AI assistant created by Acme Inc. How can I help you today?</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 justify-end">
                  <div className="grid gap-1">
                    <div className="font-medium">You</div>
                    <div className="rounded-lg bg-blue-600 p-3 text-sm text-primary-foreground">
                      <p>Hi there! I'm looking for some information on your latest product updates.</p>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-medium">Chatbot</div>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                      <p>
                        Sure, I'd be happy to provide an update on our latest product features. What would you like to
                        know?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-background px-4 py-3">
              <div className="relative">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[48px] w-full rounded-lg border border-input bg-transparent p-3 pr-16 text-sm shadow-sm"
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-3 top-3">
                  <SendIcon className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  )
}


function HomeIcon(props: any) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function InboxIcon(props: any) {
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
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
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
  )
}


function SettingsIcon(props: any) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default ChatBot