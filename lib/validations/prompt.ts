import { z } from "zod";

export const createPromptSchema = z.object({
  title: z.string().min(1, "Введите заголовок").max(200),
  content: z.string().max(10000).optional(),
  isPublic: z.boolean().default(false),
});

export const updatePromptSchema = createPromptSchema;

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
