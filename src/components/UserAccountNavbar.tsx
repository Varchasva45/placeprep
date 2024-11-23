import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Gem } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "./Icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import userState from "../recoil/atoms/user";
import Cookies from "js-cookie";
import authState from "../recoil/atoms/auth";
interface UserAccountNavProps {
  email: string | undefined;
  name: string;
  imageUrl: string;
}

const UserAccountNav = ({ email, imageUrl, name }: UserAccountNavProps) => {
  const [user, setUser] = useRecoilState(userState);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleLogout = (e: any) => {
    e.preventDefault();
    Cookies.remove("token");
    Cookies.remove("user");
    setAuth({ token: null, isAuthenticated: false });
    setUser({
      id: null,
      name: null,
      username: null,
      email: null,
      isSubscribed: false,
      imageUrl: null,
    });
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
          <Avatar className="relative w-8 h-8">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <img
                  src={imageUrl}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && <p className="font-medium text-sm text-black">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-xs text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          {user.isSubscribed ? (
            <Link to="/dashboard/billing">Manage Subscription</Link>
          ) : (
            <Link to="/pricing">
              Upgrade <Gem className="text-blue-600 h-4 w-4 ml-1.5" />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`/u/${user.username}`}>Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/dashboard">AI Docs Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Link to={"#"} onClick={handleLogout}>
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
