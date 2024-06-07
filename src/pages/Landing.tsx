import { useRecoilValue } from "recoil";
import userState from "../recoil/atoms/user";
import { useEffect } from "react";

const Landing = () => {

    const user = useRecoilValue(userState);

    useEffect(() => {
        console.log(user);
    }, []);
    

    return (
        <div>
        </div>
    );
}

export default Landing;
