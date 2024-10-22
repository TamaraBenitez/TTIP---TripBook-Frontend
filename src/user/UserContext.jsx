import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';
import StoreContext from '../store/storecontext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const store = useContext(StoreContext);
  const [userDataLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        try {
          const userData = await store.services.userService.GetUser(decoded.id);
          setUser(userData.data);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
      setLoading(false);
    };
    if(!user){
      checkVerification();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, userDataLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};