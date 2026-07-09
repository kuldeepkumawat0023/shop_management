import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export interface LoginPayload {
  email: string;
  password?: string;
  captchaToken?: string | null;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

/**
 * 🔒 Authentication Service
 * Synced exactly with backend/src/routes/authRoutes.js
 */
export const authService = {
  /**
   * Login User (Email + Password)
   * POST /api/auth/login
   */
  login: async (data: LoginPayload): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  /**
   * Register User
   * POST /api/auth/register
   */
  register: async (data: any): Promise<ApiResponse<{ user: AuthUser; token: string; expiresAt?: number; isReactivation?: boolean }>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  /**
   * Google Login
   * POST /api/auth/google-login
   */
  googleLogin: async (data: { token: string }): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/auth/google-login', data);
    return response.data;
  },

  /**
   * Forgot Password
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Verify OTP
   * POST /api/auth/verify-otp
   */
  verifyOtp: async (data: OtpPayload): Promise<ApiResponse<{ user: AuthUser; token: string }>> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Reset Password
   * POST /api/auth/reset-password
   */
  resetPassword: async (data: any): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Logout User
   * POST /api/auth/logout
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
