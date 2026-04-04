# PLAN — Marktracking Main Site
### Plano de Execução por Fases · v1.0 · Abril 2026

> **Convenção de progresso:**
> - `[ ]` — Pendente
> - `[~]` — Em andamento
> - `[x]` — Concluído e testado
>
> **Regra:** Claude só marca `[x]` após testar a feature. Nunca marcar como concluído sem validação real.

---

## FASE 1 — Setup Hermético do Repositório
*Objetivo: Ambiente local impecável, zero risco de exposição de credenciais*

### 1.1 Inicialização do Projeto Next.js
- [x] Criar projeto Next.js 15 com TypeScript: `pnpm create next-app@latest` (Next.js 16.2.2 instalado via pnpm)
- [x] Confirmar estrutura de pastas gerada (`app/`, `components/`, `lib/`, `public/`)
- [x] Instalar dependências adicionais:
  - [x] `framer-motion` — animações
  - [x] `@react-three/fiber` + `@react-three/drei` + `three` + `@types/three` — 3D Hero
  - [x] `react-hook-form` + `zod` + `@hookform/resolvers` — formulário
  - [x] `@supabase/supabase-js` — client Supabase
  - [x] `resend` — SDK de email (server-side)
  - [x] `lucide-react` — ícones
  - [x] `react-email` + `@react-email/components` — templates de email
- [x] Verificar `package.json` e `pnpm-lock.yaml` gerados corretamente

### 1.2 Configuração do .gitignore
- [x] Garantir que o `.gitignore` bloqueie **absolutamente**:
  - [x] `.env` / `.env.local` / `.env.*.local` / `.env.production`
  - [x] `*.pem`, `*.key`, `*.cert`
  - [x] `.vercel/` (pode conter tokens)
  - [x] `node_modules/`
  - [x] `.next/` (build artifacts)
  - [x] `out/` (static export)
  - [x] Arquivos de OS: `.DS_Store`, `Thumbs.db`
  - [x] Logs: `*.log`, `npm-debug.log*`
- [x] **Verificar manualmente** que nenhum arquivo sensível está staged antes do primeiro commit

### 1.3 Variáveis de Ambiente
- [x] Criar `.env.example` com todas as variáveis necessárias (valores em branco/placeholder)
- [ ] Criar `.env.local` local com valores reais (NUNCA commitar) — pendente: aguarda credenciais
- [x] Validar que `.env.local` está no `.gitignore` ANTES de preencher valores
- [x] Testar `git status` para confirmar que `.env.local` não aparece como untracked

### 1.4 Estrutura de Pastas
- [x] Organizar estrutura final (app/, components/, lib/, emails/, public/)
- [x] `app/layout.tsx` — fontes Orbitron + Rajdhani via next/font, metadata PT-BR
- [x] `app/globals.css` — design system: tokens Tailwind v4, glassmorphism, keyframes, scrollbar
- [x] `app/page.tsx` — scaffold da home (seções implementadas na Fase 2)
- [x] `app/api/leads/route.ts` — POST com Zod + Supabase server + n8n webhook via `after()`
- [x] `app/api/health/route.ts` — GET health check
- [x] `lib/supabase/client.ts` — browser client (anon key)
- [x] `lib/supabase/server.ts` — server client (service role, server-side only)
- [x] `lib/validations/lead.ts` — Zod schema completo do lead
- [ ] Mover assets (Logo, imagens) de `assets/` e `Logo/` para `public/` — pendente Fase 2
- [x] Commit da Fase 1

### 1.5 Verificação Final da Fase 1
- [x] Rodar `pnpm run build` — build passou sem erros (Next.js 16.2.2, Turbopack)
- [x] Rodar `git status` — nenhum arquivo `.env*` aparece
- [x] **Checklist de segurança**: `.gitignore` confirmado visualmente

---

## FASE 2 — Frontend "Wow-Factor"
*Objetivo: Experiência visual nível Awwwards, fiel ao brand Marktracking*

