import React, { createContext, useState, ReactNode, useContext } from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setAuth: (user: User | null) => void;
  setUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (user: User | null) => {
    setUser(user);
  };

  const setUserData = (userData: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
