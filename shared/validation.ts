import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2),
  // Optionnel : la capture via Lina se fait au numéro de téléphone (sans email).
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7),
  interest: z.string().min(2),
  message: z.string().max(4000).optional(),
  source: z.string().default("site")
});

export type LeadInput = z.infer<typeof leadSchema>;