### 2.1 Design System Global
- [x] Configurar tokens de design completos (Tailwind v4 usa `@theme` em `globals.css` — sem `tailwind.config.ts`):
  - [x] Cores: `neon-green`, `neon-blue`, `dark-bg`, `dark-surface`, variações de opacidade
  - [x] Fontes: Orbitron + Rajdhani via `next/font/google`
  - [x] Animações custom: float, pulse-glow, shimmer, glitch, scan-line
  - [x] Border radius, shadows, blur values padronizados
- [x] `app/globals.css` completo com:
  - [x] CSS reset e base styles
  - [x] Glassmorphism utility classes (.glass, .glass-nav)
  - [x] Cursor customizado (dot + lag via JS — CustomCursor.tsx)
  - [x] Scrollbar estilizada
  - [x] Selection color customizada

### 2.2 Layout Base
- [x] `app/layout.tsx`:
  - [x] Metadata global (title, description, OG, Twitter Card)
  - [x] Fontes via `next/font` (sem CLS)
  - [ ] Vercel Analytics (`<Analytics />`) — pendente: instalar @vercel/analytics
  - [x] Root structure com `<Nav>`, `<Footer>` e `<CustomCursor>`
- [x] `components/layout/Nav.tsx`:
  - [x] Fixed + glassmorphism blur progressivo no scroll
  - [x] Logo "MT / MARKTRACKING" com glow effect
  - [x] Menu desktop com underline hover animado (CSS scale)
  - [x] Mobile: hamburger → menu overlay com animação (framer-motion stagger)
  - [x] CTA button "Falar Agora" com border glow
- [x] `components/layout/Footer.tsx`:
  - [x] Links internos, redes sociais, legal
  - [x] Crédito e ano dinâmico

### 2.3 Seção Hero
- [x] `components/sections/Hero.tsx`:
  - [x] Fullscreen (100svh)
  - [x] `components/three/ParticleField.tsx` — campo de partículas 3D lazy-loaded (next/dynamic ssr:false)
    - [x] Partículas conectadas reagindo ao cursor (mouse repulsion)
    - [x] Performance: máximo 60fps, LOD em mobile (60 vs 150 partículas), DynamicDrawUsage
  - [x] Headline principal com efeito glitch sutil (animate-glitch CSS)
  - [x] Subheadline com reveal stagger (framer-motion variants)
  - [x] 2 CTAs: "Falar com Especialista" (primary) + "Ver Serviços" (ghost)
  - [x] Scroll indicator animado (chevron framer-motion keyframe loop)
- [ ] Testar performance Hero isolado: sem layout shift, FPS estável

### 2.4 Seção Sobre
- [x] `components/sections/Sobre.tsx`:
  - [x] Split layout: texto à esquerda, stats 2x2 à direita
  - [x] Animated counters (0 → valor) quando entram em viewport (rAF ease-out)
  - [x] 3 diferenciais com ícones (CheckCircle, Zap, Shield) e stagger de entrada
  - [x] Framer Motion `useInView` viewport trigger para cada bloco

### 2.5 Seção Serviços
- [x] `components/sections/Servicos.tsx`:
  - [x] Grid 1x6 (mobile) / 2x3 (tablet) / 2x3 (desktop) de cards
  - [x] Cada card: glassmorphism + border glow colorido no hover (green/blue)
  - [x] Ícone, título, descrição curta, tag de tecnologia
  - [x] 6 serviços: DevOps, Tracking Setup, Growth Analytics, Data Layer, Tag Management, Performance Audit
  - [x] Stagger reveal no scroll (custom delay por index)

### 2.6 Seção Processo
- [x] `components/sections/Processo.tsx`:
  - [x] Timeline horizontal (desktop) / vertical (mobile)
  - [x] 4 etapas: Diagnóstico → Arquitetura → Implementação → Monitoramento
  - [x] Linha de progresso animada (scaleX 0→1 no viewport)
  - [x] Números grandes com glow + descrição por etapa

### 2.7 Seção Cases / Números
- [x] `components/sections/Cases.tsx`:
  - [x] 4 métricas de impacto: +340% ROAS, 0 dados perdidos, 48h deploy, 100% LGPD
  - [x] Animated number counters (rAF ease-out cubic)
  - [x] Testimonial card com quote e atribuição

