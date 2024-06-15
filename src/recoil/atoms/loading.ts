import { atom } from "recoil";

const loadingState = atom({
  key: "loadingState",
  default: {
    loading: false,
  },
});

export default loadingState;
