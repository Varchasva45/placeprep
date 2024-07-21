import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import AIDocsMobileNavbar from "./AIDocsMobileNavbar";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import UserAccountNav from "./UserAccountNavbar";
import userState from "../recoil/atoms/user";
import MaxWidthWrapper2 from "./MaxWidthWrapper2";
import { useState } from "react";

const NavBar = () => {
  const user = useRecoilValue(userState);
  const auth = useRecoilValue(authState);
  const [url, setUrl] = useState("/" + window.location.href.split("/")[3]);

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 opacity-95 bg-white/75 backdrop-blur-xl transition-all">
      <MaxWidthWrapper2>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <div className="flex space-x-12 mr-10">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex z-40 font-semibold"
                onClick={() => setUrl("/")}
              >
                <span>PlacePrep</span>
              </Link>
            </div>

            <div className="hidden lg:flex space-x-1">
              <Link
                to="/problems"
                onClick={() => setUrl("/problems")}
                className={buttonVariants({
                  variant: url === "/problems" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                Problems
              </Link>

              <Link
                to="/sheets"
                onClick={() => setUrl("/sheets")}
                className={buttonVariants({
                  variant: url === "/sheets" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                OA Sheet
              </Link>

              <Link
                to="/interview"
                onClick={() => setUrl("/interview")}
                className={buttonVariants({
                  variant: url === "/interview" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                Interview
              </Link>

              <Link
                to="/playground"
                onClick={() => setUrl("/playground")}
                className={buttonVariants({
                  variant: url === "/playground" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                Playground
              </Link>

              <Link
                to="/explore"
                onClick={() => setUrl("/explore")}
                className={buttonVariants({
                  variant: url === "/explore" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                AI Docs
              </Link>

              <Link
                to="/copilot"
                onClick={() => setUrl("/copilot")}
                className={buttonVariants({
                  variant: url === "/copilot" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                Copilot
              </Link>

              <Link
                to="/community"
                onClick={() => setUrl("/community")}
                className={buttonVariants({
                  variant: url === "/community" ? "selected" : "ghost",
                  size: "sm",
                })}
              >
                Community
              </Link>
            </div>
          </div>

          <AIDocsMobileNavbar isAuth={auth.isAuthenticated} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!auth.isAuthenticated ? (
              <>
                <Link
                  to="/pricing"
                  onClick={() => setUrl("/pricing")}
                  className={buttonVariants({
                    variant: url === "/pricing" ? "selected" : "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  onClick={() => setUrl("/login")}
                  className={buttonVariants({
                    variant: url === "/login" ? "selected" : "ghost",
                    size: "sm",
                  })}
                  to={"/login"}
                >
                  Login
                </Link>
                <Link
                  className={buttonVariants({
                    size: "sm",
                  })}
                  onClick={() => setUrl("/signup")}
                  to={"/signup"}
                >
                  Register <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/u/${user.username}`}
                  onClick={() => setUrl(`/u`)}
                  className={buttonVariants({
                    variant: url === `/u` ? "selected" : "ghost",
                    size: "sm",
                  })}
                >
                  Profile
                </Link>

                <UserAccountNav
                  name={user.name ?? ""}
                  email={user.email ?? ""}
                  imageUrl={user.imageUrl ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper2>
    </nav>
  );
};

export default NavBar;
