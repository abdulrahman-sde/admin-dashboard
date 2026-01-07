export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export const UserRole = {
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  biography?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  biography?: string;
  avatar?: string;
  location?: string;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
    accessToken: string;
    refreshToken: string;
  };
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

export type UpdateProfileResponse = UserResponse;
