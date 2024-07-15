import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { FaLocationDot } from "react-icons/fa6";
import { FaBuilding, FaGithub, FaLinkedin } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { RiDiscussFill } from "react-icons/ri";
import {
  ChevronRight,
  Eye,
  Ghost,
  MailIcon,
  Medal,
  ClipboardCheck,
  User,
} from "lucide-react";
import ProblemHeatMap from "../components/HeatMap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionsFullScreen from "../components/SubmissionsFullScreen";
import PersonalInformationPage from "../components/PersonalnformationPage";
import AccountInformationPage from "../components/AccountInformationPage";
import axios from "axios";
import toast from "react-hot-toast";
import authState from "../recoil/atoms/auth";
import mongoose from "mongoose";
import { userEndpoints } from "../services/apis";

const Profile = () => {
  interface IuserDetails {
    _id: mongoose.Types.ObjectId;
    name?: string;
    username: string;
    email?: string;
    password: string;
    imageUrl: string;
    githubAccount?: string;
    linkedInAccount?: string;
    personalInformation: {
      summary: string;
      location: string;
      education: string;
      linkedInLink: string;
      githubLink: string;
      _id: mongoose.Types.ObjectId;
    };
    profileStats: {
      views: number;
      respect: number;
      activeDays: { count: number; year: number }[];
      submissionCount: { count: number; year: number }[];
      programmingLanguages: { language: string; problemCount: number }[];
      _id: mongoose.Types.ObjectId;
    };
    isSubscribed: boolean;
    role: string;
  }

  interface IRecentACSubmission {
    title: string;
    time: string;
  }

  const { fetchUserDetails_API, fetchSubmissions_API } = userEndpoints;
  const [selectedTab, setSelectedTab] = useState<string>("Recent AC");
  const [isEditProfilePageVisible, setIsEditProfilePageVisible] =
    useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IuserDetails | null>(null);
  const [recentACSubmissions, setRecentACSubmissions] = useState<
    IRecentACSubmission[]
  >([]);
  const user = useRecoilValue(userState);
  const auth = useRecoilValue(authState);
  const submissionCount = userDetails?.profileStats.submissionCount.find(
    (submission) => submission.year === new Date().getFullYear(),
  )?.count;
  const activeDaysCount = userDetails?.profileStats.activeDays.find(
    (active) => active.year === new Date().getFullYear(),
  )?.count;

  const getUserDetails = async () => {
    try {
      const apiUrl = `${fetchUserDetails_API}/${user.id}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setUserDetails(response.data.userDetails);
      } else {
        toast.error(response.data.message || "Failed to fetch user details");
      }
    } catch (error: any) {
      console.log("error while fetching user details", error);
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "An error occurred, please try again",
      );
    }
  };

  const getRecentACSubmissions = async () => {
    try {
      const apiUrl = `${fetchSubmissions_API}/${user.id}?result=Accepted`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        setRecentACSubmissions(response.data.submissions);
      } else {
        toast.error(
          response.data.message || "Failed to fetch recent AC submissions",
        );
      }
    } catch (error: any) {
      console.log("error while fetching user details", error);
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "An error occurred, please try again",
      );
    }
  };

  if (!auth.isAuthenticated || !user.id) {
    return <Link to="/login" />;
  }

  useEffect(() => {
    getUserDetails();
    getRecentACSubmissions();
  }, []);

  var commitsPerDate: any = [];

  // function generateFakeCommitData() {
  //   for (let month = 0; month < 12; month++) {
  //     const numberOfDays = new Date(2023, month + 1, 0).getDate();

  //     for (let day = 1; day <= numberOfDays; day++) {
  //       const currentDate = new Date(2023, month, day, 5);
  //       commitsPerDate.push({
  //         date: currentDate.toJSON().substring(0, 10),
  //         count: Math.floor(Math.random() * 100),
  //       });
  //     }
  //   }
  // }

  // generateFakeCommitData();

  // Sample data for recent AC submissions
  // const items = [
  //   { title: "Determine the Maximum Path Sum", time: "2 hours ago" },
  //   { title: "Find the Longest Increasing Subsequence", time: "3 hours ago" },
  //   { title: "Evaluate the Binary Tree Paths", time: "4 hours ago" },
  //   { title: "Optimize Network Latency", time: "5 hours ago" },
  //   { title: "Calculate the Shortest Path", time: "6 hours ago" },
  //   { title: "Analyze the Stock Market Trends", time: "7 hours ago" },
  //   { title: "Design a File System", time: "8 hours ago" },
  //   { title: "Implement a Cache Mechanism", time: "9 hours ago" },
  //   { title: "Determine the Maximum Path Sum", time: "2 hours ago" },
  //   { title: "Find the Longest Increasing Subsequence", time: "3 hours ago" },
  //   { title: "Evaluate the Binary Tree Paths", time: "4 hours ago" },
  // ];

  return (
    <div className="mx-auto w-10/12 my-[1.4rem] bg-gray">
      <div className="lg:flex">
        {/* Left Card */}
        <div className="flex-[0.4] h-full">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex">
              <div>
                {userDetails?.imageUrl ? (
                  <img
                    src={userDetails.imageUrl}
                    alt="profile"
                    className="rounded-md h-24 w-24"
                    loading="lazy"
                  />
                ) : (
                  <div className="border border-gray-400 rounded-lg">
                    <User className="h-24 w-24 text-gray-400 bg-gray-100 rounded-lg" />
                  </div>
                )}
              </div>

              <div className="px-4 flex flex-col justify-between">
                <div>
                  <h1 className="font-semibold text-xl">{userDetails?.name}</h1>
                  <p className="text-gray-600 text-sm">
                    {userDetails?.username}
                  </p>
                </div>
                <Link
                  to={"/pricing"}
                  className="text-md text-yellow-600 flex items-center cursor-pointer hover:text-yellow-600"
                >
                  {user.isSubscribed ? "Premium Plan" : "Regular Plan"}
                  <span className="flex pt-[0.2rem]">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            <p className="text-gray-600 my-5 text-md">
              {userDetails?.personalInformation.summary}
            </p>

            <Button
              onClick={() => setIsEditProfilePageVisible((prev) => !prev)}
              className="w-full bg-green-100 text-green-400 hover:bg-green-200"
            >
              {isEditProfilePageVisible ? "Submissions" : "Edit Profile"}
            </Button>

            <div className="text-gray-600 my-5 text-md space-y-5">
              {userDetails && userDetails?.personalInformation.location && (
                <h3 className="flex items-center">
                  <FaLocationDot className="mr-3 h-4 w-4" />
                  {userDetails?.personalInformation.location}
                </h3>
              )}

              {userDetails && userDetails?.personalInformation.education && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <h1 className="flex items-center truncate">
                        <FaBuilding className="mr-3 h-4 w-4" />
                        {userDetails?.personalInformation.education.substring(
                          0,
                          40,
                        )}
                        ...
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent className="mb-3 bg-gray-800 text-white">
                      {userDetails?.personalInformation.education}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {userDetails && userDetails?.email && (
                <h3 className="flex items-center cursor-pointer hover:text-black">
                  <MailIcon className="mr-3 h-4 w-4" />
                  {userDetails?.email}
                </h3>
              )}

              {userDetails && userDetails?.personalInformation.linkedInLink && (
                <Link
                  to={userDetails.personalInformation.linkedInLink}
                  target="_blank"
                  className="flex items-center cursor-pointer hover:text-black"
                >
                  <FaLinkedin className="mr-3 h-4 w-4" />
                  {userDetails.personalInformation.linkedInLink.split("/")[4]}
                </Link>
              )}

              {userDetails && userDetails?.personalInformation.githubLink && (
                <Link
                  to={userDetails.personalInformation.githubLink}
                  target="_blank"
                  className="flex items-center cursor-pointer hover:text-black"
                >
                  <FaGithub className="mr-3 h-4 w-4" />
                  {userDetails.personalInformation.githubLink.split("/")[3]}
                </Link>
              )}
            </div>

            <div className="h-[0.05rem] bg-gray-300"></div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg">Profile Stats</h3>
              <div className="mt-3 space-y-4 text-gray-600 text-md">
                <h3 className="flex items-center cursor-pointer hover:text-black">
                  <Eye className="mr-3 h-4 w-4" />
                  Views{" "}
                  <span className="pl-2 text-black font-semibold">
                    {userDetails?.profileStats.views}
                  </span>
                </h3>
                <h3 className="flex items-center cursor-pointer hover:text-black">
                  <Medal className="mr-3 h-4 w-4" />
                  Respect{" "}
                  <span className="pl-2 text-black font-semibold">
                    {userDetails?.profileStats.respect}
                  </span>
                </h3>
                <h3 className="flex items-center cursor-pointer hover:text-black">
                  <RiDiscussFill className="mr-3 h-4 w-4" />
                  Discussion{" "}
                  <span className="pl-2 text-black font-semibold">
                    {userDetails?.profileStats.respect}
                  </span>
                </h3>
              </div>
            </div>

            {userDetails &&
              userDetails?.profileStats.programmingLanguages.length > 0 && (
                <>
                  <div className="h-[0.05rem] mt-5 bg-gray-300"></div>
                  <div className="mt-5">
                    <h3 className="font-semibold text-lg">Languages</h3>
                    <div className="mt-5 mb-3 space-y-5 text-gray-600 text-md">
                      {userDetails?.profileStats?.programmingLanguages?.map(
                        (lang, ind) => (
                          <h3
                            key={ind}
                            className="flex items-center cursor-pointer hover:text-black justify-between"
                          >
                            <span className="mr-3 flex items-center bg-gray-200 px-2 rounded-2xl">
                              {lang.language}
                            </span>
                            <span className="mx-2 text-gray-600">
                              <span className="text-black font-semibold">
                                {lang.problemCount}
                              </span>{" "}
                              problems solved
                            </span>
                          </h3>
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>

        {/* Right Cards */}
        <div className="flex-1 mt-4 lg:mt-0 lg:ml-4 items-center justify-center space-y-4">
          {isEditProfilePageVisible && (
            <>
              <div className="shadow-lg rounded-lg bg-white">
                <PersonalInformationPage
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  userId={user.id!}
                />
              </div>
              <div className="shadow-lg rounded-lg bg-white">
                <AccountInformationPage
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                />
              </div>
            </>
          )}

          {!isEditProfilePageVisible && (
            <>
              {/* HeatMap */}
              <div className="p-4 shadow-lg rounded-lg bg-white">
                <div className="px-2 mb-1 flex items-center justify-between text-sm text-gray-600">
                  <h1>
                    <span className="text-lg font-semibold text-black">
                      {submissionCount}{" "}
                    </span>{" "}
                    Submissions in {new Date().getFullYear()}
                  </h1>
                  <h1>
                    {" "}
                    Total Active Days:{" "}
                    <span className="font-semibold text-black">
                      {activeDaysCount}
                    </span>
                  </h1>
                </div>
                <div className="w-full flex items-center justify-center">
                  <ProblemHeatMap commitsData={commitsPerDate} />
                </div>
              </div>

              {/* Submissions */}
              <div className="shadow-lg rounded-lg bg-white p-4">
                {/* Top Nav */}
                <div className="flex md:justify-between select-none">
                  <div className="flex text-md text-gray-600 font-semibold">
                    <h3
                      className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === "Recent AC" ? "bg-gray-100 rounded-md text-black" : ""}`}
                      onClick={() => setSelectedTab("Recent AC")}
                    >
                      <ClipboardCheck className="w-7 h-6" />
                      Recent AC
                    </h3>
                    <h3
                      className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === "Lists" ? "bg-gray-100 rounded-md text-black" : ""}`}
                      onClick={() => setSelectedTab("Lists")}
                    >
                      <LuClipboardList className="w-7 h-6" />
                      Lists
                    </h3>
                    <h3
                      className={`hidden md:flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === "Discussion" ? "bg-gray-100 rounded-md text-black" : ""}`}
                      onClick={() => setSelectedTab("Discussion")}
                    >
                      <RiDiscussFill className="w-7 h-6" />
                      Discussion
                    </h3>
                    <h3
                      className={`flex items-center justify-center cursor-pointer hover:text-black gap-2 py-2 px-4 ${selectedTab === "Invites" ? "bg-gray-100 rounded-md text-black" : ""}`}
                      onClick={() => setSelectedTab("Invites")}
                    >
                      <MailIcon className="w-7 h-6" />
                      Invites
                    </h3>
                  </div>
                  <div className="md:flex hidden">
                    <SubmissionsFullScreen />
                  </div>
                </div>

                <div>
                  {selectedTab === "Recent AC" &&
                    (recentACSubmissions && recentACSubmissions.length > 0 ? (
                      <div className="pt-4">
                        {recentACSubmissions.map((submission, ind) => (
                          <div
                            key={ind}
                            className={`flex items-center justify-between rounded-md ${ind % 2 === 0 ? "bg-gray-100" : ""} p-5`}
                          >
                            <p className="font-semibold">{submission.title}</p>
                            <p className="text-gray-600 hidden md:flex">
                              {submission.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[18rem] my-6 flex flex-col justify-center items-center gap-2 select-none">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="font-semibold text-xl">
                          Pretty empty around here
                        </h3>
                        <p className="text-gray-600">
                          Let's solve your first problem!
                        </p>
                        <Button className="mt-5">Solve Problems</Button>
                      </div>
                    ))}

                  {selectedTab === "Lists" &&
                    (recentACSubmissions && recentACSubmissions.length > 0 ? (
                      <div className="pt-4">
                        {recentACSubmissions.map((submission, ind) => (
                          <div
                            key={ind}
                            className={`flex items-center justify-between rounded-md ${ind % 2 === 0 ? "bg-gray-100" : ""} p-5`}
                          >
                            <p className="font-semibold">{submission.title}</p>
                            <p className="text-gray-600 hidden md:flex">
                              {submission.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[18rem] my-6 flex flex-col justify-center items-center gap-2 select-none">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="font-semibold text-xl">
                          Pretty empty around here
                        </h3>
                        <p className="text-gray-600">There are no lists yet!</p>
                        <Button className="mt-5">Create List</Button>
                      </div>
                    ))}

                  {selectedTab === "Discussion" &&
                    (recentACSubmissions && recentACSubmissions.length > 0 ? (
                      <div className="pt-4">
                        {recentACSubmissions.map((submission, ind) => (
                          <div
                            key={ind}
                            className={`flex items-center justify-between rounded-md ${ind % 2 === 0 ? "bg-gray-100" : ""} p-5`}
                          >
                            <p className="font-semibold">{submission.title}</p>
                            <p className="text-gray-600 hidden md:flex">
                              {submission.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[18rem] my-6 flex flex-col justify-center items-center gap-2 select-none">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="font-semibold text-xl">
                          Pretty empty around here
                        </h3>
                        <p className="text-gray-600">
                          Post your first discussion here!
                        </p>
                        <Button className="mt-5">Post Discussion</Button>
                      </div>
                    ))}

                  {selectedTab === "Invites" &&
                    (recentACSubmissions && recentACSubmissions.length > 0 ? (
                      <div className="pt-4">
                        {recentACSubmissions.map((submission, ind) => (
                          <div
                            key={ind}
                            className={`flex items-center justify-between rounded-md ${ind % 2 === 0 ? "bg-gray-100" : ""} p-5`}
                          >
                            <p className="font-semibold">{submission.title}</p>
                            <p className="text-gray-600 hidden md:flex">
                              {submission.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[18rem] my-6 flex flex-col justify-center items-center gap-2 select-none">
                        <Ghost className="h-8 w-8 text-zinc-800" />
                        <h3 className="font-semibold text-xl">
                          Pretty empty around here
                        </h3>
                        <p className="text-gray-600">
                          Create your own interview room!
                        </p>
                        <Button className="mt-5">Create Room</Button>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
