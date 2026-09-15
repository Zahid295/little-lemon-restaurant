import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  async function login(username, password) {
    const res = await fetch("http://127.0.0.1:8000/api/auth/jwt/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setAccessToken(data.access);
    await loadUser();
  }

  async function loadUser() {
    if (!accessToken) return;

    const res = await fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    setUser(data);
  }

  async function refreshToken() {
    const res = await fetch("http://127.0.0.1:8000/api/auth/jwt/refresh/", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    setAccessToken(data.access);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 4 * 60 * 1000); // refresh every 4 minutes

    return () => clearInterval(interval);
  }, []);

  function logout() {
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
