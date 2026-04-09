import rateLimit from "express-rate-limit";

/** Limits brute-force / abuse on login + register (per IP). */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // tweak: stricter for login-only if you split limiters
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});
