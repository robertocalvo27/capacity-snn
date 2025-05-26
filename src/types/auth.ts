export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supervisor' | 'line-leader';
  valueStream: string;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}