import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ChevronRight, Ghost } from "lucide-react";
import { GoChecklist } from "react-icons/go";
import { Button } from "./ui/button";

const statuses = [
  { status: "Accepted", color: "text-green-600" },
  { status: "Wrong Answer", color: "text-red-600" },
  { status: "Timte Limit Exceeded", color: "text-red-600" },
];

const getRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

const items: any = [
  { title: "Determine the Maximum Path Sum", time: "2 hours ago" },
  { title: "Find the Longest Increasing Subsequence", time: "3 hours ago" },
  { title: "Evaluate the Binary Tree Paths", time: "4 hours ago" },
  { title: "Optimize Network Latency", time: "5 hours ago" },
  { title: "Calculate the Shortest Path", time: "6 hours ago" },
  { title: "Analyze the Stock Market Trends", time: "7 hours ago" },
  { title: "Design a File System", time: "8 hours ago" },
  { title: "Implement a Cache Mechanism", time: "9 hours ago" },
  { title: "Design a File System", time: "8 hours ago" },
  { title: "Find the Longest Increasing Subsequence", time: "3 hours ago" },
  { title: "Evaluate the Binary Tree Paths", time: "4 hours ago" },
  { title: "Optimize Network Latency", time: "5 hours ago" },
  { title: "Calculate the Shortest Path", time: "6 hours ago" },
  { title: "Analyze the Stock Market Trends", time: "7 hours ago" },
  { title: "Design a File System", time: "8 hours ago" },
  { title: "Implement a Cache Mechanism", time: "9 hours ago" },
  { title: "Design a File System", time: "8 hours ago" },
];

const SubmissionsFullScreen = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <div className="flex text-sm font text-gray-500">
          <h3 className="flex items-center justify-center cursor-pointer hover:text-black py-4 pl-4">
            View all submissions <ChevronRight className="h-4 w-4 pt-1" />
          </h3>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-[95%] my-auto w-full">
        <div className="overflow-auto">
          <div className="flex text-xl font-semibold items-center justify-center select-none">
            <h3
              className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 pb-4 px-4`}
            >
              <GoChecklist className="w-7 h-6" />
              All Submissions
            </h3>
          </div>
          {items && items.length > 0 ? (
            <div>
              {items.map((item: any, index: number) => {
                const isGray = index % 2 === 0;
                const { status, color } = getRandomStatus();
                return (
                  <div
                    className={`flex items-center justify-between p-5 rounded-md ${isGray ? "bg-gray-100" : ""}`}
                    key={index}
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-gray-600 hidden md:flex">
                      {status && <span className={color}>{status}</span>}
                      {status && ", "}
                      {item.time}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[calc(100vh-15rem)] my-6 flex flex-col justify-center items-center gap-2 select-none">
              <Ghost className="h-8 w-8 text-zinc-800"></Ghost>
              <h3 className="font-semibold text-xl">
                Pretty empty around here
              </h3>
              <p className="text-gray-600">Lets Sovle your first problem!</p>
              <Button className="mt-5">Solve Problems</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionsFullScreen;
