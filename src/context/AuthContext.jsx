import { createContext } from "react";

export const AuthContext = createContext({
  employees: [],
  admin: [],
  setUserData: () => {},
});
