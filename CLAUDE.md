# CLAUDE.md — Regras de Operação para este Projeto
### Marktracking Main Site · Vigência: toda a duração do projeto

> Este arquivo guia o comportamento do Claude Code neste repositório.
> Estas regras têm precedência sobre comportamentos padrão e são **não-negociáveis**.

---

## 1. PRINCÍPIO CENTRAL: ZERO TRUST

**Nunca confiar. Sempre verificar.**

Este princípio se aplica a credenciais, secrets, chaves de API, tokens — qualquer dado sensível.

### Regras Absolutas de Segurança

#### PROIBIDO — Jamais fazer:
- ❌ Hardcodar qualquer secret, API key, token ou senha **em qualquer arquivo do repositório**
- ❌ Commitar arquivos `.env`, `.env.local`, `.env.production` ou qualquer variação
- ❌ Usar valores reais de secrets em exemplos de código, comentários ou testes
- ❌ Logar secrets no console — nem em `console.log` de debug temporário
- ❌ Fazer `git add .` ou `git add -A` sem inspecionar o que está sendo staged
- ❌ Usar `git commit --no-verify` para pular hooks de segurança
- ❌ Expor `SUPABASE_SERVICE_ROLE_KEY` em código client-side ou no bundle do browser
- ❌ Usar `process.env.SUPABASE_SERVICE_ROLE_KEY` fora de arquivos server-side

#### OBRIGATÓRIO — Sempre fazer:
- ✅ Acessar secrets exclusivamente via `process.env.NOME_DA_VARIAVEL`
- ✅ Manter o `.env.example` atualizado com todas as variáveis necessárias (sem valores)
- ✅ Verificar o `.gitignore` **antes de qualquer commit** — abrir o arquivo e confirmar visualmente
- ✅ Rodar `git status` antes de qualquer `git add` para inspecionar o que mudou
- ✅ Validar que variáveis `NEXT_PUBLIC_*` são realmente seguras para expor ao browser
- ✅ Usar o Supabase **server client** (service role) apenas em `app/api/`, Server Actions ou `lib/supabase/server.ts`
- ✅ Usar o Supabase **browser client** (anon key) apenas em componentes client-side

---

## 2. PROTOCOLO DE PROGRESSO — PLAN.md

### Regra de Marcação de Tarefas

Claude **SOMENTE** marca uma tarefa como `[x]` no `PLAN.md` quando:
1. A implementação está completa
2. O comportamento foi **testado e validado** (build rodou, funcionalidade verificada, sem erros no console)
3. O teste foi real — não imaginado

### Nunca marcar `[x]` se:
- O código foi escrito mas não testado
- O build está falhando
- Há erros no console que não foram investigados
- A funcionalidade foi parcialmente implementada

### Após concluir cada tarefa:
1. Testar a funcionalidade
2. Abrir `PLAN.md`
3. Mudar `[ ]` → `[x]` na tarefa correspondente
4. Atualizar o status na tabela "Progresso Geral" quando uma Fase inteira for concluída

---

## 3. STACK E CONVENÇÕES DE CÓDIGO

### Framework e Linguagem
- **Next.js 15 App Router** — usar exclusivamente App Router. Sem Pages Router.
- **TypeScript** — zero uso de `any`. Se o tipo não for conhecido, usar `unknown` e fazer type guard.
- **Server Components por padrão** — marcar com `"use client"` apenas quando necessário (event handlers, hooks, browser APIs)

### Estilo e Formatação
- **Tailwind CSS v4** — utility-first. CSS Modules apenas para casos que Tailwind não resolve.
- Componentes: PascalCase (ex: `HeroSection.tsx`)
- Funções/variáveis: camelCase
- Constantes: SCREAMING_SNAKE_CASE
- Arquivos utilitários: kebab-case (ex: `lead-validation.ts`)

### Imports
- Usar path aliases: `@/components/...`, `@/lib/...`, `@/emails/...`
- Nunca imports relativos do tipo `../../../lib/supabase`

