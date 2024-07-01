import { atom, useRecoilState } from "recoil";
import Cookies from "js-cookie";

const token = Cookies.get("token") || null;
console.log(token);

const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: token ? true : false,
    token: token,
  },
});

export default authState;