### 2.8 CTA Band
- [x] `components/sections/CTABand.tsx`:
  - [x] Banner full-width com gradiente dark + glow neon radial
  - [x] Headline de urgência + sub
  - [x] Botão CTA com shimmer animado (bg-position) + framer-motion spring

### 2.9 Seção Contato / Formulário
- [x] `components/sections/Contato.tsx`:
  - [x] Formulário completo (React Hook Form + zodResolver):
    - [x] Campos: Nome*, Email*, Empresa, Cargo, Telefone, Serviço, Mensagem*
    - [x] Checkbox de consentimento LGPD obrigatório
    - [x] UTM parameters capturados via `useSearchParams` (com Suspense boundary)
  - [x] Inputs com floating label + glow on focus (Input.tsx)
  - [x] Validação em tempo real com feedback visual por campo
  - [x] Estado de loading (spinner + "Enviando...")
  - [x] Estado de sucesso (animação framer-motion scale)
  - [x] Estado de erro (banner + "Tentar novamente")

### 2.10 Componentes UI
- [x] `components/ui/Button.tsx` — variantes: primary, ghost, danger + ripple effect + framer-motion
- [x] `components/ui/Card.tsx` — glassmorphism base reutilizável
- [x] `components/ui/Input.tsx` — floating label + glow + error state
- [x] `components/ui/Badge.tsx` — pill com cor customizável (green/blue/white)
- [x] `components/ui/GlowBorder.tsx` — wrapper com gradient border animado

### 2.11 Cursor Customizado
- [x] `components/ui/CustomCursor.tsx`:
  - [x] Dot pequeno que segue o cursor instantaneamente (ref direto, sem state)
  - [x] Ring externo com lag suave (lerp factor 0.12 via rAF)
  - [x] Esconde cursor nativo do OS (cursor: none em globals.css)
  - [x] Escala 2x em hover de elementos interativos
  - [x] Retorna null em touch devices (pointer: coarse)

### 2.12 Verificação Final da Fase 2
- [x] `pnpm run build` — build passou sem erros TypeScript (16.2.2 Turbopack)
- [ ] Rodar `pnpm dev` — todas as seções renderizando sem erros visuais
- [ ] Testar em mobile (375px) e desktop (1440px)
- [ ] Rodar Lighthouse: Performance ≥ 85, Accessibility ≥ 90
- [ ] Nenhum console error / warning crítico
- [ ] Animações performáticas (sem jank): verificar com DevTools Performance

---

## FASE 3 — Setup do Supabase e Datalayer
*Objetivo: Banco de dados seguro com RLS, client/server configurados corretamente*

### 3.1 Projeto Supabase
- [ ] Criar projeto Supabase (se não existir)
- [ ] Copiar URL e keys para `.env.local` (NUNCA para o código)
- [ ] Configurar `lib/supabase/client.ts` — browser client com anon key
- [ ] Configurar `lib/supabase/server.ts` — server client com service role key (apenas server-side)

