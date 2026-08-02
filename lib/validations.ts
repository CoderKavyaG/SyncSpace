import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name cannot be empty")
    .max(60, "Workspace name must be less than 60 characters"),
  iconUrl: z.string().optional().nullable(),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name cannot be empty")
    .max(60, "Workspace name must be less than 60 characters")
    .optional(),
  iconUrl: z.string().optional().nullable(),
});

export const createPageSchema = z.object({
  title: z.string().trim().max(120, "Title must be under 120 characters").optional(),
  icon: z.string().optional().nullable(),
  parentPageId: z.string().optional().nullable(),
});

export const updatePageSchema = z.object({
  title: z.string().trim().max(120, "Title must be under 120 characters").optional(),
  icon: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  parentPageId: z.string().optional().nullable(),
  isArchived: z.boolean().optional(),
});
