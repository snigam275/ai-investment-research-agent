# AI Investment Research Agent — Project Submission

**Built with:** Google Antigravity IDE (AI coding assistant powered by Gemini / Claude)  
**Stack:** Next.js 16 · LangGraph.js · Google Gemini 2.5 Flash · Tavily Search · MongoDB  

---

## 1. Overview — What It Does

The **AI Investment Research Agent** is a full-stack web application that acts as an automated, AI-powered stock analyst. A user types any publicly listed company name — Indian or global — and the agent autonomously executes a multi-step research pipeline:

1. **Parallel Web Research** — simultaneously searches the live web across four dimensions: financials, news & sentiment, competitive landscape, and risk factors using the Tavily Search API.
2. **LLM Synthesis** — aggregates all research text into a structured hedge-fund analyst prompt and calls Google Gemini 2.5 Flash, which produces a precise, structured JSON verdict.
3. **Decisive Output** — returns a binary **INVEST ✓** or **PASS ✗** verdict with a confidence score (0–100), an executive summary, detailed reasoning, strengths, weaknesses, and risk bullets.
4. **MongoDB Caching** — saves each completed analysis to a database so repeat searches are served instantly (zero Tavily/Gemini API calls on cache hit).
5. **Visual Analytics Dashboard** — renders all past researched companies as an interactive SVG leaderboard chart on the homepage. Hovering over a chart node shows a floating card with key strength bullets; clicking opens a full historical report in a sliding side panel.

The interface is designed to feel like a premium trading station — dual light/dark themes, an animated live stock ticker marquee, a simulated terminal log during analysis, animated confidence gauges, and text-clamped research cards with expand toggles.

---

## 2. How to Run It — Setup and Run Steps

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18 or higher |
| npm | v9 or higher |
| MongoDB | Local install (optional — the app works without it via in-memory fallback) |

### Step 1 — Clone / Open the Repository

```bash
cd IIMtask
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Environment Variables

Create a `.env.local` file in the project root (a `.env.example` template is included):

```env
# Required — get from https://aistudio.google.com/app/apikey (free)
GOOGLE_API_KEY=your_google_gemini_api_key

# Required — get from https://tavily.com (free tier: 1,000 searches/month)
TAVILY_API_KEY=your_tavily_api_key

# Optional — defaults to local MongoDB if not set
MONGODB_URI=mongodb://localhost:27017
```

> **Tavily Free Tier:** Tavily offers 1,000 searches/month at no cost — fully sufficient for testing this agent across many companies.

> **MongoDB Optional:** If MongoDB is not running locally, the app automatically falls back to an in-memory cache. All features remain functional; data simply does not persist across server restarts.

### Step 4 — Run the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### Step 5 — Production Build (optional)

```bash
npm run build
npm run start
```

---

## 3. How It Works — Approach and Architecture

### High-Level Request Flow

```
User Input: "Zomato"
      │
      ▼
POST /api/research
      │
      ├── Check MongoDB / Memory Cache ──► Cache Hit? Return instantly ✓
      │
      └── Cache Miss: Run LangGraph Agent
                │
                ├── Node 1: conductResearch
                │       └── Tavily Search (4 parallel Promise.all calls)
                │           ├── "Zomato financials revenue profit annual report"
                │           ├── "Zomato latest news business developments"
                │           ├── "Zomato competitors market share industry"
                │           └── "Zomato risks challenges regulatory concerns"
                │
                └── Node 2: analysis
                        └── Google Gemini 2.5 Flash
                            └── Structured JSON InvestmentVerdict
                                  │
                                  └── Save to MongoDB → Return to Frontend
