import { z } from "zod";

const MAX_TEXT = 500;
const MAX_MESSAGE = 2000;

// ── Phone validation for Brazil ────────────────────────────────────────────
// Accepts formats: (11) 99999-9999, 11999999999, +55 11 99999-9999, etc.
const phoneRegex =
  /^(?:(?:\+|00)?55\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;

// ── Honeypot field — invisible to humans, bots will fill it ────────────────
// This field should be hidden via CSS and left empty by real users
const honeypotSchema = z
  .string()
  .max(0, "Invalid submission")
  .optional()
  .or(z.literal(""));

export const leadSchema = z.object({
  // Honeypot — must be empty
  website: honeypotSchema,

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

  empresa: z.string().max(MAX_TEXT).trim().optional().or(z.literal("")),

  cargo: z.string().max(MAX_TEXT).trim().optional().or(z.literal("")),

  telefone: z
    .string()
    .max(20, "Telefone inválido")
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const digits = val.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 13;
      },
      { message: "Telefone deve ter entre 10 e 13 dígitos" }
    ),

  servico: z.string().max(100).trim().optional().or(z.literal("")),

  mensagem: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(MAX_MESSAGE, "Mensagem muito longa")
    .trim(),

  consentimento: z.literal(true, {
    error: "Consentimento é obrigatório",
  }),

  // UTMs — opcionais, capturados do URL
  utm_source: z.string().max(100).trim().optional().or(z.literal("")),
  utm_medium: z.string().max(100).trim().optional().or(z.literal("")),
  utm_campaign: z.string().max(100).trim().optional().or(z.literal("")),
  utm_content: z.string().max(100).trim().optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