### Componentes
- Componentes pesados (Three.js, canvas, charts) **sempre** lazy-loaded com `next/dynamic` e `{ ssr: false }`
- Props com TypeScript interfaces explícitas — sem PropTypes
- Sem `default export` em arquivos de múltiplas exportações

### API Routes
- Sempre validar o método HTTP (`if (req.method !== 'POST') return 405`)
- Sempre validar o body com Zod antes de qualquer operação
- Nunca retornar stack traces para o cliente em produção
- Respostas de erro: `{ error: "mensagem amigável" }` — sem detalhes internos expostos

---

## 4. CHECKLIST PRE-COMMIT (obrigatório)

Antes de qualquer commit, verificar mentalmente e/ou com ferramentas:

```
[ ] git status mostra apenas os arquivos que eu quero commitar
[ ] Nenhum arquivo .env* está staged
[ ] Nenhum secret está hardcoded nos arquivos modificados
[ ] O .gitignore está bloqueando os arquivos sensíveis
[ ] npm run build passa sem erros (em mudanças significativas)
[ ] Nenhum console.log com dados de usuário ou credenciais
[ ] Tipos TypeScript estão corretos (sem ts-ignore desnecessário)
```

---

## 5. SUPABASE — REGRAS ESPECÍFICAS

### Client vs Server
| Arquivo | Client a usar | Key usada |
|---|---|---|
| Componentes `"use client"` | `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `app/api/*/route.ts` | `lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY` |
| Server Actions | `lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY` |
| Server Components | `lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY` |

### RLS
- Toda tabela criada **deve ter RLS habilitado** antes de sair do Supabase dashboard
- Policies seguem o princípio do menor privilégio: anon só pode fazer o mínimo necessário
- Nunca fazer `DISABLE ROW LEVEL SECURITY` em produção

---

## 6. PERFORMANCE — REGRAS DE OURO

- Imagens: **sempre** via `next/image` com `width`, `height` e `alt` definidos
- Fontes: **sempre** via `next/font` — nunca `<link>` manual para Google Fonts
- Three.js / canvas: **sempre** com `dynamic(() => import(...), { ssr: false })`
- Animações: preferir `transform` e `opacity` (GPU) — evitar animar `width`, `height`, `top`, `left`
- `useEffect` para efeitos de animação: sempre limpar com cleanup function

---

## 7. ESTRUTURA DE ARQUIVOS PROIBIDOS

Nunca criar dentro do repositório:
- `.env` (qualquer variação com valores reais)
- `*.pem`, `*.key`, `*.p12` (certificados)
- `credentials.json`, `service-account.json` (GCP/Firebase)
- Qualquer arquivo com "secret", "password", "token" no nome que não seja `.example`

---

## 8. QUANDO PEDIR CONFIRMAÇÃO

Claude deve pedir confirmação explícita do usuário antes de:
- Fazer qualquer operação destrutiva (`DELETE`, `DROP TABLE`, `rm -rf`)
- Publicar em produção (push para main)
- Alterar variáveis de ambiente em produção no Vercel
- Enviar emails reais (não sandbox) durante desenvolvimento
- Executar migrations irreversíveis no Supabase

---

## 9. REFERÊNCIAS RÁPIDAS

| O que preciso | Onde está |
|---|---|
| Visão do produto e stack | `PRD.md` |
| O que fazer agora | `PLAN.md` |
| Variáveis de ambiente necessárias | `.env.example` |
| Schema do banco | `PRD.md` — Seção 6 |
| Fluxo n8n | `PRD.md` — Seção 7 |
| Templates de email | `emails/` |
| Validações de lead | `lib/validations/lead.ts` |

---

*Estas regras são parte do contrato de operação deste projeto.*
*Qualquer desvio deve ser discutido e aprovado explicitamente pelo usuário antes de ser executado.*
