import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import userState from "../recoil/atoms/user";
import authState from "../recoil/atoms/auth";

const AIDocsMobileNavbar = ({ isAuth }: { isAuth: boolean }) => {

  const navigate = useNavigate();
  const [isOpen, setOpen] = useState<boolean>(false);
  const pathname = useParams();
  const toggleOpen = () => setOpen((prev) => !prev);
  const setUser = useSetRecoilState(userState);
  const setAuth = useSetRecoilState(authState);

  const closeOnCurrent = (to: any) => {
    if (pathname === to) {
      toggleOpen();
    }
    // toggleOpen()
  };

  const handleLogout = (e: any) => {
    e.preventDefault();
    console.log('Logging out');
    Cookies.remove("token");
    Cookies.remove("user");
    setAuth({ token: null, isAuthenticated: false });
    setUser({ id: null, name: null, username: null, email: null, isSubscribed: false, imageUrl: null });
    navigate("/");
  };

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700 hover:cursor-pointer"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-up")}
                    className="flex items-center w-full font-semibold text-green-600"
                    to="/signup"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/signin")}
                    className="flex items-center w-full font-semibold"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex items-center w-full font-semibold"
                    to="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex items-center w-full font-semibold"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    to="#"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default AIDocsMobileNavbar;
