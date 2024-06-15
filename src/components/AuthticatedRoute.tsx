import { useRecoilValue } from "recoil";
import authState from "../recoil/atoms/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const auth = useRecoilValue(authState);

  if (auth.isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthenticatedRoute;
