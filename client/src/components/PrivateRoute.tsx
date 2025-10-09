import React from "react";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): React.JSX.Element => {
  const { user } = useSelector((state: RootState) => state.auth);
  const hasStoredUser = typeof window !== 'undefined' && !!localStorage.getItem('profile');
  return user || hasStoredUser ? <>{children}</> : <Login />;
};

export default PrivateRoute;
