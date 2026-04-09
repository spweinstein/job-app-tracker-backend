import { z } from "zod";
import { optionalObjectId, requiredObjectId } from "./common.js";

const dateOrString = z.union([z.string(), z.coerce.date()]);

const experienceItemSchema = z.object({
  company: requiredObjectId,
  title: z.string().trim().min(1),
  startDate: dateOrString,
  endDate: dateOrString.optional(),
  description: z.string().optional(),
});

const educationItemSchema = z.object({
  degree: z.string().trim().min(1),
  school: z.string().trim().min(1),
  year: z.union([z.number(), z.string()]).optional(),
});

const projectItemSchema = z.object({
  title: z.string().trim().min(1),
  company: optionalObjectId,
  year: z.union([z.number(), z.string()]).optional(),
  link: z.string().optional(),
  description: z.string().optional(),
});

const certificationItemSchema = z.object({
  title: z.string().optional(),
  company: optionalObjectId,
  year: z.union([z.number(), z.string()]).optional(),
  description: z.string().optional(),
});

const resumeFields = {
  name: z.string().trim().min(1, "Name is required").max(500),
  link: z.string().optional(),
  summary: z.string().optional(),
  notes: z.string().optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
};

export const resumeCreateBodySchema = z.object({
  ...resumeFields,
  parent: optionalObjectId,
});

export const resumeUpdateBodySchema = z.object({
  ...resumeFields,
  // Do not allow parent to be changed
});
