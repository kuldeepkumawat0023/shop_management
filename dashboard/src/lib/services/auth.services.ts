import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export interface LoginPayload {
  email: string;
  password?: string;
  captchaToken?: string | null;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  password?: string;
  confirmPassword?: string;
  captchaToken?: string | null;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

/**
 * 🔐 Advanced Auth Service
 * Perfectly matched to the Node.js backend controllers.
 */
export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginPayload): Promise<ApiResponse<{ user: AuthUser; token: string; expiresAt?: number }>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  /**
   * Google Login (Social)
   */
  googleLogin: async (token: string, type: 'idToken' | 'accessToken' = 'idToken'): Promise<ApiResponse<{ user: AuthUser; token: string; expiresAt?: number }>> => {
    const payload = type === 'accessToken' ? { accessToken: token } : { idToken: token };
    const response = await apiClient.post('/auth/google-login', payload);
    return response.data;
  },

  /**
   * Register user
   */
  register: async (data: RegisterPayload): Promise<ApiResponse<{ user: AuthUser; token?: string; isReactivation?: boolean; expiresAt?: number }>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  /**
   * Forgot Password - Trigger OTP
   */
  forgotPassword: async (email: string, captchaToken?: string | null): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/forgot-password', { email, captchaToken });
    return response.data;
  },

  /**
   * Verify OTP (Step 2 of Password Reset or Reactivation)
   */
  verifyOtp: async (data: OtpPayload): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Reset Password (Step 3)
   */
  resetPassword: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Reactivate Account (After soft-delete)
   */
  reactivateAccount: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reactivate-account', data);
    return response.data;
  },

  /**
   * Get Current User Profile
   */
  getProfile: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
