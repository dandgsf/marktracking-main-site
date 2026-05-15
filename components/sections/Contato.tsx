"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import MagneticButton from "@/components/ui/MagneticButton";
import { CrystalPrism } from "@/components/three";

type SubmitState = "idle" | "loading" | "success" | "error";

// ─── Floating Label Input ───────────────────────────────────────────────────
function FloatingInput({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="group relative">
        {children}
        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none transition-all duration-300 group-focus-within:top-2 group-focus-within:text-[10px] group-focus-within:text-accent group-focus-within:translate-y-0 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:translate-y-0">
          {label}
          {required && <span className="text-accent ml-0.5">*</span>}
        </label>
      </div>
      {error && (
        <p className="text-red-400/80 text-xs mt-1.5 ml-1 animate-pulse">{error}</p>
      )}
    </div>
  );
}

function FloatingTextarea({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="group relative">
        {children}
        <label className="absolute left-4 top-4 text-sm text-text-muted pointer-events-none transition-all duration-300 group-focus-within:top-2 group-focus-within:text-[10px] group-focus-within:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px]">
          {label}
          {required && <span className="text-accent ml-0.5">*</span>}
        </label>
      </div>
      {error && (
        <p className="text-red-400/80 text-xs mt-1.5 ml-1 animate-pulse">{error}</p>
      )}
    </div>
  );
}

// ─── Form Skeleton ──────────────────────────────────────────────────────────
function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
        <div className="h-14 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
      <div className="h-36 bg-white/[0.03] rounded-2xl animate-pulse" />
      <div className="h-14 bg-white/[0.05] rounded-2xl animate-pulse" />
    </div>
  );
}

// ─── Main Form ──────────────────────────────────────────────────────────────
function ContatoForm() {
  const searchParams = useSearchParams();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
  });

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

  if (submitState === "success") {
    return (
      <div className="relative h-full min-h-[560px] rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-12 flex flex-col items-center justify-center text-center gap-6">
        {/* Animated success ring */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="text-accent" size={32} strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping" />
        </div>
        <div>
          <h3 className="text-2xl font-medium text-text-primary mb-2">
            Mensagem enviada
          </h3>
          <p className="text-sm text-text-secondary max-w-xs mx-auto">
            Nossa equipe de especialistas entrará em contato em até 24h.
          </p>
        </div>
      </div>
    );
  }

  const inputBaseClass = [
    "peer w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 pt-5 pb-2.5",
    "text-text-primary text-sm placeholder:text-transparent",
    "outline-none transition-all duration-300",
    "focus:border-accent/30 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent/10",
    "hover:border-white/[0.12]",
  ].join(" ");

  return (
    <div className="relative h-full rounded-[2.5rem] border border-white/[0.06] bg-white/[0.02] p-8 md:p-12">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Row 1: Nome | Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FloatingInput label="Nome" error={errors.nome?.message} required>
            <input
              {...register("nome")}
              type="text"
              placeholder="Nome"
              autoComplete="name"
              className={inputBaseClass}
            />
          </FloatingInput>
          <FloatingInput label="E-mail" error={errors.email?.message} required>
            <input
              {...register("email")}
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              className={inputBaseClass}
            />
          </FloatingInput>
        </div>

        {/* Row 2: Empresa | Cargo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FloatingInput label="Empresa">
            <input
              {...register("empresa")}
              type="text"
              placeholder="Empresa"
              autoComplete="organization"
              className={inputBaseClass}
            />
          </FloatingInput>
          <FloatingInput label="Cargo">
            <input
              {...register("cargo")}
              type="text"
              placeholder="Cargo"
              autoComplete="organization-title"
              className={inputBaseClass}
            />
          </FloatingInput>
        </div>

        {/* Row 3: Telefone | Serviço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FloatingInput label="Telefone" error={errors.telefone?.message}>
            <input
              {...register("telefone")}
              type="tel"
              placeholder="Telefone"
              autoComplete="tel"
              className={inputBaseClass}
            />
          </FloatingInput>
          <FloatingInput label="Serviço de interesse">
            <select
              {...register("servico")}
              defaultValue=""
              className={[inputBaseClass, "appearance-none cursor-pointer text-text-muted pt-5 pb-2.5"].join(" ")}
            >
              <option value="" disabled className="bg-bg-elevated">
                Selecione...
              </option>
              <option value="DevOps & Infra" className="bg-bg-elevated text-text-primary">DevOps &amp; Infra</option>
              <option value="Tracking Setup" className="bg-bg-elevated text-text-primary">Tracking Setup</option>
              <option value="Growth Analytics" className="bg-bg-elevated text-text-primary">Growth Analytics</option>
              <option value="Data Layer" className="bg-bg-elevated text-text-primary">Data Layer</option>
              <option value="Tag Management" className="bg-bg-elevated text-text-primary">Tag Management</option>
              <option value="Performance Audit" className="bg-bg-elevated text-text-primary">Performance Audit</option>
              <option value="Outro" className="bg-bg-elevated text-text-primary">Outro</option>
            </select>
          </FloatingInput>
        </div>

        {/* Row 4: Mensagem */}
        <FloatingTextarea label="Mensagem" error={errors.mensagem?.message} required>
          <textarea
            {...register("mensagem")}
            placeholder="Mensagem"
            rows={5}
            className={[inputBaseClass, "min-h-[140px] resize-y pt-5 pb-2.5"].join(" ")}
          />
        </FloatingTextarea>

        {/* Row 5: LGPD Consent */}
        <div className="pt-2">
          <div className="flex items-start gap-3">
            <input
              {...register("consentimento")}
              type="checkbox"
              id="consentimento"
              className="mt-1 accent-accent cursor-pointer w-4 h-4 rounded border-white/[0.08]"
            />
            <label
              htmlFor="consentimento"
              className="text-xs text-text-secondary leading-relaxed cursor-pointer"
            >
              Concordo com a{" "}
              <a
                href="/legal"
                className="text-text-primary hover:underline"
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
            <p className="text-red-400/80 text-xs mt-1.5 ml-7">Consentimento é obrigatório</p>
          )}
        </div>

        {/* Honeypot field — invisible to humans */}
        <div className="absolute opacity-0 pointer-events-none -z-10" aria-hidden="true">
          <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </div>

        {/* Hidden UTM fields */}
        <input type="hidden" {...register("utm_source")} />
        <input type="hidden" {...register("utm_medium")} />
        <input type="hidden" {...register("utm_campaign")} />
        <input type="hidden" {...register("utm_content")} />

        {/* Error banner */}
        {submitState === "error" && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
            <span className="text-red-400/80 text-sm">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setSubmitState("idle")}
              className="text-red-400 hover:text-red-300 transition-colors text-sm underline ml-auto"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Submit button */}
        <MagneticButton
          className="w-full group relative px-8 py-5 text-sm font-medium text-bg bg-text-primary rounded-2xl transition-all duration-300 hover:bg-text-secondary"
        >
          <span className="inline-flex items-center justify-center gap-3 w-full">
            {submitState === "loading" || isSubmitting ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              <>
                <span>Enviar mensagem</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </MagneticButton>
      </form>
    </div>
  );
}

