import { useNavigate } from "react-router";
import {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../lib/store/services/auth/authApi";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types/auth";

export const useAuth = () => {
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: isCheckingAuth,
    isSuccess: isUserSuccess,
  } = useGetMeQuery(undefined, {
    pollingInterval: 5 * 60 * 1000,
  });

  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [
    registerMutation,
    { isLoading: isRegisterLoading, error: registerError },
  ] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [changePasswordMutation] = useChangePasswordMutation();

  const login = async (credentials: LoginInput) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      navigate("/dashboard");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const result = await registerMutation(data).unwrap();
      navigate("/dashboard");
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    return await updateProfileMutation(data).unwrap();
  };

  const changePassword = async (data: ChangePasswordInput) => {
    return await changePasswordMutation(data).unwrap();
  };

  return {
    user: userData?.data?.user,
    isAuthenticated: isUserSuccess && !!userData?.data?.user,
    isCheckingAuth,
    isLoading:
      isCheckingAuth || isLoginLoading || isLogoutLoading || isRegisterLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loginError,
    registerError,
  };
};
