import type { ReactNode } from "react";

export interface User {
  $id: string;
  email: string;
  fullName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  fullName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
