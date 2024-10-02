import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';
import StoreContext from '../store/storecontext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ emailVerified: false });
  const store = useContext(StoreContext);

  useEffect(() => {
    const checkVerification = async () => {
      const token =localStorage.getItem("token");
      const decoded = jwtDecode(token)
      const userData = await store.services.userService.GetUser(decoded.id); 
      setUser(userData.data);
    };
    
    checkVerification();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};