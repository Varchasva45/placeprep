import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { buttonVariants } from "../components/ui/button";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { motion } from "framer-motion";


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
  
  
  function MountainIcon(props: any) {
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
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    )
  }
  
  function UsersIcon(props: any) {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

const InterviewLanding = () => {
    return (
    <>
        <MaxWidthWrapper className="mb-16 mt-16 sm:mt-10 flex flex-col items-center justify-center text-center">
            <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
                <p className="text-sm font-semibold text-gray-700">
                    Prepare for interviews with power of AI 
                </p>
            </div>
        <motion.h1
            className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0, 0.71, 0.2, 1.01],
            }}
        >
            AI <span className="text-blue-600"> Interviews </span> <br />
            Practice, Perfect, Perform<span className="text-blue-600">.</span>
        </motion.h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
            AI Interviews provides a realistic interview experience with an AI interviewer. 
            Practice in real-time for your target job profile and refine your skills.
        </p>

        {/* <Link
            className={buttonVariants({
            size: "lg",
            className: "mt-5",
            })}
            to={"/dashboard"}
        >
            Get Started <FaArrowRight className="ml-2 h-5 w-5" />
        </Link> */}
        </MaxWidthWrapper>

        <div className="flex flex-col">
            <main className="flex-1">
                <section className="w-full">
                    <div className="container px-4 md:px-6">
                        <div className="grid lg:grid-cols-2 lg:gap-12 gap-6">
                            <div style={{ backgroundColor: 'rgb(229,240,255)' }} className="rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-md">
                                <div className="bg-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <BotIcon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">AI Interview</h3>
                                <p className="text-muted-foreground">
                                    Streamline your hiring process with our AI-powered interview assistant. Get instant feedback and
                                    insights to make informed decisions.
                                </p>
                                <Link
                                    className={buttonVariants({
                                        size: "lg",
                                        className: "mt-5",
                                        variant: "default"
                                    })}
                                    to={"/dashboard"}
                                >
                                    AI Interview <FaArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                            <div style={{ backgroundColor: 'rgb(229,240,255)' }} className="rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-md">
                                <div className="bg-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <UsersIcon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Group Interview</h3>
                                <p className="text-muted-foreground">
                                    Collaborate with your team and candidates in a virtual interview setting. Easily assess and compare
                                    candidates with our group interview features.
                                </p>
                                <Link
                                    className={buttonVariants({
                                        size: "lg",
                                        className: "mt-5",
                                        variant: "default"
                                    })}
                                    to={"/dashboard"}
                                >
                                    Group Interview <FaArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <div>
        <div className="relative isolate">
            <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                    clipPath:
                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>

            {/* <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 p-2 bg-gray-900/5 rounded-xl ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                    src="./dashboard-preview.jpg"
                    alt="Hero Image"
                    width={1364}
                    height={866}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                />
                </div>
            </div>
            </div> */}

            <div className="max-w-5xl mx-auto mb-32 mt-32 sm:mt-32">
            <div className="mb-16 px-6 lg:px-8">
                <div className="mx-auto max-w-3xl sm:text-center">
                    <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
                        Prepare for Interviews seemlessly
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Preparing for interviews has never been easier than with PlacePrep.
                    </p>
                </div>
            </div>

            <div className="flex justify-center w-full">
                <h1 className="text-4xl font-semibold text-blue-600">Features</h1>
            </div>

            <ol className="pt-8 mx-3 mb-8 mt-4 space-y-12 md:flex md:space-x-12 md:space-y-0">
                <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-blue-600">
                        Feature 1
                    </span>
                    <span className="text-xl font-semibold">
                        Seemless AI interviews 
                    </span>
                    <span className="mt-2 text-zinc-700">
                        Practice for your target job profile. Either start with a free plan or go for our{" "}
                    <Link
                        to={"/pricing"}
                        className="text-blue-700 underline underline-offset-2"
                    >
                        pro plan
                    </Link>
                    .
                    </span>
                </div>
                </li>
                <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-blue-600">
                        Feature 2
                    </span>
                    <span className="text-xl font-semibold">
                        Group Interviews
                    </span>
                    <span className="mt-2 text-zinc-700">
                        Practice with your friends and get feedback from each other.
                    </span>
                </div>
                </li>
                <li className="md:flex-1">
                <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-blue-600">
                        Feature 3 (Pro Plan)
                    </span>
                    <span className="text-xl font-semibold">
                        Detailed Interview Analysis
                    </span>
                    <span className="mt-2 text-zinc-700">
                        Get detailed analysis of your interview performance and areas of improvement.
                    </span>
                </div>
                </li>
            </ol>
            </div>

            <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mt-16 mb-16 flow-root sm:mt-24">
                <div className="-m-2 p-2 bg-gray-900/5 rounded-xl ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                    src="./file-upload-preview.jpg"
                    alt="Hero Image"
                    width={1364}
                    height={866}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                />
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
    );
};

export default InterviewLanding;