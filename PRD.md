# PRD — Marktracking Performance Solutions
### Main Site · v1.0 · Abril 2026

---

## 1. Visão do Produto

**Marktracking** é uma empresa de Performance Solutions que integra DevOps, Tracking e Growth para produtos digitais de alta escala. O site principal é o principal canal de aquisição e posicionamento da marca — deve transmitir **autoridade técnica, sofisticação visual e confiança operacional**.

O objetivo desta versão é:
1. Comunicar o posicionamento premium da marca com design Awwwards-level
2. Capturar leads qualificados de forma responsável e segura (LGPD-compliant)
3. Estabelecer um pipeline de nurturing automatizado via n8n → Resend
4. Servir como base técnica escalável para futuras features (portal do cliente, dashboard, etc.)

---

## 2. Público-Alvo

| Perfil | Dor | O que o site deve fazer |
|---|---|---|
| Head de Marketing / Growth (Scale-up) | Tracking quebrado, dados inconsistentes, baixo ROAS | Mostrar competência técnica com cases e linguagem de negócio |
| CTO / Tech Lead | Infraestrutura de dados frágil, sem governança | Demonstrar rigor técnico, arquitetura e metodologia |
| Founder de Startup em tração | Não sabe por onde começar com dados | Criar urgência e facilitar o primeiro contato |
| Agência parceira | Precisa de subcontratação técnica especializada | Comunicar clareza de processo e nível de entrega |

---

## 3. Stack Técnica Definida

### Frontend
| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR/SSG, Vercel-native, RSC, SEO máximo |
| Linguagem | **TypeScript 5** | Type safety, refactor seguro |
| Styling | **Tailwind CSS v4** + CSS Modules | Utility-first + encapsulamento por componente |
| Animação | **Framer Motion 12** | Micro-interações fluidas, GSAP-like sem overhead |
| Ícones | **Lucide React** + SVG custom | Consistência e leveza |
| Fontes | Orbitron (headings) + Rajdhani (body) — Google Fonts | Identidade visual existente preservada |
| 3D/Canvas | **Three.js** via `@react-three/fiber` (Hero section) | Diferencial visual para WOW factor |
| Formulário | **React Hook Form** + **Zod** | Validação type-safe no cliente |

### Backend / Infraestrutura
| Camada | Tecnologia | Justificativa |
|---|---|---|
| Banco de dados | **Supabase PostgreSQL** + **RLS** | Datalayer seguro, Row Level Security nativo |
| Auth (futuro) | Supabase Auth | Integração nativa com RLS |
| Automações | **n8n** (self-hosted ou Cloud) | Webhook triggers, lógica de nurturing |
| Email | **Resend** + React Email templates | Deliverability máxima, templates em código |
| Deployment | **Vercel** | CI/CD automático, Edge Network, Preview URLs |
| Secrets | Vercel Environment Variables | Nunca em código, nunca em repositório |

### Segurança
- **Row Level Security (RLS)** habilitado em todas as tabelas do Supabase
- **Service Role Key** usada apenas em rotas server-side (API Routes / Server Actions)
- **Anon Key** exposta apenas com policies RLS restritivas (INSERT only, sem SELECT público)
- Validação dupla: Zod no cliente + validação server-side antes de qualquer escrita
- Rate limiting via Vercel Edge Middleware (proteção anti-spam no endpoint de leads)
- LGPD: consentimento explícito capturado no formulário antes de qualquer persistência

---

## 4. Design System — Diretrizes Visuais

### Identidade Base (preservada do site atual)
- **Background**: `#050505` (dark-bg) / `#0a0a0a` (dark-surface)
- **Accent primário**: `#00ff9d` (neon-green)
- **Accent secundário**: `#00f0ff` (neon-blue)
- **Tipografia**: Orbitron (headings) / Rajdhani (body)

### Evolução Visual — Nível Awwwards
A versão atual tem uma boa base dark/neon. A evolução propõe:

