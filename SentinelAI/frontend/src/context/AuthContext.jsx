import React, { createContext, useContext, useMemo, useState } from "react";

const USERS_KEY = "sentinelai_users";
const SESSION_KEY = "sentinelai_session";

const AuthContext = createContext(null);

const getStoredUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const getStoredSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (session && session.email) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredSession);

  const register = ({ name, email, password }) => {
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return { ok: false, message: "Email is already registered." };
    }

    const newUser = { name: name.trim(), email: email.trim(), password };
    const nextUsers = [...users, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

    const session = { name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);

    return { ok: true };
  };

  const login = ({ email, password }) => {
    const users = getStoredUsers();
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matched) {
      return { ok: false, message: "Invalid email or password." };
    }

    const session = { name: matched.name, email: matched.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);

    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