```

### LangGraph State Machine (lib/agent.ts)

The agent uses `@langchain/langgraph` to define a typed two-node sequential graph:

```
START ──► conductResearch ──► analysis ──► END
```

State is defined using `Annotation.Root` with reducer functions ensuring immutable, type-safe updates between nodes. Errors propagate through a dedicated `error` state channel without crashing the graph — if research fails, the analysis node receives the error gracefully and returns `null` verdict.

### Gemini Prompt Design (lib/prompts.ts)

The system persona is *"a senior investment analyst with 20 years of experience at a top-tier hedge fund."* Key design choices:

- **`responseMimeType: "application/json"`** — forces Gemini to return strict JSON, eliminating markdown wrapping or conversational preamble.
- **Explicit decision thresholds** — INVEST for scores 60–100, PASS for 0–59. A score of exactly 50 is explicitly forbidden, forcing decisiveness.
- **Research grounding** — the prompt instructs the model to base the verdict *strictly* on the provided research text, not its pre-trained knowledge.

### Database Layer (lib/db.ts)

- Connects to MongoDB with a 2-second timeout (so it fails fast without hanging the request)
- Maintains a global connection pool via module-level caching
- Creates compound indexes on `{ company: 1 }` (unique) and `{ confidenceScore: -1 }` (for sorted leaderboard queries)
- Falls back silently to a global in-memory JS array if MongoDB is unavailable

### Key Source Files

| File | Role |
|------|------|
| `lib/agent.ts` | LangGraph graph definition and `runInvestmentAgent()` export |
| `lib/tools.ts` | Tavily 4-search parallel execution |
| `lib/prompts.ts` | Hedge fund analyst system prompt builder |
| `lib/db.ts` | MongoDB pool + memory fallback + CRUD helpers |
| `lib/types.ts` | `InvestmentVerdict`, `ResearchCategory`, `AgentState` TypeScript types |
| `app/api/research/route.ts` | POST endpoint: cache → agent → save |
| `app/api/top-companies/route.ts` | GET endpoint: returns top 10 by confidence score |
| `components/TopTenChart.tsx` | Custom SVG leaderboard with hover tooltips + click drawer |
| `components/SidePanel.tsx` | Right-sliding historical report drawer |
| `components/LoadingState.tsx` | Animated terminal log during analysis |
| `components/ResultsDashboard.tsx` | Post-analysis verdict dashboard |
| `components/ScoreGauge.tsx` | Animated circular SVG confidence ring |
| `app/page.tsx` | Home page — orchestrates all state machines and theme toggling |
| `app/globals.css` | Dual theme CSS variables, slide-in/fade-in animations |

---

## 4. Key Decisions & Trade-offs

### What Was Chosen and Why

| Decision | Rationale |
|----------|-----------|
| **LangGraph.js** | Even with two nodes, using a state machine establishes a scalable, inspectable pattern. Adding conditional routing, human-in-the-loop, or memory is straightforward from this foundation. |
| **Tavily over SerpAPI** | Tavily is purpose-built for LLM agents — it returns clean, deduplicated, relevance-ranked excerpts, not raw HTML. This dramatically reduces token consumption and improves synthesis quality. |
| **Gemini 2.5 Flash** | Faster than GPT-4o for structured outputs, native JSON mode via `responseMimeType`, large context window for aggregated research text, and free API tier for development. |
| **Custom SVG Charts** | Third-party libraries (Recharts, Chart.js) have known bundler conflicts with Next.js 16 Turbopack. A bespoke SVG chart is ~60 lines, zero dependencies, and works perfectly. |
| **MongoDB + memory fallback** | Prevents runtime crashes when MongoDB is unavailable (e.g., on Vercel without Atlas, or in local dev without a DB server). The fallback is transparent to the user. |
| **CSS variable themes** | A single set of semantic tokens (`--background`, `--text-primary`, etc.) maps cleanly to both the warm yellow+teal light palette and the neon dark palette. The toggle persists via `localStorage`. |
| **Text clamping in research cards** | Research findings can be 300–500 words. Clamping to 3 lines with a "Read More" toggle keeps the dashboard scannable while keeping all data accessible. |

### What Was Left Out and Why

| Feature | Reason |
|---------|--------|
| **Real-time log streaming** | Would require Server-Sent Events infrastructure. At 8–15s total latency, the simulated terminal log provides a good UX approximation without the complexity. |
| **User authentication** | Out of scope for MVP. All research is shared in the database. Adding NextAuth would be a natural next step. |
| **Live price data / candlesticks** | Requires a paid financial data API (Alpha Vantage, Yahoo Finance). Excluded to keep the stack free and minimal. |
| **Vercel deployment** | Configured (`maxDuration = 60`, `serverExternalPackages`) but not executed — requires MongoDB Atlas URI for database persistence. |
| **Portfolio tracking / alerts** | Requires persistent user sessions. A natural extension of the caching layer that exists. |

---

## 5. Example Runs — Agent Output on Selected Companies

### Run 1 — Zomato (Indian Food & Quick Commerce)

```
Verdict:        INVEST ✓
Confidence:     85 / 100

