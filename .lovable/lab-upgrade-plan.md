# THE LAB — UPGRADE PLAN

## 1. Current Snapshot
- **Route:** `/dashboard/the-lab` (TheLabPage.tsx)
- **Tabs:** Offers (4 strategy cards) + QR Code generator
- **Content:** First-Timer Magnet, Subscription Tiers, Referral Program, Add-On Upsells
- **Strengths:** Good pricing/offers content with templates, calculators, and progress tracking
- **Weaknesses:** Only covers pricing/offers (1 of 5 pillars). No marketing, operations, retention, hiring, or SEO content.

## 2. Content Diagnostic (Before)
| Pillar | Score | Notes |
|--------|-------|-------|
| Marketing & Demand | 1/10 | No SEO, social media, or review generation |
| Pricing & Packaging | 6/10 | 4 strategies with templates + calculators |
| Operations & CX | 0/10 | No scheduling, no-show, or communication content |
| Retention & LTV | 1/10 | Referral program exists but shallow |
| Business Building | 1/10 | No hiring, KPIs, or financial clarity |

## 3. New Information Architecture
- **Get Booked** — Local SEO, social media, irresistible offers
- **Raise Your Prices** — Pricing strategy, subscription tiers, upsells, price increases
- **Automate & Scale** — No-show prevention, time blocking, communication scripts, hiring
- **Keep Them Coming Back** — Follow-up sequences, referral programs, review generation
- **Tools & Templates** — Calculators, QR codes, KPI tracking

## 4. New Content Added (20 lessons)
- Google Business Profile setup checklist
- Review Generation System playbook
- 30-Day Social Content Calendar
- Front-End Offer Design lesson
- First-Timer Magnet Strategy (migrated)
- Subscription Tiers Builder (migrated)
- Price Increase Guide with templates
- Add-On Upsell System (migrated)
- No-Show Prevention: 3-Text Sequence
- Time Blocking for Max Revenue Days
- Customer Communication Scripts (inquiry, follow-up, objections)
- Hiring Your First Detailing Tech
- 3-Touch Follow-Up Sequence
- Referral Program: Give $25 Get $25 (migrated)
- Hourly Rate Calculator lesson
- 5 KPIs Every Detailer Should Track
- QR Code Setup & Distribution Guide

## 5. UX/Learning Experience Upgrades
- **Search:** Full-text search across all lessons by title, outcome, and tags
- **Filters:** By level (beginner/intermediate/advanced) and topic tags
- **Progress tracking:** Per-lesson completion checkmarks, per-category progress bars, overall progress
- **Start Here:** Banner for new users suggesting 3 quick-win lessons
- **Recommended Next:** Each lesson links to 2-3 logical follow-ups
- **Deep-links:** Action buttons link directly to dashboard features (services, calendar, etc.)

## 6. Files Modified/Created
- `src/data/lab-content.ts` — Central content config (categories, modules, lessons)
- `src/components/dashboard/TheLabPage.tsx` — Complete rewrite with new IA
- `src/components/dashboard/OfferLabManager.tsx` — Preserved (strategies migrated to new config)
- `src/components/dashboard/QrCodeTab.tsx` — Preserved, accessible from new Lab home

## 7. Integration Hooks
| Module | Deep-link | Action |
|--------|-----------|--------|
| Pricing lessons | /dashboard/services | "Update my services & pricing" |
| Time Blocking | /dashboard/calendar | "Set up my calendar blocks" |
| KPI Dashboard | /dashboard | "View my dashboard KPIs" |
| Add-On Upsells | /dashboard/services | "Set up my add-on services" |
