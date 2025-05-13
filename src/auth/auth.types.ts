export interface SignUpRequest {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface AuthResponse {
  user: any | null;
  session: any | null;
  error: string | null;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}