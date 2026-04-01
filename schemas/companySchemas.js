import { z } from "zod";

export const companyBodySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(500),
    url: z
      .string()
      .optional()
      .transform((v) => (v == null ? "" : String(v).trim())),
    description: z
      .string()
      .optional()
      .transform((v) => (v == null ? "" : v)),
    notes: z
      .string()
      .optional()
      .transform((v) => (v == null ? "" : v)),
  })
  .superRefine((data, ctx) => {
    if (data.url && data.url.length > 0) {
      const r = z.string().url().safeParse(data.url);
      if (!r.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid URL or leave blank",
          path: ["url"],
        });
      }
    }
  });
