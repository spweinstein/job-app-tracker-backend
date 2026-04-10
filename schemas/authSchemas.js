import { z } from "zod";

export const loginBodySchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerBodySchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(100),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200),
});
