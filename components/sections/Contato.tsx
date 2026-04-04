"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, Shield, ChevronDown } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SubmitState = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Shared input class builder
// ---------------------------------------------------------------------------

function inputClass(hasError: boolean): string {
  return [
    "w-full bg-dark-elevated border rounded-lg px-4 py-3",
    "text-white font-body text-base placeholder:text-white/30",
    "outline-none transition-all duration-200",
    "focus:border-neon-green/50 focus:[box-shadow:0_0_0_2px_rgba(0,255,157,0.1)]",
    hasError ? "border-red-500/50" : "border-white/10",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Inner form component — needs useSearchParams, must live inside Suspense
// ---------------------------------------------------------------------------

function ContatoForm() {
  const searchParams = useSearchParams();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [servicoSelected, setServicoSelected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
  });

  // Capture UTM params from URL into hidden fields
  useEffect(() => {
    setValue("utm_source", searchParams.get("utm_source") ?? undefined);
    setValue("utm_medium", searchParams.get("utm_medium") ?? undefined);
    setValue("utm_campaign", searchParams.get("utm_campaign") ?? undefined);
    setValue("utm_content", searchParams.get("utm_content") ?? undefined);
  }, [searchParams, setValue]);

  const onSubmit = async (data: LeadInput) => {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitState("success");
        reset();
      } else {
        const body = (await res.json()) as { error?: string };
        setErrorMessage(body.error ?? "Erro ao enviar. Tente novamente.");
        setSubmitState("error");
      }
    } catch {
      setErrorMessage("Erro de conexão. Verifique sua internet.");
      setSubmitState("error");
    }
  };

  // ---- Success state ----
  if (submitState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[480px]"
      >
        <CheckCircle className="text-neon-green" size={64} strokeWidth={1.5} />
        <h3 className="font-heading text-2xl text-white mt-2">
          Mensagem enviada!
        </h3>
        <p className="text-white/60 font-body text-lg max-w-xs">
          Nossa equipe entrará em contato em até 24h.
        </p>
      </motion.div>
    );
  }

  // ---- Form ----
  return (
    <div className="glass p-8 lg:p-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Row 1: Nome | Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("nome")}
              type="text"
              placeholder="Nome *"
              autoComplete="name"
              className={inputClass(!!errors.nome)}
            />
            {errors.nome && (
              <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="E-mail *"
              autoComplete="email"
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Empresa | Cargo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("empresa")}
              type="text"
              placeholder="Empresa"
              autoComplete="organization"
              className={inputClass(!!errors.empresa)}
            />
            {errors.empresa && (
              <p className="text-red-400 text-sm mt-1">
                {errors.empresa.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("cargo")}
              type="text"
              placeholder="Cargo"
              autoComplete="organization-title"
              className={inputClass(!!errors.cargo)}
            />
            {errors.cargo && (
              <p className="text-red-400 text-sm mt-1">
                {errors.cargo.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Telefone | Serviço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("telefone")}
              type="tel"
              placeholder="Telefone"
              autoComplete="tel"
              className={inputClass(!!errors.telefone)}
            />
            {errors.telefone && (
              <p className="text-red-400 text-sm mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>

          <div className="relative">
            <select
              {...register("servico")}
              defaultValue=""
              onChange={(e) => {
                register("servico").onChange(e);
                setServicoSelected(e.target.value !== "");
              }}
              className={[
                inputClass(!!errors.servico),
                "appearance-none cursor-pointer",
                servicoSelected ? "text-white" : "text-white/30",
              ].join(" ")}
            >
              <option value="" disabled className="text-white/30 bg-dark-elevated">
                Serviço de interesse
              </option>
              <option value="DevOps & Infra" className="text-white bg-dark-elevated">
                DevOps &amp; Infra
              </option>
              <option value="Tracking Setup" className="text-white bg-dark-elevated">
                Tracking Setup
              </option>
              <option value="Growth Analytics" className="text-white bg-dark-elevated">
                Growth Analytics
              </option>
              <option value="Data Layer" className="text-white bg-dark-elevated">
                Data Layer
              </option>
              <option value="Tag Management" className="text-white bg-dark-elevated">
                Tag Management
              </option>
              <option value="Performance Audit" className="text-white bg-dark-elevated">
                Performance Audit
              </option>
              <option value="Outro" className="text-white bg-dark-elevated">
                Outro
              </option>
            </select>
            {/* Custom dropdown arrow */}
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
            {errors.servico && (
              <p className="text-red-400 text-sm mt-1">
                {errors.servico.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 4: Mensagem */}
        <div>
          <textarea
            {...register("mensagem")}
            placeholder="Mensagem * (mín. 10 caracteres)"
            rows={5}
            className={[inputClass(!!errors.mensagem), "min-h-[120px] resize-y"].join(
              " "
            )}
          />
          {errors.mensagem && (
            <p className="text-red-400 text-sm mt-1">
              {errors.mensagem.message}
            </p>
          )}
        </div>

        {/* Row 5: LGPD Consent */}
        <div>
          <div className="flex items-start gap-3">
            <input
              {...register("consentimento")}
              type="checkbox"
              id="consentimento"
              className="mt-1 accent-neon-green cursor-pointer"
            />
            <label
              htmlFor="consentimento"
              className="text-white/60 text-sm font-body leading-relaxed cursor-pointer"
            >
              Concordo com a{" "}
              <a
                href="/legal"
                className="text-neon-green hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </a>{" "}
              e autorizo o tratamento dos meus dados para contato comercial,
              conforme a LGPD.
            </label>
          </div>
          {errors.consentimento && (
            <p className="text-red-400 text-sm mt-1">
              Consentimento é obrigatório
            </p>
          )}
        </div>

        {/* Hidden UTM fields — values set via setValue in useEffect */}
        <input type="hidden" {...register("utm_source")} />
        <input type="hidden" {...register("utm_medium")} />
        <input type="hidden" {...register("utm_campaign")} />
        <input type="hidden" {...register("utm_content")} />

        {/* Error banner */}
        {submitState === "error" && (
          <div className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠ {errorMessage}</span>
            <button
              type="button"
              onClick={() => setSubmitState("idle")}
              className="underline hover:text-red-300 transition-colors ml-1"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || submitState === "loading"}
          className={[
            "w-full bg-neon-green text-black font-heading font-bold py-4 rounded-lg",
            "transition-all duration-200",
            "hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,255,157,0.4)]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2",
          ].join(" ")}
        >
          {submitState === "loading" || isSubmitting ? (
            <>
              {/* Simple CSS spinner */}
              <span
                className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"
                aria-hidden="true"
              />
              Enviando...
            </>
          ) : (
            "Enviar Mensagem →"
          )}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact info items
// ---------------------------------------------------------------------------

const contactItems = [
  {
    icon: CheckCircle,
    text: "Resposta garantida em 24h",
  },
  {
    icon: MessageSquare,
    text: "Diagnóstico gratuito incluído",
  },
  {
    icon: Shield,
    text: "Seus dados protegidos por LGPD",
  },
] as const;

// ---------------------------------------------------------------------------
// Default export — public section wrapper
// ---------------------------------------------------------------------------

export default function ContatoSection() {
  return (
    <section
      id="contato"
      className="bg-dark-surface py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ---- Left column: info ---- */}
          <div className="flex flex-col gap-8">
            {/* Label */}
            <span className="text-neon-green/60 font-heading text-xs tracking-[0.3em] uppercase">
              CONTATO
            </span>

            {/* Heading */}
            <div className="-mt-4">
              <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight">
                Vamos conversar.
              </h2>
              <p className="text-white/60 font-body text-xl mt-4 leading-relaxed">
                Conte sobre seu projeto e receba um diagnóstico gratuito de
                tracking em até 24h.
              </p>
            </div>

            {/* Contact items */}
            <ul className="flex flex-col gap-4">
              {contactItems.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className="text-neon-green shrink-0"
                    strokeWidth={1.75}
                  />
                  <span className="text-white/70 font-body text-base">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Right column: form ---- */}
          <div>
            <Suspense
              fallback={
                <div className="glass p-8 lg:p-10 min-h-[480px] flex items-center justify-center">
                  <span
                    className="inline-block w-8 h-8 border-2 border-neon-green/20 border-t-neon-green rounded-full animate-spin"
                    aria-label="Carregando formulário..."
                  />
                </div>
              }
            >
              <ContatoForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
