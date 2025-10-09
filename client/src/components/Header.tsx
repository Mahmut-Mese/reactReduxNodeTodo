import React, { useState, useEffect } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/features/authSlice";
import decode from "jwt-decode";
import { RootState, AppDispatch } from "../redux/store";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const Header: React.FC = (): React.JSX.Element => {
  console.log('=== HEADER COMPONENT RENDERING ===');
  
  const [show, setShow] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  // Check authentication status
  const isAuthenticated = user?.result?.id || (typeof window !== 'undefined' && !!localStorage.getItem('profile'));
  
  console.log('Header Debug:', {
    user: user,
    isAuthenticated: isAuthenticated,
    hasLocalStorage: typeof window !== 'undefined' && !!localStorage.getItem('profile')
  });

  // Check token expiration
  useEffect(() => {
    if (user?.token) {
      try {
        const decodedToken: DecodedToken = decode(user.token);
        const currentTime = new Date().getTime();
        const tokenExpiry = decodedToken.exp * 1000;
        
        if (tokenExpiry < currentTime) {
          console.log('Token expired, logging out');
          dispatch(setLogout());
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(setLogout());
      }
    }
  }, [user?.token, dispatch]);

  const handleLogout = (): void => {
    dispatch(setLogout());
  };

  return (
    <MDBNavbar fixed="top" expand="lg" style={{ backgroundColor: "#f0e6ea", minHeight: '45px' }}>
      <MDBContainer>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
          style={{ color: "#606080" }}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
          <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
            <MDBNavbarItem>
              <MDBNavbarLink href="/">
                <p className="header-text">Home</p>
              </MDBNavbarLink>
            </MDBNavbarItem>
           
            {isAuthenticated ? (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p className="header-text" onClick={() => handleLogout()}>
                    Logout
                  </p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p className="header-text">Login</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;