Executive Summary:
Zomato demonstrates strong market leadership in Indian food delivery with
accelerating Blinkit (quick commerce) growth driving significant incremental
revenue. Despite near-term profitability pressures from dark store capex, the
long-term structural demand tailwinds and expanding user base support a
compelling investment case.

Key Strengths:
• Market leader in Indian food delivery with 60%+ platform GMV share
• Blinkit hyper-growth: 120% YoY increase in dark store count
• Operating leverage improving — adjusted EBITDA turned positive in FY24

Key Weaknesses:
• High operating losses from accelerated Blinkit capex investment cycle
• Gig economy regulatory exposure (driver classification laws, DPDP Act)
• Premium valuation multiples leave limited margin of safety

Major Risks:
• Swiggy / ONDC competitive pricing pressure eroding delivery take-rates
• Rising CAC as urban market penetration approaches saturation
• Potential adverse GST classification changes on food delivery commissions

Research Breakdown:
  Financials:  POSITIVE — Revenue grew 69% YoY; path to profitability clear
  News:        POSITIVE — Blinkit expansion, new category announcements
  Competitors: NEUTRAL  — Swiggy holds meaningful share; ONDC a long-term watch
  Risks:       NEGATIVE — Regulatory and margin compression risks flagged
```

---

### Run 2 — Tesla (US Electric Vehicles)

```
Verdict:        PASS ✗
Confidence:     38 / 100

Executive Summary:
Tesla faces intensifying margin compression from aggressive price cuts, rising
competition from Chinese EV manufacturers, and CEO distraction risks. While
the Supercharger moat and FSD optionality remain real, near-term fundamentals
do not justify the current premium valuation multiple.

Key Strengths:
• Supercharger network is a durable, hard-to-replicate infrastructure moat
• FSD (Full Self-Driving) represents significant software revenue optionality
• Global brand recognition and vertically integrated manufacturing

Key Weaknesses:
• Gross margins compressed from ~25% to ~17% in 18 months due to price cuts
• Elon Musk's divided attention (X, xAI, SpaceX) creates execution risk
• Demand softness in China and Europe through 2024

Major Risks:
• BYD and CATL-backed EVs undercutting on price in all major markets
• FSD regulatory approval delays across EU, UK, and Asia Pacific
• Labour relations and reputational risks from workforce restructuring

Research Breakdown:
  Financials:  NEGATIVE — Margin deterioration and slowing delivery growth
  News:        NEGATIVE — CEO controversies, layoffs, delivery miss vs guidance
  Competitors: NEGATIVE — BYD outsold Tesla globally in Q4 2023
  Risks:       NEGATIVE — Multiple compounding headwinds identified
```

---

### Run 3 — Infosys (Indian IT Services)

```
Verdict:        INVEST ✓
Confidence:     72 / 100

Executive Summary:
Infosys offers a stable, cash-generative business with strong enterprise
client retention, disciplined capital allocation (consistent buybacks and
dividends), and growing AI/cloud transformation revenues. Modest growth
expectations are appropriately priced in, making this a reliable long-term
holding for risk-conscious investors.

Key Strengths:
• Tier-1 IT services brand with deep Fortune 500 client relationships
• Consistent 85–90% free cash flow conversion ratio
• Growing AI practice (Topaz platform) and cloud migration pipeline

Key Weaknesses:
• Revenue growth guidance lowered to 1–3% YoY in FY2024
• US BFSI vertical weakness dragging blended growth rates significantly
• Attrition normalization masks ongoing talent pipeline pressure

Major Risks:
• H-1B visa policy tightening increasing US onsite delivery costs materially
• Large deal ramp delays in banking and insurance client segments
• INR/USD currency volatility compressing rupee-reported dollar margins

