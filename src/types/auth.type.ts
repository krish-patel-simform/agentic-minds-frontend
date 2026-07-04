export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RoleRead {
  id: number;
  name: string;
  description: string | null;
  is_system: boolean;
  permissions: unknown[];
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  roles: RoleRead[];
  created_at: string;
  updated_at: string;
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HttpValidationError {
  detail: ValidationErrorDetail[] | string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
