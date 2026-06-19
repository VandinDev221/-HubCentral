export type UserRole = 'admin';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface VerifyCodeDto {
  email: string;
  code: string;
}

export interface GoogleAuthDto {
  credential: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

export interface RegisterStartResponse {
  message: string;
  expiresInMinutes: number;
}
