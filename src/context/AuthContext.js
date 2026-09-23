import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = "http://127.0.0.1:8000/api";

export function getCsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith("csrftoken="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function requestCsrfToken() {
    await fetch(`${API_URL}/auth/csrf/`, { credentials: "include" });
  }

  async function loadUser() {
    const res = await fetch(`${API_URL}/auth/users/me/`, {
      credentials: "include",
    });

    if (!res.ok) {
      setUser(null);
      return false;
    }

    setUser(await res.json());
    return true;
  }

  async function login(username, password) {
    await requestCsrfToken();
    const res = await fetch(`${API_URL}/auth/jwt/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return false;
    return loadUser();
  }

  async function refreshToken() {
    const res = await fetch(`${API_URL}/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "X-CSRFToken": getCsrfToken() },
      credentials: "include",
    });

    return res.ok;
  }

  useEffect(() => {
    async function restoreSession() {
      await requestCsrfToken();
      if (!(await loadUser())) {
        if (await refreshToken()) await loadUser();
      }
      setIsLoading(false);
    }

    restoreSession();

    const interval = setInterval(async () => {
      if (await refreshToken()) await loadUser();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  async function logout() {
    await fetch(`${API_URL}/auth/jwt/logout/`, {
      method: "POST",
      headers: { "X-CSRFToken": getCsrfToken() },
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