#### Glassmorphism System
```css
/* Cards e painéis */
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

#### Micro-interações Obrigatórias
- **Cursor customizado**: dot tracker com lag effect + blend mode (mix-blend-mode: difference)
- **Scroll reveal**: elementos entram com `translateY(40px) opacity(0)` → `translate(0) opacity(1)` via Intersection Observer / Framer Motion `viewport`
- **Hover em cards**: border glow animado (conic-gradient rotacionando), scale sutil (1.02)
- **CTAs**: ripple effect no click + shimmer scan-line no hover
- **Navigation**: blur progressivo no scroll (backdrop-filter aumenta com scroll Y)
- **Números/Stats**: counter animation quando entram em viewport (0 → valor final)
- **Particles/Campo de forças**: canvas com partículas conectadas (Three.js ou vanilla Canvas2D)

#### Componentes Diferenciadores
- **Hero**: Partícula 3D / campo de força reagindo ao cursor + texto com efeito glitch sutil
- **Serviços**: Cards com glassmorphism + border glow + reveal individual
- **Processo**: Timeline horizontal com animação de progresso contínua
- **Cases/Stats**: Numbers counter + progress bars animadas
- **Formulário**: Inputs com glow focus + floating label + validação em tempo real

---

## 5. Estrutura de Páginas e Seções

### Página Principal (`/`) — One-pager com scroll suave

```
├── <Nav>         Fixed, glassmorphism blur, logo + menu + CTA
├── <Hero>        Fullscreen, 3D particles, headline impactante, 2 CTAs
├── <Sobre>       Split layout, identidade + diferenciais, animated stats
├── <Serviços>    Grid de cards glassmorphism (6 serviços)
├── <Processo>    Timeline interativa (4-5 etapas)
├── <Cases>       Carrossel / grid com métricas de resultado
├── <CTA Band>    Banner de conversão com urgência + formulário inline
├── <Contato>     Formulário completo de lead capture + mapa/localização
└── <Footer>      Links, redes sociais, legal links
```

### Página Legal (`/legal`) — já existe (legal.html)
Migrar para Next.js como rota estática.

### Rotas API (Server-side)
```
POST /api/leads          → Valida → Insere Supabase → Trigger n8n webhook
GET  /api/health         → Status check
```

---

## 6. Datalayer — Modelo de Lead

### Tabela `leads` no Supabase

```sql
CREATE TABLE leads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL,
  empresa       TEXT,
  cargo         TEXT,
  telefone      TEXT,
  mensagem      TEXT,
  servico       TEXT,                    -- qual serviço o lead demonstrou interesse
  origem        TEXT DEFAULT 'site',     -- utm_source ou canal
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  ip_hash       TEXT,                    -- hash do IP (não o IP raw, LGPD)
  user_agent    TEXT,
  consentimento BOOLEAN NOT NULL DEFAULT FALSE,
  status        TEXT DEFAULT 'novo',     -- novo | contatado | qualificado | descartado
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies
```sql
-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anon pode apenas inserir (formulário público)
CREATE POLICY "leads_insert_anon"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (consentimento = TRUE);

-- Service role tem acesso total (usado via API Route server-side)
-- (service role bypassa RLS por padrão no Supabase)

-- Nenhum SELECT/UPDATE/DELETE para anon
```

---

## 7. Automações — Pipeline n8n

### Fluxo: Novo Lead Capturado

```
[Webhook POST /lead-received]
       ↓
[Validar payload]
       ↓
[Enriquecer dados] (lookup empresa se disponível)
       ↓
[Enviar email de boas-vindas via Resend]    → Para o lead
       ↓
[Notificar equipe Marktracking via Resend]  → Para o time interno
       ↓
[Atualizar status lead no Supabase]         → status: 'contatado'
       ↓
[Adicionar ao CRM / Notion / planilha]      → Opcional fase futura
```

### Eventos de Trigger
| Evento | Webhook | Ação |
|---|---|---|
| `lead.novo` | `/webhook/lead-received` | Email boas-vindas + notificação interna |
| `lead.qualificado` | `/webhook/lead-qualified` | Email de proposta / calendário |

---

## 8. Emails — Templates Resend

| Template | Destinatário | Conteúdo |
|---|---|---|
| `lead-welcome` | Lead | Confirmação de contato, apresentação da empresa, próximos passos |
| `lead-internal` | Time Marktracking | Dados completos do lead formatados para ação rápida |
| `lead-followup` | Lead (D+2) | Conteúdo de valor + reforço do diferencial |

Todos os templates são React Email components — versionados no repositório.

---

## 9. SEO & Performance

- **Core Web Vitals alvo**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- `next/image` para todas as imagens (WebP automático, lazy load)
- `next/font` para fontes (elimina CLS de fonte)
- Structured data (JSON-LD): `Organization`, `WebSite`, `Service`
- Open Graph + Twitter Cards completos
- Sitemap automático via `next-sitemap`
- Robots.txt configurado
- Analytics: Vercel Analytics (privacy-first, sem cookies)

---

## 10. KPIs de Sucesso

| Métrica | Meta v1.0 |
|---|---|
| Lighthouse Score | ≥ 90 (todas as categorias) |
| LCP | < 2.5s |
| Taxa de conversão do formulário | > 3% dos visitantes |
| Leads capturados com e-mail válido | 100% (validação Zod) |
| Uptime | 99.9% (Vercel SLA) |
| Emails com consentimento registrado | 100% (RLS policy enforcement) |

---

## 11. Fora de Escopo (v1.0)

- Portal do cliente / área logada
- Dashboard de analytics próprio
- Blog / CMS
- Checkout / pagamento
- Multi-idioma (i18n)

*Estes itens são candidatos para v2.0 após validação do produto.*

---

*Documento criado em 2026-04-04. Owner: Equipe Marktracking + Engenharia.*
