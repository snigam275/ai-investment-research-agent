# AI Investment Research Agent 🤖📊

An AI-powered web application that analyzes any public company across the web in real-time, compiles a structured research breakdown, and delivers an **INVEST ✓** or **PASS ✗** verdict using Google Gemini 1.5 Flash and Tavily Search — built with Next.js, TypeScript, and LangGraph.js.

---

## 🚀 Key Features

- **Parallel Search Protocol**: Executes 4 Tavily Search queries concurrently (Financials, News, Peers, Risks) to minimize latency by ~3x.
- **LangGraph.js Orchestration**: Models the agent workflow as a linear state graph containing a **Research Node** and an **Analysis Node**.
- **Gemini Native JSON Output**: Forces Gemini 1.5 Flash to output raw JSON payloads using structured schemas (`responseMimeType: "application/json"`), preventing formatting errors.
- **Sleek Trading Desk Theme**: Implements a high-fidelity dark-themed interface utilizing Tailwind CSS, custom circular SVG animated gauges, glassmorphic cards, glowing borders, and simulated loading log streams.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14/15/16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Next.js Server API Routes |
| **AI Agent** | LangGraph.js |
| **LLM** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Search Engine** | Tavily Search API (`@tavily/core`) |
| **Deployment** | Vercel |

---

## 📂 Project Structure

```
ai-investment-agent/
├── .env.local                   ← Local API keys (never commit)
├── .env.example                 ← Template environment keys
├── .gitignore
├── next.config.ts               ← Next.js configurations (Server External Packages)
├── package.json
├── tsconfig.json
├── README.md
│
├── app/
│   ├── layout.tsx               ← Base layout loading Outfit Google Font
│   ├── page.tsx                 ← Main application view container and tickers
│   ├── globals.css              ← Custom glow utilities and marquee animations
│   └── api/
│       └── research/
│           └── route.ts         ← POST api handler running LangGraph agent
│
├── components/
│   ├── SearchForm.tsx           ← Centered glowing search & popular suggestions
│   ├── LoadingState.tsx         ← Animated console printing step logs
│   ├── ResultsDashboard.tsx     ← Dashboard layout rendering verdict segments
│   ├── VerdictBadge.tsx         ← Neon glowing Invest/Pass pills
│   ├── ScoreGauge.tsx           ← SVG progress ring drawing gauge
│   └── ResearchSection.tsx      ← Sentiment-focused glassmorphic card
│
└── lib/
    ├── agent.ts                 ← LangGraph state definition & nodes
    ├── tools.ts                 ← Parallel Tavily search triggers
    ├── prompts.ts               ← System analyst prompt constructions
    └── types.ts                 ← TypeScript interfaces
```

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js 18+
- Google Gemini API key → [Google AI Studio](https://aistudio.google.com)
- Tavily API key → [Tavily](https://tavily.com)

### Installation Steps

1. **Clone or Initialize the Workspace**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-investment-agent.git
   cd ai-investment-agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Keys**
   Copy the example environment template to create your local key repository:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and paste your credentials:
   ```env
   GOOGLE_API_KEY=your_actual_gemini_api_key
   TAVILY_API_KEY=your_actual_tavily_api_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the application.

5. **Production Build Check**
   Verify TypeScript compilations and server route bundling:
   ```bash
   npm run build
   ```

---

## 🧠 How the Agent Works

1. **User Request**: The user enters a company name (e.g. `Reliance Industries`, `Tesla`).
2. **Search Protocol (Research Node)**:
   - Triggers 4 asynchronous Tavily searches in parallel via `Promise.all`:
     1. Financial trends (revenue, profit, balance sheet reports).
     2. Latest business news and announcements.
     3. Industry competitors and market share positions.
     4. Regulatory barriers and systemic risk factors.
   - Cleans and cuts raw text blocks to comply with token thresholds.
3. **Analyst Synthesis (Analysis Node)**:
   - Injects the compiled logs into a structured system analyst prompt.
   - Leverages Google Gemini 1.5 Flash to evaluate fundamentals, growth moats, and risk vectors.
   - Translates findings into a structured verdict layout (verdict, score 0-100, reasoning, pros, cons, risks, sentiment scores).
4. **Interactive Dashboard**:
   - The UI parses the response payload, draws the circular SVG gauge, highlights glowing sentiment sections, and prints detailed findings.

---

## 🛡️ Git Setup & Deployment

1. **Initialize Git & Commit**
   ```bash
   git init
   git add .
   git commit -m "feat: complete premium AI investment research agent"
   ```

2. **Vercel Deployment**
   Make sure you are logged in to the Vercel CLI, then run:
   ```bash
   npx vercel
   ```
   Add environment variables inside your project settings dashboard:
   - `GOOGLE_API_KEY`
   - `TAVILY_API_KEY`
   
   Re-deploy to production:
   ```bash
   npx vercel --prod
   ```
