import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("jobPortalToken");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me").then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("jobPortalToken"))
      .finally(() => setLoading(false));
  }, []);
  const login = (data) => { localStorage.setItem("jobPortalToken", data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem("jobPortalToken"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
