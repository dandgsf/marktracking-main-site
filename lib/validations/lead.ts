import { z } from "zod";

const MAX_TEXT = 500;
const MAX_MESSAGE = 2000;

export const leadSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim(),
  email: z
    .string()
    .email("E-mail inválido")
    .max(254, "E-mail muito longo")
    .transform((v) => v.toLowerCase().trim()),
  empresa: z.string().max(MAX_TEXT).trim().optional(),
  cargo: z.string().max(MAX_TEXT).trim().optional(),
  telefone: z
    .string()
    .max(20, "Telefone inválido")
    .trim()
    .optional(),
  servico: z.string().max(100).trim().optional(),
  mensagem: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(MAX_MESSAGE, "Mensagem muito longa")
    .trim(),
  consentimento: z.literal(true, {
    error: "Consentimento é obrigatório",
  }),
  // UTMs — opcionais, capturados do URL
  utm_source: z.string().max(100).trim().optional(),
  utm_medium: z.string().max(100).trim().optional(),
  utm_campaign: z.string().max(100).trim().optional(),
  utm_content: z.string().max(100).trim().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