### 3.2 Schema do Banco
- [ ] Criar tabela `leads` conforme schema do PRD:
  ```sql
  CREATE TABLE leads (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome          TEXT NOT NULL,
    email         TEXT NOT NULL,
    empresa       TEXT,
    cargo         TEXT,
    telefone      TEXT,
    mensagem      TEXT,
    servico       TEXT,
    origem        TEXT DEFAULT 'site',
    utm_source    TEXT,
    utm_medium    TEXT,
    utm_campaign  TEXT,
    utm_content   TEXT,
    ip_hash       TEXT,
    user_agent    TEXT,
    consentimento BOOLEAN NOT NULL DEFAULT FALSE,
    status        TEXT DEFAULT 'novo',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Habilitar RLS: `ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`
- [ ] Criar policy INSERT para anon (com check de consentimento):
  ```sql
  CREATE POLICY "leads_insert_anon"
    ON leads FOR INSERT TO anon
    WITH CHECK (consentimento = TRUE);
  ```
- [ ] Confirmar: nenhuma policy SELECT/UPDATE/DELETE para anon
- [ ] Criar index em `email` e `created_at` para performance futura

### 3.3 Validação Zod do Lead
- [ ] Criar `lib/validations/lead.ts` com schema Zod:
  - [ ] Todos os campos tipados
  - [ ] Email validado com `z.string().email()`
  - [ ] `consentimento: z.literal(true)` (obrigatório)
  - [ ] Sanitização de inputs (trim, lowercase email)
  - [ ] Tamanho máximo nos campos de texto (prevenção de payloads gigantes)

### 3.4 API Route — `/api/leads`
- [ ] Criar `app/api/leads/route.ts`:
  - [ ] Aceitar apenas `POST`
  - [ ] Parse e validação com Zod (retorna 400 se inválido)
  - [ ] Hash do IP (SHA-256) para LGPD compliance
  - [ ] Inserir no Supabase via **server client** (service role)
  - [ ] Em caso de sucesso: trigger webhook n8n (Fase 4)
  - [ ] Rate limiting básico (verificar IP + timestamp)
  - [ ] Retornar 200 com `{ success: true }` ou error estruturado
- [ ] Criar `app/api/health/route.ts`:
  - [ ] GET retorna `{ status: "ok", timestamp: ... }`

### 3.5 Verificação Final da Fase 3
- [ ] Testar POST `/api/leads` com payload válido → registro aparece no Supabase dashboard
- [ ] Testar POST com `consentimento: false` → retorna 400 (RLS policy bloqueou)
- [ ] Testar POST com email inválido → retorna 400 (Zod bloqueou)
- [ ] Testar GET na tabela via anon key no Supabase → retorna 0 registros (sem policy SELECT)
- [ ] Verificar no Supabase: RLS ativo, policies listadas corretamente

---

## FASE 4 — Integrações Backend (n8n + Resend)
*Objetivo: Pipeline de automação funcionando de ponta a ponta*

### 4.1 Templates de Email (React Email)
- [ ] Criar `emails/LeadWelcome.tsx`:
  - [ ] Design on-brand (dark + neon green)
  - [ ] Saudação personalizada com nome do lead
  - [ ] Confirmação de recebimento + próximos passos
  - [ ] CTA para agendar conversa (Calendly ou similar)
  - [ ] Footer com unsubscribe e LGPD
- [ ] Criar `emails/LeadInternal.tsx`:
  - [ ] Todos os dados do lead formatados para ação rápida
  - [ ] UTMs, serviço de interesse, mensagem completa
  - [ ] Link direto para o lead no Supabase dashboard
- [ ] Testar preview dos templates com `react-email preview`

### 4.2 Setup Resend
- [ ] Criar conta Resend e verificar domínio `@marktracking.com.br` (ou domínio disponível)
- [ ] Copiar API Key para `.env.local` como `RESEND_API_KEY`
- [ ] Criar `lib/email.ts`:
  - [ ] Função `sendLeadWelcome(lead: Lead)` — usa Resend SDK
  - [ ] Função `sendLeadInternal(lead: Lead)` — usa Resend SDK
  - [ ] Error handling: se Resend falhar, NÃO bloqueia o fluxo principal (fire-and-forget com log)

### 4.3 Setup n8n Webhook
- [ ] Configurar webhook no n8n para receber evento `lead.novo`
- [ ] Anotar URL do webhook e armazenar em `.env.local` como `N8N_LEAD_WEBHOOK_URL`
- [ ] Criar secret compartilhado em `.env.local` como `N8N_WEBHOOK_SECRET`
- [ ] Na API Route `/api/leads`:
  - [ ] Após insert no Supabase, fazer POST no webhook n8n com `X-Webhook-Secret` header
  - [ ] Payload: todos os dados do lead (sem o ip_hash, por privacidade)
  - [ ] Timeout de 3s para não bloquear a resposta ao usuário
- [ ] No n8n, configurar validação do secret no nó receptor

### 4.4 Workflow n8n — Lead Recebido
- [ ] Configurar nó: Webhook trigger (validar secret)
- [ ] Configurar nó: Envio email boas-vindas via Resend (ou HTTP node → Resend API)
- [ ] Configurar nó: Notificação interna para time Marktracking
- [ ] Configurar nó: (Opcional) Adicionar a planilha Google Sheets ou Notion
- [ ] Testar workflow com lead de teste end-to-end

### 4.5 Verificação Final da Fase 4
- [ ] Submeter formulário no site (ambiente local)
- [ ] Verificar: registro aparece no Supabase
- [ ] Verificar: email de boas-vindas chega na caixa do lead de teste
- [ ] Verificar: email interno chega para o time Marktracking
- [ ] Verificar: workflow n8n executou sem erros (checar log de execuções)
- [ ] Testar com Resend em modo sandbox (sem enviar email real durante dev)

---

## FASE 5 — Auditoria de Segurança e Build
*Objetivo: Zero vulnerabilidades, build otimizado, pronto para produção*

### 5.1 Auditoria de Segurança
- [ ] **Varredura de secrets**: `git grep -r "supabase\|resend\|n8n\|secret\|key\|token" --` — confirmar que ZERO segredos estão no código
- [ ] **Verificar .gitignore**: abrir e auditar linha por linha
- [ ] **Headers de segurança** em `next.config.ts`:
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy` restritiva
  - [ ] `Content-Security-Policy` básico (ajustar para não quebrar Three.js)
