import { useRecoilValue } from "recoil";
import NavBar from "../components/NavBar";
import userState from "../recoil/atoms/user";
import { useEffect } from "react";

const Landing = () => {

    const user = useRecoilValue(userState);

    useEffect(() => {
        console.log(user);
    }, []);
    

    return (
        <div>
            <NavBar />
        </div>
    );
}

export default Landing;
