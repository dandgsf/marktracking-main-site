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
- [ ] Criar projeto Next.js 15 com TypeScript: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- [ ] Confirmar estrutura de pastas gerada (`app/`, `components/`, `lib/`, `public/`)
- [ ] Instalar dependências adicionais:
  - [ ] `framer-motion` — animações
  - [ ] `@react-three/fiber` + `@react-three/drei` + `three` — 3D Hero
  - [ ] `react-hook-form` + `zod` + `@hookform/resolvers` — formulário
  - [ ] `@supabase/supabase-js` — client Supabase
  - [ ] `resend` — SDK de email (server-side)
  - [ ] `lucide-react` — ícones
  - [ ] `react-email` + `@react-email/components` — templates de email
- [ ] Verificar `package.json` e `package-lock.json` gerados corretamente

### 1.2 Configuração do .gitignore
- [ ] Garantir que o `.gitignore` bloqueie **absolutamente**:
  - [ ] `.env` / `.env.local` / `.env.*.local` / `.env.production`
  - [ ] `*.pem`, `*.key`, `*.cert`
  - [ ] `.vercel/` (pode conter tokens)
  - [ ] `node_modules/`
  - [ ] `.next/` (build artifacts)
  - [ ] `out/` (static export)
  - [ ] Arquivos de OS: `.DS_Store`, `Thumbs.db`
  - [ ] Logs: `*.log`, `npm-debug.log*`
- [ ] **Verificar manualmente** que nenhum arquivo sensível está staged antes do primeiro commit