const contactItems = [
  { icon: CheckCircle, text: "Resposta garantida em 24h" },
  { icon: MessageSquare, text: "Diagnóstico gratuito incluído" },
  { icon: Shield, text: "Seus dados protegidos por LGPD" },
] as const;

export default function ContatoSection() {
  return (
    <section id="contato" className="py-32 md:py-48 relative">
      {/* 3D Crystal Prism — Background */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[90%] opacity-50">
        <CrystalPrism />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header — centered, dramatic */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-caption mb-6 block">Contato</span>
          <h2 className="text-headline font-medium text-text-primary mb-4">
            Vamos conversar.
          </h2>
          <p className="text-body max-w-md mx-auto">
            Conte sobre seu projeto e receba um diagnóstico gratuito de
            tracking em até 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left column: info + trust signals */}
          <div className="lg:col-span-2 flex flex-col gap-10 lg:sticky lg:top-32">
            <div className="space-y-6">
              {contactItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center transition-colors group-hover:border-accent/20">
                    <Icon size={18} className="text-text-tertiary group-hover:text-accent transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-text-secondary">{text}</span>
                </div>
              ))}
            </div>

            {/* Decorative element */}
            <div className="hidden lg:block mt-8 p-6 rounded-[2rem] border border-white/[0.06] bg-white/[0.02]">
              <p className="text-xs text-text-muted leading-relaxed">
                &ldquo;Em 48h identificamos que 40% dos eventos de conversão não estavam sendo capturados. 
                Resultado: +340% de visibilidade no funil.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-accent">MT</span>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Equipe Marktracking</p>
                  <p className="text-[10px] text-text-muted">Case real — E-commerce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: form */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="relative h-full rounded-[2.5rem] border border-white/[0.06] bg-white/[0.02] p-8 md:p-12 min-h-[560px]">
                  <FormSkeleton />
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