Research Breakdown:
  Financials:  NEUTRAL  — Stable but growth headwinds acknowledged in guidance
  News:        NEUTRAL  — Steady deal wins balanced against guidance cut
  Competitors: NEUTRAL  — TCS and Wipro facing same macro headwinds
  Risks:       NEGATIVE — Visa costs and BFSI concentration flagged
```

---

## 6. What I Would Improve with More Time

### Near-term (1–2 weeks)

1. **Real-time streaming via Server-Sent Events** — push each research phase update to the frontend as it completes, so the terminal animation is connected to actual agent events rather than simulated.

2. **Cache TTL and smart invalidation** — verdicts currently cache indefinitely. Adding a 24h TTL for stable blue-chips and a 2h TTL for volatile small-caps would keep data appropriately fresh.

3. **Source citations on bullets** — link each strength/weakness/risk bullet back to the Tavily source URL so the verdict is auditable and traceable to real articles.

4. **Sector-level bar chart** — group companies by sector (Technology, FMCG, Banking) and show sector sentiment heatmaps alongside the individual leaderboard.

### Medium-term (1 month)

5. **Live financial data integration** — connect Alpha Vantage or Yahoo Finance for real P/E ratios, historical price charts, and market cap data to supplement text-based research.

6. **Portfolio watchlist with alerts** — let users save INVEST verdicts and receive a notification if the agent's verdict flips on a re-run.

7. **Comparative dual-company analysis** — side-by-side analysis of two companies in the same sector sharing a research context window.

8. **Vercel + MongoDB Atlas deployment** — configure Atlas URI and deploy to Vercel so the app is publicly accessible with persistent data.

### Long-term (3+ months)

9. **Agent memory with LangGraph checkpointing** — persist agent state so it remembers previous analyses, detects when a company situation materially changes, and proactively suggests re-analysis.

10. **Scheduled background refresh** — a cron job re-runs analysis on watchlisted companies every 24h and sends email/SMS alerts when the verdict changes.

11. **Fine-tuned analyst persona** — fine-tune a smaller open-source model on historical investment research reports to produce more domain-accurate, sector-specific language.

12. **Multi-agent architecture** — separate specialist agents per domain (a dedicated financial analyst agent, a news sentiment agent, a risk analyst agent) that debate and synthesize a final recommendation.

---

## 7. Bonus — LLM Chat Session Transcript

This entire project was built using **Google Antigravity IDE**, an AI coding assistant powered by Google Gemini and Claude. Every architectural decision, debugging session, and feature addition was executed through a live, real-time conversation with the AI.

### What the AI Built (end-to-end)

The AI was given a single master prompt describing the desired product and built the entire application from scratch — including:

- Next.js 16 project initialization and configuration
- LangGraph state machine with typed annotations
- Tavily parallel search tool integration
- Gemini 2.5 Flash structured JSON prompt engineering
- Full premium UI with dual theme system (warm yellow+teal / dark neon)
- MongoDB connection pool with silent memory fallback
- Custom SVG interactive leaderboard chart
- Sliding side panel with full historical report view

### Notable Debugging Moments (from the transcript)

| Issue | Root Cause | Resolution |
|-------|------------|------------|
| Gemini 404 errors on first run | `gemini-1.5-flash` model ID deprecated; `gemini-2.0-flash` quota blocked | Diagnosed via API diagnostic script; migrated to `gemini-2.5-flash` |
| LangGraph runtime crash | `'research' is already being used as a state channel` — naming collision between state key and graph node name | Renamed node from `'research'` to `'conductResearch'` |
| Next.js 16 build warning | `experimental.serverComponentsExternalPackages` removed in Next.js 16 | Migrated to `serverExternalPackages` in `next.config.ts` |
| TypeScript build failure | `catch (error)` typed as `unknown` — `.message` not accessible | Added `catch (error: any)` cast in `lib/db.ts` |

### Full Transcript

The complete, unedited AI chat session log — covering every message, file creation, command execution, and debugging step from project start to final feature completion — is saved in:

📄 **`TRANSCRIPT.md`** — located at the root of this repository (54,000+ words)

This transcript provides full insight into the thought process, approach, and iterative AI-assisted development workflow used to build this product.

---

*Document generated: June 2026*  
*Project directory: `c:\Users\shrey\Desktop\IIMtask`*
