export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: 'standard' | 'admin';
    bio?: string;
    profile_image?: string;
    is_admin: boolean;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }