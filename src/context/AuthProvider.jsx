import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { getLocalStorage, setLocalStorage } from "../Utils/LocalStorage";

function AuthProvider({ children }) {
  // localStorage.clear()
  const [userData, setUserData] = useState(() => {
    try {
      const storedEmployees = localStorage.getItem("employees");
      const storedAdmin = localStorage.getItem("admin");

      if (!storedEmployees || !storedAdmin) {
        setLocalStorage();
      }

      return getLocalStorage();
    } catch {
      return { employees: [], admin: [] };
    }
  });

  const value = {
    employees: userData?.employees || [],
    admin: userData?.admin || [],
    setUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
