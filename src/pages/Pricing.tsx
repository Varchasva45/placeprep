import MaxWidthWrapper from "../components/MaxWidthWrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { cn } from "../lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import { buttonVariants } from "../components/ui/button";
import { Link } from "react-router-dom";
import userState from "../recoil/atoms/user";

const Pricing = () => {
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);

  const PLANS = [
    {
      name: "Free",
      slug: "free",
      quota: 10,
      pagesPerPdf: 5,
      price: {
        amount: 0,
        priceIds: {
          test: "",
          production: "",
        },
      },
    },
    {
      name: "Pro",
      slug: "pro",
      quota: 50,
      pagesPerPdf: 25,
      price: {
        amount: 99,
        priceIds: {
          test: "price_1NuEwTA19umTXGu8MeS3hN8L",
          production: "",
        },
      },
    },
  ];

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 10,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "pro")!.quota,
      features: [
        {
          text: "25 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <MaxWidthWrapper className={"mb-8 mt-14 text-center max-w-5xl"}>
      <div className="mb-10 flex flex-col items-center justify-center w-full">
        <h1 className={"text-5xl sm:text-6xl font-bold text-center"}>
          Pricing
        </h1>
        <p className="mt-5 text-gray-600 sm:text-lg text-center w-full font-semibold">
          Wether you are just trying out the platform or you need more, we have
          got you covered<span className="text-blue-500">.</span>
        </p>
      </div>

      <div className="pt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 w-[75%] mx-auto">
        <TooltipProvider>
          {pricingItems.map(({ plan, tagline, quota, features }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount ||
              0;
            return (
              <div
                key={plan}
                className={cn("relative rounded-2xl bg-white shadow-lg", {
                  "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
                  "border border-gray-200": plan !== "Pro",
                })}
              >
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}

                <div className="p-5">
                  <h3 className="my-3 text-3xl font-bold text-center">
                    {plan}
                  </h3>
                  <p className="text-gray-500 font-semibold">{tagline}</p>
                  <p className="my-5 font-display text-6xl font-semibold">
                    ₹{price}
                  </p>
                  <p className="text-gray-500">per month</p>
                </div>

                <div className="h-16 border flex items-center justify-center border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{quota.toLocaleString()} PDFs/mo included</p>
                  </div>

                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="cursor-pointer ml-1.5">
                      <HelpCircle className="h-4 w-4 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2 mb-4 border-2 bg-white border-gray-200 rounded-md">
                      How many PDFs can you upload per month.
                    </TooltipContent>
                  </Tooltip>
                </div>

                <ul className="my-6 px-8 space-y-5">
                  {features.map(({ text, footnote, negative }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0 items-center">
                        {negative ? (
                          <Minus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <Check className="h-6 w-6 text-blue-500" />
                        )}
                      </div>

                      <div className="flex space-x-2 items-center justify-center">
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": negative,
                          })}
                        >
                          {text}
                        </p>
                        {footnote ? (
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-pointer ml-1.5 mt-0.5">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2 mb-4 border-2 bg-white border-gray-200 rounded-md">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div>
                  {auth.isAuthenticated ? (
                    user.isSubscribed ? (
                      <div className="flex items-center justify-center">
                        <Link to={"/"}>
                          {plan !== "Pro" ? "Get Started" : "Upgrade Now"}
                        </Link>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {plan !== "Pro" ? (
                          <Link
                            to={"/"}
                            className={cn(
                              buttonVariants(),
                              "w-full mx-2 mt-3 mb-2 bg-gray-200 text-black flex items-center justify-center hover:bg-gray-300 cursor-pointer",
                            )}
                          >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        ) : (
                          <Link
                            to={"/pricing"}
                            className={cn(
                              buttonVariants(),
                              "w-full mx-2 mt-3 mb-2 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer flex items-center justify-center",
                            )}
                          >
                            Upgrade
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    )
                  ) : (
                    <Link
                      to={"/signup"}
                      className={cn(
                        buttonVariants(),
                        plan === "Pro"
                          ? "w-[95%] mb-2 mx-2 bg-blue-600 text-white items-center hover:bg-blue-500 cursor-pointer"
                          : "w-[95%] mb-2 mx-2 bg-gray-200 text-black items-center hover:bg-gray-300 cursor-pointer",
                      )}
                    >
                      <div className="flex items-center justify-center">
                        {plan !== "Pro" ? "Sign up" : "Sign up"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  );
};

export default Pricing;
