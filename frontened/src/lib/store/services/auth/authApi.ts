import { api } from "../api";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  UserResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
  ChangePasswordInput,
} from "../../../../types/auth";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginInput>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: build.mutation<RegisterResponse, RegisterInput>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.resetApiState());
        } catch {}
      },
    }),
    getMe: build.query<UserResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    updateProfile: build.mutation<UpdateProfileResponse, UpdateProfileInput>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: build.mutation<void, ChangePasswordInput>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