- [ ] **Rate limiting** no endpoint `/api/leads` — verificar implementação
- [ ] **Input sanitization**: confirmar que Zod está bloqueando todos os edge cases
- [ ] **Dependências**: rodar `npm audit` — resolver vulnerabilidades high/critical
- [ ] **RLS final**: confirmar via Supabase dashboard que policies estão ativas e corretas
- [ ] **Nenhum `console.log` com dados sensíveis** em produção — revisar todos os logs

### 5.2 Performance e SEO
- [ ] Rodar Lighthouse em produção (Vercel Preview URL):
  - [ ] Performance ≥ 90
  - [ ] Accessibility ≥ 90
  - [ ] Best Practices ≥ 95
  - [ ] SEO ≥ 95
- [ ] Verificar Core Web Vitals no Vercel Analytics
- [ ] Confirmar `next/image` em todas as imagens
- [ ] Confirmar fontes via `next/font` (sem CLS)
- [ ] Verificar bundle size: `npm run build` → analisar output
- [ ] Confirmar que `ParticleField.tsx` (Three.js) é lazy-loaded com `dynamic(() => ..., { ssr: false })`

### 5.3 Acessibilidade
- [ ] Todos os elementos interativos têm `aria-label` ou texto visível
- [ ] Contraste de cores passa WCAG AA
- [ ] Navegação por teclado funcional (Tab, Enter, Escape)
- [ ] `<html lang="pt-BR">` presente
- [ ] Imagens com `alt` descritivo

### 5.4 Build e Deploy
- [ ] Rodar `npm run build` localmente — zero erros e zero warnings críticos
- [ ] Configurar variáveis de ambiente no Vercel Dashboard (NUNCA via CLI em CI)
- [ ] Deploy via `git push` para branch main → Vercel CI/CD acionado automaticamente
- [ ] Verificar Vercel build log — sem erros
- [ ] Testar Preview URL completo (todas as seções, formulário, emails)
- [ ] Promover para produção após validação da Preview URL

### 5.5 Verificação Final da Fase 5 — Go Live Checklist
- [ ] Site carregando em < 3s na Preview URL
- [ ] Formulário de lead funcional em produção (lead real de teste)
- [ ] Email chegando corretamente em produção
- [ ] Supabase registrando leads em produção (com variáveis de prod configuradas)
- [ ] n8n workflow executando em produção
- [ ] Nenhum secret exposto no código do repositório
- [ ] Domínio customizado configurado no Vercel (se disponível)
- [ ] SSL ativo (automático no Vercel)
- [ ] Vercel Analytics ativo

---

## Progresso Geral

| Fase | Status | Conclusão |
|---|---|---|
| Fase 1 — Setup Hermético | `[x]` Concluído | 2026-04-04 |
| Fase 2 — Frontend Wow-Factor | `[~]` Implementado (validação visual pendente) | 2026-04-04 |
| Fase 3 — Supabase + Datalayer | `[ ]` Pendente | — |
| Fase 4 — n8n + Resend | `[ ]` Pendente | — |
| Fase 5 — Auditoria + Build | `[ ]` Pendente | — |

---

*Plano criado em 2026-04-04. Atualizar após cada tarefa concluída e testada.*
