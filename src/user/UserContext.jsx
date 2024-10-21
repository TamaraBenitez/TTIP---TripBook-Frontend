import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';
import StoreContext from '../store/storecontext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const store = useContext(StoreContext);

  useEffect(() => {
    const checkVerification = async () => {
      if(!user){
        const token =localStorage.getItem("token");
        if(token){
          const decoded = jwtDecode(token)
          const userData = await store.services.userService.GetUser(decoded.id); 
          console.log("===========> USERDATA", userData.data)
          setUser(userData.data);
        }
      }
    };
    
    checkVerification();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};