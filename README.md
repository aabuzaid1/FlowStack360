<div align="center">

<img src="./logo flowstack360.png" alt="FlowStack360 Logo" width="220" />

# FlowStack360

**The All-in-One AI-Powered Social Media Automation Platform**

*Schedule · Automate · Analyze · Dominate Every Channel*

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blueviolet?style=for-the-badge)](./LICENSE)
[![Version](https://img.shields.io/badge/Version-v1.47.0-00d2ff?style=for-the-badge)](./version.txt)
[![Node](https://img.shields.io/badge/Node-%3E%3D22.12.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.6.1-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.5.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](./docker-compose.yaml)

---

[✨ Features](#-features) · [🚀 Quick Start](#-quick-start) · [🏗️ Architecture](#️-architecture) · [🔌 Integrations](#-integrations) · [⚙️ Configuration](#️-configuration) · [🐳 Docker](#-docker-deployment) · [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**FlowStack360** is a full-stack, enterprise-grade social media management platform that gives you 360° control over your entire digital presence. Built for creators, agencies, and businesses that demand more — automate your posting pipeline across 30+ platforms, leverage AI agents for content generation, analyze performance with deep analytics, and manage your team — all from a single, beautiful dashboard.

> 🎯 **The mission:** Let AI handle the repetitive work so you can focus on creating content that truly connects.

---

## ✨ Features

### 📅 Smart Scheduling & Publishing
- **Multi-platform scheduling** — Queue and publish to 30+ social platforms simultaneously
- **Visual content calendar** — Drag-and-drop post management with a timeline view
- **Auto-post campaigns** — Set up recurring content sequences that run on autopilot
- **Optimal timing engine** — AI-powered post time recommendations based on audience engagement

### 🤖 AI Content Engine
- **AI-powered post generation** — Craft captions, threads, and long-form content with GPT-4 & Gemini
- **AI agents** — Autonomous agents that research, draft, and schedule content for you
- **Smart rewriting** — Repurpose existing content across different platform formats automatically
- **Emoji & hashtag suggestions** — Contextual recommendations to boost discoverability

### 📊 Advanced Analytics
- **Cross-platform analytics** — Unified performance metrics across all connected channels
- **Audience insights** — Deep-dive into follower demographics, growth trends, and engagement rates
- **Post performance tracking** — Click-through rates, impressions, shares, and reach per post
- **Custom reporting** — Export data and generate reports for clients or stakeholders

### 👑 Admin Dashboard
- **User management** — Full control over all user accounts, roles, and subscription tiers
- **Revenue overview** — Track MRR, subscriptions, and financial performance at a glance
- **Discount system** — Create and apply custom percentage or fixed discounts per user
- **Mass email campaigns** — Send targeted email blasts to users filtered by subscription plan
- **Dynamic pricing control** — Update subscription pricing and features in real-time
- **Error monitoring** — Track system errors per user for proactive support

### 💳 Billing & Subscriptions
- **Stripe integration** — Secure, PCI-compliant payment processing
- **Flexible subscription tiers** — Free, Pro, and Enterprise plans with admin-configurable features
- **Usage-based limits** — Control API rate limits, channel counts, and post volumes per plan
- **Webhook support** — Automated subscription lifecycle management

### 🔐 Security & Authentication
- **JWT-based authentication** — Secure, stateless session management
- **Generic OAuth 2.0** — Support for custom OAuth providers (Authentik, Keycloak, etc.)
- **CASL-based authorization** — Fine-grained role and permission management
- **Rate limiting** — Redis-backed throttling to prevent abuse
- **Sentry monitoring** — Real-time error tracking and performance monitoring

### 🌐 Additional Capabilities
- **Media library** — Upload and manage images/videos with Cloudflare R2 or local storage
- **Link shortening** — Built-in support for Dub, Short.io, Kutt, and LinkDrip
- **Webhooks** — Trigger external workflows on post publish events
- **Public API** — RESTful API with Swagger docs for developers and third-party integrations
- **Chrome Extension** — Browser extension for quick posting from anywhere
- **i18n support** — Multi-language interface out of the box
- **Dark / Light mode** — System-aware theme toggle with smooth transitions
- **Temporal workflows** — Durable, fault-tolerant background job processing

---

## 🔌 Integrations

FlowStack360 connects to **30+ platforms** natively:

<div align="center">

| Social Media | Content Platforms | Communities | Messaging |
|:---:|:---:|:---:|:---:|
| 𝕏 (Twitter) | WordPress | Reddit | Telegram |
| Instagram | Medium | Discord | Slack |
| Facebook | Hashnode | Lemmy | — |
| LinkedIn | Dev.to | MeWe | — |
| TikTok | Beehiive | Skool | — |
| YouTube | Listmonk | Whop | — |
| Pinterest | — | Farcaster | — |
| Threads | — | Nostr | — |
| Bluesky | — | VK | — |
| Mastodon | — | Kick | — |
| Dribbble | — | Twitch | — |
| Google My Business | — | Moltbook | — |

</div>

---

## 🏗️ Architecture

FlowStack360 is a **pnpm monorepo** composed of multiple applications and shared libraries:

```
FlowStack360/
├── apps/
│   ├── frontend/          # Next.js 16 — main user-facing dashboard
│   ├── backend/           # NestJS 10 — core REST API server
│   ├── orchestrator/      # Temporal worker — background job processor
│   ├── commands/          # CLI utility scripts
│   ├── extension/         # Chrome browser extension (Vite)
│   └── sdk/               # Public SDK package
│
├── libraries/
│   ├── nestjs-libraries/  # Shared backend services, DTOs, Prisma schema
│   ├── react-shared-libraries/ # Shared React components & hooks
│   └── helpers/           # Shared utility functions
│
├── docker-compose.yaml    # Production Docker stack
└── docker-compose.dev.yaml # Development Docker stack
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TailwindCSS 3, Mantine UI |
| **Backend** | NestJS 10, TypeScript 5.5, Swagger/OpenAPI |
| **Database** | PostgreSQL 17 + Prisma ORM 6.5 |
| **Cache / Queue** | Redis 7.2 + IORedis |
| **Workflows** | Temporal.io (durable execution engine) |
| **AI / LLM** | OpenAI GPT-4, Google Gemini, LangChain, Mastra |
| **Storage** | Cloudflare R2 / Local filesystem |
| **Payments** | Stripe |
| **Email** | Resend + Nodemailer |
| **Monitoring** | Sentry (frontend + backend + profiling) |
| **Auth** | JWT + generic OAuth 2.0 |
| **Testing** | Jest 29, Vitest 3, Testing Library |
| **DevOps** | Docker, Docker Compose, Railway, Jenkins |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>=22.12.0 <23.0.0`
- **pnpm** `10.6.1`
- **Docker** & **Docker Compose** (for databases)
- **PostgreSQL 17** (or use Docker)
- **Redis 7.2** (or use Docker)

### 1. Clone the repository

```bash
git clone https://github.com/aabuzaid1/FlowStack360.git
cd FlowStack360
```

### 2. Install dependencies

```bash
pnpm install
```

> This also auto-runs `prisma generate` via the `postinstall` script.

### 3. Start required services (Docker)

```bash
pnpm run dev:docker
```

This spins up PostgreSQL and Redis containers locally.

### 4. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env` with your values. See the [Configuration](#️-configuration) section below.

### 5. Push database schema

```bash
pnpm run prisma-db-push
```

### 6. Start the development server

```bash
# Start frontend + backend (recommended)
pnpm run dev

# Or start individual services:
pnpm run dev:frontend    # Next.js on :4200
pnpm run dev:backend     # NestJS on :3000
pnpm run dev:orchestrator # Temporal worker
```

### 7. Open in browser

Navigate to **http://localhost:4200** 🎉

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in the required values:

### Required Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Long random string for JWT signing |
| `FRONTEND_URL` | Public URL of the frontend (e.g. `http://localhost:4200`) |
| `NEXT_PUBLIC_BACKEND_URL` | Public URL of the backend API |
| `BACKEND_INTERNAL_URL` | Internal backend URL (for SSR) |

### Storage (choose one)

**Local storage:**
```env
STORAGE_PROVIDER="local"
UPLOAD_DIRECTORY="/path/to/uploads"
```

**Cloudflare R2:**
```env
STORAGE_PROVIDER="cloudflare"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ACCESS_KEY="your-access-key"
CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-access-key"
CLOUDFLARE_BUCKETNAME="your-bucket"
CLOUDFLARE_BUCKET_URL="https://..."
CLOUDFLARE_REGION="auto"
```

### AI & Payments (optional)

```env
OPENAI_API_KEY="sk-..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_SIGNING_KEY="whsec_..."
```

### Email (optional)

```env
RESEND_API_KEY="re_..."
EMAIL_FROM_ADDRESS="noreply@yourdomain.com"
EMAIL_FROM_NAME="FlowStack360"
```

For a full list of all variables, refer to [`.env.example`](./.env.example).

---

## 🐳 Docker Deployment

### Full production stack

```bash
docker compose up -d
```

This starts:
- **FlowStack360 app** on port `4007`
- **PostgreSQL 17** database
- **Redis 7.2** cache
- **Temporal** workflow engine
- **Temporal UI** on port `8080`
- **Sentry Spotlight** (monitoring) on port `8969`

### Dev-only Docker stack (databases only)

```bash
docker compose -f docker-compose.dev.yaml up -d
```

### Build production images

```bash
pnpm run build
```

Or build individual services:

```bash
pnpm run build:frontend
pnpm run build:backend
pnpm run build:orchestrator
```

---

## 🧪 Testing

Run the full test suite:

```bash
pnpm run test
```

Output is saved to `./reports/junit.xml` for CI integration.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start dev server (frontend + backend) |
| `pnpm run dev:full` | Start all services including orchestrator |
| `pnpm run dev:stripe` | Dev mode with Stripe webhook forwarding |
| `pnpm run build` | Build all production bundles |
| `pnpm run prisma-generate` | Regenerate Prisma client |
| `pnpm run prisma-db-push` | Push schema changes to database |
| `pnpm run prisma-db-pull` | Pull schema from existing database |
| `pnpm run prisma-reset` | Hard reset the database |
| `pnpm run test` | Run all tests with coverage |
| `pnpm run pm2` | Start all services with PM2 (production) |
| `pnpm run docker-build` | Build Docker images |
| `pnpm run publish-sdk` | Publish the SDK package to npm |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before submitting a PR.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request against `main`

---

## 🔒 Security

Found a vulnerability? Please read our [Security Policy](./SECURITY.md) and report it responsibly. Do **not** open public GitHub issues for security vulnerabilities.

---

## 📄 License

FlowStack360 is licensed under the **[GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE)**.

This means you are free to use, modify, and distribute this software, but any modifications or network deployments must also be released under the same license.

---

## 🙏 Acknowledgements

FlowStack360 is built on top of amazing open-source technologies:

- [Next.js](https://nextjs.org) — The React framework for production
- [NestJS](https://nestjs.com) — Progressive Node.js framework
- [Prisma](https://prisma.io) — Next-generation ORM for Node.js
- [Temporal.io](https://temporal.io) — Durable workflow execution
- [Mastra](https://mastra.ai) — AI agent framework
- [LangChain](https://langchain.com) — LLM application framework
- [Stripe](https://stripe.com) — Payment infrastructure

---

<div align="center">

**Built with ❤️ by the FlowStack360 team**

*Automate everything. Scale anywhere. Own your audience.*

</div>
