import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";

interface User {
    name: string;
    email: string;
}

const Home: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const handleClick = async () => {
            try {
                const response = await fetch("http://localhost:3000/auth/login/success", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials": 'true',
                    },
                });
    
                const userResponse = await response.json();
                setUser(userResponse.user);
            } catch (error) {
                console.log("There was an error", error);
            }
        };

        handleClick();
    }, []);

    return (
        <div>
            <NavBar />
            <h1>Home: {JSON.stringify(user)}</h1>
            <p>Welcome to the home page</p>
        </div>
    );
}

export default Home;
