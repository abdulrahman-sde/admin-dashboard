import { userRepository } from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { generateTokens, verifyToken } from "../lib/jwt.js";
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors.js";

import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../utils/validators/auth.validator.js";

export const adminAuthService = {
  async loginUser({ email, password }: LoginInput) {
    const user = await userRepository.findByEmail(email);

    if (!user || !(await comparePassword(password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Account is not active");
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "admin",
    });

    await userRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
    });

    const { password: _, refreshToken: __, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  },

  async registerUser(input: RegisterInput) {
    const exists = await userRepository.findByEmail(input.email);

    if (exists) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await userRepository.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: hashedPassword,
      role: input.role || "ADMIN",
      status: "ACTIVE",
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "admin",
    });

    await userRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
    });

    const { password: _, refreshToken: __, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  },

  async refreshToken(token: string) {
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (payload.type !== "admin") {
      throw new UnauthorizedError("Invalid token type");
    }

    const user = await userRepository.findById(payload.userId);

    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Account is not active");
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "admin",
    });

    await userRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  },

  async logoutUser(userId: string) {
    await userRepository.update(userId, {
      refreshToken: null,
    });
  },

  async getUserProfile(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }

    const { password, ...safeUser } = user;
    return safeUser;
  },

  async updateProfile(id: string, input: UpdateProfileInput) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (input.email && input.email !== user.email) {
      const existing = await userRepository.findByEmail(input.email);
      if (existing) {
        throw new ConflictError("Email already in use");
      }
    }

    const updateData: any = { ...input };
    if (updateData.dateOfBirth === "") {
      updateData.dateOfBirth = null;
    }

    const updatedUser = await userRepository.update(id, updateData);
    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
  },

  async changePassword(
    id: string,
    { currentPassword, newPassword }: ChangePasswordInput
  ) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError("Incorrect current password");
    }

    const hashedPassword = await hashPassword(newPassword);
    await userRepository.update(id, { password: hashedPassword });
  },
};