### 1.3 Variáveis de Ambiente
- [ ] Criar `.env.example` com todas as variáveis necessárias (valores em branco/placeholder):
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RESEND_API_KEY=
  N8N_WEBHOOK_SECRET=
  N8N_LEAD_WEBHOOK_URL=
  NEXT_PUBLIC_SITE_URL=
  ```
- [ ] Criar `.env.local` local com valores reais (NUNCA commitar)
- [ ] Validar que `.env.local` está no `.gitignore` ANTES de preencher valores
- [ ] Testar `git status` para confirmar que `.env.local` não aparece como untracked

### 1.4 Estrutura de Pastas
- [ ] Organizar estrutura final:
  ```
  app/
    layout.tsx          — Root layout (fontes, metadata global)
    page.tsx            — Home page
    legal/
      page.tsx          — Página legal (migrada do legal.html)
    api/
      leads/
        route.ts        — POST endpoint de captura de lead
      health/
        route.ts        — GET health check
  components/
    layout/
      Nav.tsx
      Footer.tsx
    sections/
      Hero.tsx
      Sobre.tsx
      Servicos.tsx
      Processo.tsx
      Cases.tsx
      CTABand.tsx
      Contato.tsx
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Badge.tsx
      GlowBorder.tsx
    three/
      ParticleField.tsx — Componente 3D isolado (lazy-loaded)
  lib/
    supabase/
      client.ts         — Supabase browser client
      server.ts         — Supabase server client (service role)
    validations/
      lead.ts           — Zod schema do lead
    utils.ts
  emails/
    LeadWelcome.tsx
    LeadInternal.tsx
  public/
    (assets migrados do site atual)
  ```
- [ ] Mover assets (Logo, imagens) de `assets/` e `Logo/` para `public/`
- [ ] Commit inicial limpo: `feat: scaffold Next.js 15 project structure`

### 1.5 Verificação Final da Fase 1
- [ ] Rodar `npm run dev` — aplicação sobe sem erros
- [ ] Rodar `git status` — nenhum arquivo `.env*` aparece
- [ ] Rodar `git log` — commit inicial registrado
- [ ] **Cheklist de segurança**: abrir `.gitignore` e confirmar visualmente cada linha crítica

---

## FASE 2 — Frontend "Wow-Factor"
*Objetivo: Experiência visual nível Awwwards, fiel ao brand Marktracking*

### 2.1 Design System Global
- [ ] Configurar `tailwind.config.ts` com tokens de design completos:
  - [ ] Cores: `neon-green`, `neon-blue`, `dark-bg`, `dark-surface`, variações de opacidade
  - [ ] Fontes: Orbitron + Rajdhani via `next/font/google`
  - [ ] Animações custom: float, pulse-glow, shimmer, scan-line
  - [ ] Border radius, shadows, blur values padronizados
- [ ] Criar `app/globals.css` com:
  - [ ] CSS reset e base styles
  - [ ] Glassmorphism utility classes
  - [ ] Cursor customizado (dot + lag via JS)
  - [ ] Scrollbar estilizada
  - [ ] Selection color customizada

### 2.2 Layout Base
- [ ] `app/layout.tsx`:
  - [ ] Metadata global (title, description, OG, Twitter Card)
  - [ ] Fontes via `next/font` (sem CLS)
  - [ ] Vercel Analytics (`<Analytics />`)
  - [ ] Root structure com `<Nav>` e `<Footer>`
- [ ] `components/layout/Nav.tsx`:
  - [ ] Fixed + glassmorphism blur progressivo no scroll
  - [ ] Logo com glow effect
  - [ ] Menu desktop com underline hover animado
  - [ ] Mobile: hamburger → menu overlay com animação
  - [ ] CTA button "Contato" com border glow
- [ ] `components/layout/Footer.tsx`:
  - [ ] Links internos, redes sociais, legal
  - [ ] Crédito e ano dinâmico

### 2.3 Seção Hero
- [ ] `components/sections/Hero.tsx`:
  - [ ] Fullscreen (100svh)
  - [ ] `components/three/ParticleField.tsx` — campo de partículas 3D lazy-loaded
    - [ ] Partículas conectadas reagindo ao cursor (mouse tracking)
    - [ ] Performance: máximo 60fps, LOD em mobile (menos partículas)
  - [ ] Headline principal com efeito glitch sutil (CSS animation)
  - [ ] Subheadline com typing effect ou reveal stagger
  - [ ] 2 CTAs: "Falar com especialista" (primary) + "Ver serviços" (ghost)
  - [ ] Scroll indicator animado (chevron bounce)
- [ ] Testar performance Hero isolado: sem layout shift, FPS estável

### 2.4 Seção Sobre
- [ ] `components/sections/Sobre.tsx`:
  - [ ] Split layout: texto à esquerda, stats/visual à direita
  - [ ] Animated counters (0 → valor) quando entram em viewport
  - [ ] 3-4 diferenciais com ícones e micro-animação de entrada
  - [ ] Framer Motion `viewport` trigger para cada bloco

### 2.5 Seção Serviços
- [ ] `components/sections/Servicos.tsx`:
  - [ ] Grid 2x3 (desktop) / 1x6 (mobile) de cards
  - [ ] Cada card: glassmorphism + conic-gradient border no hover
  - [ ] Ícone animado, título, descrição curta, tag de tecnologia
  - [ ] Serviços: DevOps, Tracking Setup, Growth Analytics, Data Layer, Tag Management, Performance Audit
  - [ ] Stagger reveal no scroll

### 2.6 Seção Processo
- [ ] `components/sections/Processo.tsx`:
  - [ ] Timeline horizontal (desktop) / vertical (mobile)
  - [ ] 4 etapas: Diagnóstico → Arquitetura → Implementação → Monitoramento
  - [ ] Linha de progresso animada conectando as etapas
  - [ ] Números grandes com glow + descrição por etapa

### 2.7 Seção Cases / Números
- [ ] `components/sections/Cases.tsx`:
  - [ ] 3-4 métricas de impacto (ex: "+340% ROAS", "0 dados perdidos")
  - [ ] Animated number counters
  - [ ] Mini-cases ou logos de clientes (se disponível)

### 2.8 CTA Band
- [ ] `components/sections/CTABand.tsx`:
  - [ ] Banner full-width com gradiente dark + acento neon
  - [ ] Headline de urgência + sub
  - [ ] Botão CTA com shimmer + ripple

### 2.9 Seção Contato / Formulário
- [ ] `components/sections/Contato.tsx`:
  - [ ] Formulário completo (React Hook Form + Zod):
    - [ ] Campos: Nome*, Email*, Empresa, Cargo, Telefone, Serviço de interesse, Mensagem*
    - [ ] Checkbox de consentimento LGPD obrigatório
    - [ ] UTM parameters capturados automaticamente do URL (via `useSearchParams`)
  - [ ] Inputs com floating label + glow on focus
  - [ ] Validação em tempo real com feedback visual
  - [ ] Estado de loading (spinner + texto animado)
  - [ ] Estado de sucesso (animação de confirmação)
  - [ ] Estado de erro (mensagem clara + retry)

### 2.10 Componentes UI
- [ ] `components/ui/Button.tsx` — variantes: primary, ghost, danger + ripple effect
- [ ] `components/ui/Card.tsx` — glassmorphism base reutilizável
- [ ] `components/ui/Input.tsx` — floating label + glow + error state
- [ ] `components/ui/Badge.tsx` — pill com cor customizável
- [ ] `components/ui/GlowBorder.tsx` — wrapper com border animado

### 2.11 Cursor Customizado
- [ ] `components/ui/CustomCursor.tsx`:
  - [ ] Dot pequeno que segue o cursor (lag suave via lerp)
  - [ ] Ring externo com delay maior
  - [ ] Esconde cursor nativo do OS
  - [ ] Escala em hover de elementos interativos
  - [ ] Desabilitado em mobile (touch devices)

### 2.12 Verificação Final da Fase 2
- [ ] Rodar `npm run dev` — todas as seções renderizando sem erros
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
| Fase 1 — Setup Hermético | `[ ]` Pendente | — |
| Fase 2 — Frontend Wow-Factor | `[ ]` Pendente | — |
| Fase 3 — Supabase + Datalayer | `[ ]` Pendente | — |
| Fase 4 — n8n + Resend | `[ ]` Pendente | — |
| Fase 5 — Auditoria + Build | `[ ]` Pendente | — |

---

*Plano criado em 2026-04-04. Atualizar após cada tarefa concluída e testada.*
