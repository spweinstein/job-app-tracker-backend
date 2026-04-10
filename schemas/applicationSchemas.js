import { z } from "zod";
import { optionalObjectId, requiredObjectId } from "./common.js";

export const applicationStatuses = [
  "Applied",
  "Interviewing",
  "Accepted",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export const applicationPriorities = ["Low", "Medium", "High"];

export const applicationSources = [
  "LinkedIn",
  "Indeed",
  "Company Site",
  "Networking",
  "Referral",
  "Recruiter",
];

const statusEnum = z.enum(applicationStatuses);
const priorityEnum = z.enum(applicationPriorities);
const sourceEnum = z.enum(applicationSources);

const appliedAtField = z.preprocess((v) => {
  if (v === "" || v == null) return undefined;
  return v;
}, z.coerce.date().optional());

const urlField = z
  .string()
  .optional()
  .transform((v) => (v == null ? "" : v));

export const applicationCreateBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  company: requiredObjectId,
  resume: optionalObjectId,
  coverLetter: optionalObjectId,
  status: statusEnum,
  priority: priorityEnum,
  source: sourceEnum,
  appliedAt: appliedAtField,
  url: urlField,
});

export const applicationUpdateBodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(500),
  company: requiredObjectId,
  resume: optionalObjectId,
  coverLetter: optionalObjectId,
  status: statusEnum,
  priority: priorityEnum,
  source: sourceEnum,
  appliedAt: appliedAtField,
  url: urlField,
});
