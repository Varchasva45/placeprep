import { atom } from "recoil";
import Cookies from "js-cookie";

interface User {
  name: string | null;
  username: string | null;
  id: string | null;
  email: string | null;
  isSubscribed: boolean | null;
  imageUrl: string | null;
}

const getUserFromCookies = (): User | null => {
  try {
    const userDataFromCookies = Cookies.get("user");
    return userDataFromCookies ? JSON.parse(userDataFromCookies) : null;
  } catch (error) {
    console.error("Error parsing user data from cookies", error);
    return null;
  }
};

const user = getUserFromCookies();

const userState = atom<User>({
  key: "userState",
  default: {
    name: user?.name ?? null,
    username: user?.username ?? null,
    id: user?.id || null,
    email: user?.email ?? null,
    isSubscribed: user?.isSubscribed ?? false,
    imageUrl: user?.imageUrl ?? null,
  },
});

export default userState;
