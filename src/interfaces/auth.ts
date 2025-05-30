export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  fullName: string;
}
