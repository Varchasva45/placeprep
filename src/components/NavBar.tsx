import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import AIDocsMobileNavbar from "./AIDocsMobileNavbar";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import UserAccountNav from "./UserAccountNavbar";
import userState from "../recoil/atoms/user";
import MaxWidthWrapper2 from "./MaxWidthWrapper2";

const NavBar = () => {
  const user = useRecoilValue(userState);
  const auth = useRecoilValue(authState);

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 opacity-95 bg-white/75 backdrop-blur-xl transition-all">
      <MaxWidthWrapper2>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <div className="flex space-x-12 mr-10">
            <div className="flex items-center">
              <Link to="/" className="flex z-40 font-semibold">
                <span>PlacePrep</span>
              </Link>
            </div>

            <div className="hidden lg:flex space-x-1">
              <Link
                to="/problems"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Problems
              </Link>

              <Link
                to="/sheets"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                OA Sheet
              </Link>

              <Link
                to="/interview"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Interview
              </Link>

              <Link
                to="/playground"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Playground
              </Link>

              <Link
                to="/explore"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                AI Docs
              </Link>

              <Link
                to="/assistance"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Assistance
              </Link>

              <Link
                to="/community"
                className={buttonVariants({
                  variant: "ghost",
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
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
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
                  to={"/signup"}
                >
                  Register <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/u/${user.username}`}
                  className={buttonVariants({
                    variant: "ghost",
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
