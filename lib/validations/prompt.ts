import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Введите заголовок").max(200),
  content: z.string().max(10000).optional(),
  isPublic: z.boolean().default(false),
});

export const updateNewsSchema = createNewsSchema;

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
