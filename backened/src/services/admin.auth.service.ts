import { userRepository } from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { generateTokens } from "../lib/jwt.js";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";

import type {
  LoginInput,
  RegisterInput,
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

    // Update last login
    await userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "admin",
    });

    const { password: _, ...safeUser } = user;

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

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  },
};
