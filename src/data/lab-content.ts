/**
 * THE LAB — Content Configuration
 * Central data source for all Lab categories, modules, and lessons.
 * 
 * === NEW LAB STRUCTURE (IA) ===
 * 
 * Category 1: Get Booked
 *   - Modules about generating demand and filling your calendar
 * 
 * Category 2: Raise Your Prices
 *   - Pricing strategies, packaging, memberships, upsells
 * 
 * Category 3: Automate & Scale
 *   - Operations, automations, hiring, systems
 * 
 * Category 4: Keep Them Coming Back
 *   - Retention, reviews, referrals, LTV
 * 
 * Category 5: Tools & Templates
 *   - QR codes, calculators, scripts, checklists
 */

import {
  Megaphone, MapPin, Video, Star, Gift,
  DollarSign, Layers, Crown, Plus, TrendingUp,
  Cog, UserPlus, MessageSquare, Zap,
  Heart, Mail, Users, BarChart3, RefreshCw,
  QrCode, Calculator, FileText, ClipboardCheck, Rocket,
  Target, Shield, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LessonType = "lesson" | "checklist" | "script" | "calculator" | "recipe" | "playbook";
export type LessonLevel = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  level: LessonLevel;
  tags: string[];
  outcome: string;
  estimatedMinutes: number;
  icon: React.ComponentType<{ className?: string }>;
  /** deep-link into the main app (e.g. /dashboard/services) */
  actionLink?: string;
  actionLabel?: string;
  /** content sections — rendered in the lesson detail view */
  sections: {
    heading: string;
    body: string; // markdown-ish, supports basic formatting
    template?: string; // copyable template block
    templateLabel?: string;
  }[];
  /** "recommended next" lesson IDs */
  nextLessons?: string[];
}

export interface Module {
  id: string;
  title: string;
  promise: string; // "What you'll get"
  lessons: Lesson[];
}

export interface LabCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // HSL accent
  modules: Module[];
}

// ─── Content ──────────────────────────────────────────────────────────────────

export const LAB_CATEGORIES: LabCategory[] = [
  // ═══════════════════════════════════════════════════════════════
  // CATEGORY 1: GET BOOKED
  // ═══════════════════════════════════════════════════════════════
  {
    id: "get-booked",
    title: "Get Booked",
    description: "Fill your calendar with high-value customers",
    icon: Megaphone,
    color: "hsl(217,91%,60%)",
    modules: [
      {
        id: "local-seo",
        title: "Local SEO & Google",
        promise: "Show up first when people search for detailing near them.",
        lessons: [
          {
            id: "gbp-setup",
            title: "Set Up Google Business Profile in 30 Minutes",
            type: "checklist",
            level: "beginner",
            tags: ["SEO", "Google", "Marketing"],
            outcome: "A fully optimized Google Business listing that ranks for local searches.",
            estimatedMinutes: 30,
            icon: MapPin,
            sections: [
              {
                heading: "Why This Matters",
                body: "90% of customers search Google before booking. If you're not on Google Business Profile (GBP), you're invisible to them. A complete profile gets 7x more clicks than an incomplete one.",
              },
              {
                heading: "Step-by-Step Checklist",
                body: "□ Go to business.google.com and claim your business\n□ Verify via postcard, phone, or email\n□ Add your exact business name (no keyword stuffing)\n□ Set your service area (radius or zip codes)\n□ Choose primary category: 'Auto Detailing Service'\n□ Add secondary categories: 'Car Wash', 'Window Tinting'\n□ Upload at least 10 photos of your work\n□ Write a 750-character description with your city + services\n□ Add your booking link from your Darker website\n□ Set your business hours\n□ Add your phone number\n□ Post your first Google update (before/after photo)",
              },
              {
                heading: "Pro Tips",
                body: "→ Post a before/after photo every week to stay active\n→ Ask every customer to leave a Google review (use our review script)\n→ Respond to EVERY review — even bad ones\n→ Add Q&A to your profile (ask yourself common questions and answer them)",
              },
            ],
            nextLessons: ["review-generation", "social-content"],
          },
          {
            id: "review-generation",
            title: "The Review Generation System",
            type: "playbook",
            level: "beginner",
            tags: ["Reviews", "Google", "Marketing"],
            outcome: "A repeatable system that generates 5+ new Google reviews per week.",
            estimatedMinutes: 20,
            icon: Star,
            sections: [
              {
                heading: "The 3-Touch Review System",
                body: "Most customers are happy to leave a review — they just forget. This system makes it automatic:\n\n1. **Text at pickup**: Send immediately when they see the car\n2. **Follow-up text 24h later**: Quick reminder for those who didn't\n3. **Email 3 days later**: Final nudge with a direct link",
              },
              {
                heading: "Review Request SMS",
                body: "Send this right when the customer picks up their car:",
                template: "Hey [NAME]! Thanks for choosing [BUSINESS]. Your car looks amazing 🔥 Would you mind leaving us a quick Google review? It really helps us out: [GOOGLE_REVIEW_LINK]\n\nThanks so much!",
                templateLabel: "Copy SMS Template",
              },
              {
                heading: "24-Hour Follow-Up",
                body: "For customers who haven't reviewed yet:",
                template: "Hey [NAME], hope you're loving that fresh detail! If you have 30 seconds, a Google review would mean the world to us: [GOOGLE_REVIEW_LINK] 🙏",
                templateLabel: "Copy Follow-Up",
              },
              {
                heading: "How To Handle Bad Reviews",
                body: "→ Never argue publicly\n→ Respond within 24 hours\n→ Acknowledge the issue, apologize, offer to make it right\n→ Take the conversation offline (DM or call)\n→ If you fix it, politely ask if they'd update the review",
              },
            ],
            nextLessons: ["gbp-setup", "referral-engine"],
          },
        ],
      },
      {
        id: "social-marketing",
        title: "Social Media Playbook",
        promise: "Turn TikTok and Instagram into your #1 booking source.",
        lessons: [
          {
            id: "social-content",
            title: "30-Day Content Calendar for Detailers",
            type: "playbook",
            level: "beginner",
            tags: ["TikTok", "Instagram", "Marketing"],
            outcome: "A month of content ideas you can post without overthinking.",
            estimatedMinutes: 15,
            icon: Video,
            sections: [
              {
                heading: "The 4 Content Pillars",
                body: "Every piece of content should fit one of these:\n\n1. **Transformations** — Before/after videos and photos\n2. **Education** — Tips customers didn't know they needed\n3. **Behind the scenes** — Your process, your products, your day\n4. **Social proof** — Reviews, customer reactions, testimonials",
              },
              {
                heading: "Week 1 Calendar",
                body: "Mon: Before/after Reel of your best detail this week\nTue: 'Why ceramic coating is worth it' educational post\nWed: Time-lapse of a full detail process\nThu: Screenshot a 5-star review + thank the customer\nFri: 'Is this the dirtiest car we've seen?' challenge content\nSat: Post a Story showing your Saturday lineup\nSun: Rest or post a personal photo of you with a car",
              },
              {
                heading: "Weeks 2-4",
                body: "Repeat the same pillars with new content:\n→ Week 2: Focus on interior shots, pet hair removal, stain removal\n→ Week 3: Seasonal angle (winter protection, summer prep, etc.)\n→ Week 4: Customer spotlight + behind the scenes of a big job",
              },
              {
                heading: "Hashtag Strategy",
                body: "Always use:\n#autodetailing #[yourcity]detailing #carcare #mobiledetailing #ceramiccoating\n\nPlus 2-3 trending sounds/songs for Reels/TikTok.\n\nPost at peak times: 7-9 AM, 12-1 PM, 6-8 PM in your timezone.",
              },
            ],
            nextLessons: ["offer-design"],
          },
        ],
      },
      {
        id: "offer-design",
        title: "Irresistible Offers",
        promise: "Create front-end offers that convert strangers into paying customers.",
        lessons: [
          {
            id: "offer-design",
            title: "Design Your First Front-End Offer",
            type: "lesson",
            level: "beginner",
            tags: ["Marketing", "Pricing", "Offers"],
            outcome: "A compelling intro offer that gets new customers through the door.",
            estimatedMinutes: 20,
            icon: Gift,
            sections: [
              {
                heading: "What's a Front-End Offer?",
                body: "A front-end offer is a low-risk, high-value deal designed to get new customers to try you. You might break even — or even lose a little — but you make it back on repeat business and upsells.\n\nExamples:\n→ \"First detail 50% off when you sign up for monthly\"\n→ \"$49 express detail — new customers only\"\n→ \"Free interior refresh with any exterior package\"",
              },
              {
                heading: "The Perfect Offer Formula",
                body: "1. **Pick your most popular service** (usually a full detail)\n2. **Discount it 30-50%** for first-timers only\n3. **Attach a membership upsell** (\"Keep this price monthly\")\n4. **Add urgency** (\"This week only\" or \"First 10 customers\")\n5. **Remove risk** (\"100% satisfaction guaranteed\")",
              },
              {
                heading: "Booking Page Text",
                body: "Use this on your website or booking page:",
                template: "🎯 New Customer Special\n\nGet your first [SERVICE] for just $[PRICE] (reg. $[FULL_PRICE]).\n\n✓ Full [SERVICE] included\n✓ 100% satisfaction guaranteed\n✓ Lock in this rate with monthly membership\n\nBook now — only [X] spots left this week.",
                templateLabel: "Copy Offer Template",
              },
            ],
            actionLink: "/dashboard/services",
            actionLabel: "Set up your services & pricing",
            nextLessons: ["first-timer-magnet", "social-content"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY 2: RAISE YOUR PRICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: "raise-prices",
    title: "Raise Your Prices",
    description: "Charge what you're worth and increase revenue per job",
    icon: DollarSign,
    color: "hsl(142,71%,45%)",
    modules: [
      {
        id: "pricing-strategy",
        title: "Pricing & Packaging",
        promise: "Structure your prices so customers choose your most profitable options.",
        lessons: [
          {
            id: "first-timer-magnet",
            title: "First-Timer Magnet Strategy",
            type: "lesson",
            level: "beginner",
            tags: ["Pricing", "Offers", "Membership"],
            outcome: "Convert new customers into paying members on a quarterly schedule.",
            estimatedMinutes: 15,
            icon: Target,
            sections: [
              {
                heading: "Overview",
                body: "**Why it works:** Removes the price barrier for new customers while locking them into recurring revenue immediately.\n\n**Expected results:** 65–80% of first-time customers convert to monthly members.",
              },
              {
                heading: "How to Structure",
                body: "→ Offer the first detail at 50% off\n→ Enroll them in a quarterly plan (1 detail every 3 months)\n→ Example: $75 first detail → $120/quarter (billed every 90 days)\n→ Most customers don't need detailing every month — quarterly keeps them committed without feeling forced\n→ Customer can cancel anytime — no contracts",
              },
              {
                heading: "Booking Page Template",
                body: "Use this on your website:",
                template: "🎉 First-Time Customer Special\n\nGet 50% off your first detail + lock in our quarterly membership rate.\n\nFirst Detail: Just $[HALF_PRICE] (Reg. $[FULL_PRICE])\nThen: $[QUARTERLY_PRICE]/quarter — 1 premium detail every 3 months\n\nMost clients need detailing every season. Stay consistent, cancel anytime.",
                templateLabel: "Copy Template",
              },
              {
                heading: "SMS Template",
                body: "Send to new leads:",
                template: "[BUSINESS_NAME]: First detail 50% off + quarterly membership! $[HALF_PRICE] first visit, then $[QUARTERLY_PRICE] every 3 months. Book: [LINK]",
                templateLabel: "Copy SMS",
              },
            ],
            actionLink: "/dashboard/services",
            actionLabel: "Update my services & pricing",
            nextLessons: ["subscription-tiers", "add-on-upsells"],
          },
          {
            id: "subscription-tiers",
            title: "Build Subscription Tiers (Bronze/Silver/Gold)",
            type: "lesson",
            level: "intermediate",
            tags: ["Pricing", "Membership", "Upsells"],
            outcome: "Offer the right plan for every customer — from seasonal to frequent.",
            estimatedMinutes: 20,
            icon: Layers,
            sections: [
              {
                heading: "Overview",
                body: "**Why it works:** Customers self-select their value level. 30–40% choose mid-tier, 15–20% choose top-tier — increasing your average order value by 40%.",
              },
              {
                heading: "Tier Structure",
                body: "→ 🥉 Bronze — 1 detail every 3 months (quarterly) at $[price]\n→ 🥈 Silver — 1 detail per month at $[price] (BEST VALUE)\n→ 🥇 Gold — 2 details per month + unlimited express washes at $[price]\n\nBronze captures the seasonal client. Silver locks in the regulars. Gold is for enthusiasts who live in their car.",
              },
              {
                heading: "Booking Page Template",
                body: "Put this on your site:",
                template: "Choose the Plan That Fits Your Life\n\n🥉 Bronze — Quarterly Plan\n  • 1 full detail every 3 months\n  • Perfect for: daily drivers, seasonal care\n\n🥈 Silver — Monthly Plan (BEST VALUE)\n  • 1 full detail every month\n  • Perfect for: car lovers, high-traffic vehicles\n\n🥇 Gold — Premium Monthly\n  • 2 full details per month\n  • Unlimited express washes\n  • Perfect for: enthusiasts, show cars, fleet\n\nAll plans include priority scheduling. Cancel anytime.",
                templateLabel: "Copy Template",
              },
            ],
            actionLink: "/dashboard/services",
            actionLabel: "Set up my service tiers",
            nextLessons: ["price-increase", "add-on-upsells"],
          },
          {
            id: "price-increase",
            title: "How to Raise Your Prices (Without Losing Customers)",
            type: "lesson",
            level: "intermediate",
            tags: ["Pricing", "Communication"],
            outcome: "Confidently increase prices by 15-30% while keeping your best customers.",
            estimatedMinutes: 15,
            icon: TrendingUp,
            sections: [
              {
                heading: "When to Raise Prices",
                body: "You should raise prices if:\n→ You're booked 2+ weeks out consistently\n→ You haven't raised in 6+ months\n→ Your supply costs have gone up\n→ You're doing better work than when you started\n→ You'd need to work less to make the same money\n\n**Rule of thumb:** If you're not losing 10-15% of leads on price, you're too cheap.",
              },
              {
                heading: "The 30-Day Price Increase Plan",
                body: "**Day 1:** Decide your new prices (15-30% increase)\n**Day 3:** Update prices on your website and booking system\n**Day 7:** Email existing customers with a \"loyalty lock-in\" offer\n**Day 14:** New prices go live for everyone\n**Day 30:** Review — you should see higher revenue even with slightly fewer bookings",
              },
              {
                heading: "Customer Email Template",
                body: "Send this to existing customers before the increase:",
                template: "Subject: A quick heads-up from [BUSINESS_NAME]\n\nHey [NAME],\n\nStarting [DATE], our prices are going up to reflect the quality products and extra care we put into every detail.\n\nBut because you're already a customer, I want to give you a chance to lock in your current rate:\n\n→ Book your next detail before [DATE] and keep today's pricing\n→ Or sign up for a monthly membership and your rate never changes\n\nBook now: [LINK]\n\nThanks for trusting us with your car.\n\n— [YOUR_NAME]",
                templateLabel: "Copy Email Template",
              },
            ],
            actionLink: "/dashboard/services",
            actionLabel: "Update my prices now",
            nextLessons: ["first-timer-magnet", "hourly-rate-calc"],
          },
        ],
      },
      {
        id: "upsells-addons",
        title: "Upsells & Add-Ons",
        promise: "Boost revenue 30% per job without booking more appointments.",
        lessons: [
          {
            id: "add-on-upsells",
            title: "Add-On Upsell System",
            type: "recipe",
            level: "beginner",
            tags: ["Upsells", "Revenue", "Automation"],
            outcome: "40-50% of customers add at least one upsell per booking.",
            estimatedMinutes: 15,
            icon: Plus,
            sections: [
              {
                heading: "Overview",
                body: "**Why it works:** Increases revenue per job by 30% without booking more appointments. 40–50% of customers add at least one upsell when offered at the right time.",
              },
              {
                heading: "How to Structure",
                body: "→ Offer 2–3 add-ons in the booking confirmation\n→ Offer again in the day-before reminder\n→ Common add-ons: Ceramic coating ($200), Interior deep clean ($80), Headlight restoration ($60)\n→ Always frame as \"enhance your detail\" not \"spend more\"",
              },
              {
                heading: "Booking Confirmation Template",
                body: "Add this to your confirmation message:",
                template: "💡 Enhance Your Detail\n\nAdd any of these before your appointment:\n\n• Ceramic Coating — $200 (6-month protection)\n• Interior Deep Clean — $80 (stain removal + steam)\n• Headlight Restoration — $60 (crystal clear)\n\nReply to add, or update your booking: [LINK]",
                templateLabel: "Copy Template",
              },
              {
                heading: "Day-Before Reminder SMS",
                body: "Send this the day before their appointment:",
                template: "[BUSINESS]: Your detail is tomorrow at [TIME]! Add ceramic coating for $200? Protects your car 6 months. Reply YES to add.",
                templateLabel: "Copy SMS",
              },
            ],
            actionLink: "/dashboard/services",
            actionLabel: "Set up my add-on services",
            nextLessons: ["subscription-tiers", "follow-up-system"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY 3: AUTOMATE & SCALE
  // ═══════════════════════════════════════════════════════════════
  {
    id: "automate-scale",
    title: "Automate & Scale",
    description: "Work smarter with systems, processes, and people",
    icon: Cog,
    color: "hsl(45,93%,58%)",
    modules: [
      {
        id: "operations",
        title: "Operations Playbook",
        promise: "Run your shop like a machine — no dropped balls, no chaos.",
        lessons: [
          {
            id: "no-show-prevention",
            title: "Kill No-Shows: The 3-Text Sequence",
            type: "recipe",
            level: "beginner",
            tags: ["Operations", "Automation", "SMS"],
            outcome: "Reduce no-shows from 15-20% down to under 3%.",
            estimatedMinutes: 10,
            icon: MessageSquare,
            sections: [
              {
                heading: "The Problem",
                body: "The average detailer loses $500-$1,500/month to no-shows and last-minute cancellations. Here's the fix — a 3-text reminder sequence that takes 5 minutes to set up.",
              },
              {
                heading: "Text 1: Booking Confirmation (Immediate)",
                body: "Sent automatically when they book:",
                template: "✅ Confirmed! [NAME], your [SERVICE] with [BUSINESS] is booked for [DATE] at [TIME].\n\nAddress: [ADDRESS]\n\nNeed to reschedule? Reply to this text or call [PHONE].",
                templateLabel: "Copy Confirmation",
              },
              {
                heading: "Text 2: Day-Before Reminder",
                body: "Sent 24 hours before the appointment:",
                template: "Hey [NAME]! Quick reminder — your detail is tomorrow at [TIME]. We'll see you at [ADDRESS]. Reply CONFIRM to lock it in. 🚗✨",
                templateLabel: "Copy Reminder",
              },
              {
                heading: "Text 3: Morning-Of Heads Up",
                body: "Sent 2 hours before:",
                template: "[BUSINESS]: Heads up — [NAME], we'll be ready for your [SERVICE] at [TIME] today. See you soon! 🔥",
                templateLabel: "Copy Morning Text",
              },
              {
                heading: "Pro Tips",
                body: "→ Require a deposit ($25-50) at booking to drastically reduce no-shows\n→ Have a waitlist so you can fill cancelled slots quickly\n→ Track your no-show rate weekly — it should be under 5%",
              },
            ],
            nextLessons: ["hiring-first-tech"],
          }
        ],
      },
      {
        id: "growth",
        title: "Growing Your Team",
        promise: "Hire your first helper and start scaling beyond solo.",
        lessons: [
          {
            id: "hiring-first-tech",
            title: "Hiring Your First Detailing Tech",
            type: "lesson",
            level: "advanced",
            tags: ["Hiring", "Scaling", "Operations"],
            outcome: "Know exactly when and how to hire, train, and pay your first employee.",
            estimatedMinutes: 25,
            icon: UserPlus,
            sections: [
              {
                heading: "When to Hire",
                body: "You're ready to hire when:\n→ You're turning down jobs because you're fully booked\n→ You're consistently making $8k+/month solo\n→ You have systems (booking, reminders, follow-ups) that run without you\n→ You can afford $2-3k/month for an employee\n\n**Warning signs you're NOT ready:**\n→ You're not consistently booked out\n→ You don't have documented processes\n→ You can't explain your detailing steps clearly",
              },
              {
                heading: "Where to Find Techs",
                body: "→ Facebook groups (auto detailing communities)\n→ Indeed / Craigslist (\"auto detailing technician\")\n→ Local trade schools\n→ Ask your best customers if they know anyone\n→ Instagram DMs to people posting car content\n\n**Red flags in interviews:**\n→ No car experience at all\n→ Can't commit to a schedule\n→ Doesn't ask questions about your process",
              },
              {
                heading: "Pay Structure",
                body: "**Option A: Hourly**\n→ Start at $15-20/hour + tips\n→ Simple, predictable for you\n\n**Option B: Commission**\n→ 30-40% of each job\n→ Motivates them to upsell\n\n**Option C: Hybrid**\n→ $12/hour base + 15% commission\n→ Best of both worlds\n\n**Pro tip:** Start with a 2-week trial period. Have them shadow you for 3 days, then handle easy jobs solo while you supervise.",
              },
            ],
            nextLessons: ["kpi-dashboard"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY 4: KEEP THEM COMING BACK
  // ═══════════════════════════════════════════════════════════════
  {
    id: "retention",
    title: "Keep Them Coming Back",
    description: "Turn one-time customers into lifelong revenue",
    icon: Heart,
    color: "hsl(340,82%,55%)",
    modules: [
      {
        id: "retention-systems",
        title: "Retention & Repeat Business",
        promise: "Build automated systems that bring customers back without you chasing them.",
        lessons: [
          {
            id: "follow-up-system",
            title: "The 3-Touch Follow-Up Sequence",
            type: "recipe",
            level: "beginner",
            tags: ["Retention", "Automation", "SMS"],
            outcome: "Reactivate 25-40% of past customers with automated follow-ups.",
            estimatedMinutes: 10,
            icon: Mail,
            sections: [
              {
                heading: "The Strategy",
                body: "After every job, run this 3-touch sequence:\n\n1. **Day 0** — Post-service thank you + review request\n2. **Day 90** — \"Your car might be due for its seasonal refresh\" reminder\n3. **Day 120** — Special comeback offer if they still haven't booked",
              },
              {
                heading: "Day 0: Thank You + Review",
                body: "Send 2 hours after the job:",
                template: "Hey [NAME]! Your [SERVICE] is done and your car looks incredible 🔥 If you loved it, would you leave us a quick review? [REVIEW_LINK]\n\nThanks for choosing [BUSINESS]!",
                templateLabel: "Copy Day-0 Text",
              },
              {
                heading: "Day 90: Seasonal Refresh Reminder",
                body: "Automated 90 days later:",
                template: "Hey [NAME]! It's been about 3 months since your last detail — perfect timing for a seasonal refresh 🧽 Cars pick up a lot between services. Get yours looking sharp again: [BOOKING_LINK]\n\n— [BUSINESS]",
                templateLabel: "Copy Day-90 Text",
              },
              {
                heading: "Day 120: Special Comeback Offer",
                body: "If they still haven't booked by day 120, send this:",
                template: "Hey [NAME], it's been a while — we'd love to get your car back in top shape 🚗✨ Here's 15% off your next detail as a special comeback offer. Use code COMEBACK at checkout: [BOOKING_LINK]\n\nOffer expires in 7 days.\n\n— [BUSINESS]",
                templateLabel: "Copy Day-120 Text",
              },
            ],
            nextLessons: ["referral-engine", "review-generation"],
          },
          {
            id: "referral-engine",
            title: "Referral Program: Give $25, Get $25",
            type: "recipe",
            level: "beginner",
            tags: ["Referrals", "Growth", "Retention"],
            outcome: "Each customer brings 2.3 new customers within 90 days.",
            estimatedMinutes: 15,
            icon: Users,
            sections: [
              {
                heading: "Overview",
                body: "**Why it works:** Turns happy customers into your best salespeople with built-in incentives.\n\n**Expected results:** Each customer brings an average of 2.3 new customers within 90 days.",
              },
              {
                heading: "How to Structure",
                body: "→ Existing customer refers a friend\n→ Friend gets $25 off their first service\n→ Referring customer gets $25 credit\n→ Generate unique referral codes per customer\n→ No limit on referrals",
              },
              {
                heading: "SMS to Existing Customers",
                body: "Send this after a great service:",
                template: "[BUSINESS]: Love your clean car? Share the love! Give a friend $25 off their first detail and you get $25 credit. Your link: [REFERRAL_LINK] 🎁",
                templateLabel: "Copy Referral SMS",
              },
              {
                heading: "Email to New Referral",
                body: "Send to the referred friend:",
                template: "Subject: [REFERRER] sent you $25 off at [BUSINESS]\n\nHey!\n\nYour friend [REFERRER] thinks you'd love [BUSINESS]. They're giving you $25 off your first detail!\n\nBook now: [BOOKING_LINK]\nUse code: [CODE]\n\n— [BUSINESS]",
                templateLabel: "Copy Referral Email",
              },
            ],
            nextLessons: ["follow-up-system", "review-generation"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY 5: TOOLS & TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tools",
    title: "Tools & Templates",
    description: "Calculators, QR codes, scripts, and checklists",
    icon: Sparkles,
    color: "hsl(280,60%,60%)",
    modules: [
      {
        id: "calculators",
        title: "Business Calculators",
        promise: "Know your numbers — pricing, revenue goals, and profitability.",
        lessons: [
          {
            id: "hourly-rate-calc",
            title: "What Should I Actually Charge? (Hourly Rate Calculator)",
            type: "calculator",
            level: "beginner",
            tags: ["Pricing", "Calculator", "Business"],
            outcome: "Know your true hourly rate and whether your pricing is profitable.",
            estimatedMinutes: 10,
            icon: Calculator,
            sections: [
              {
                heading: "How to Calculate Your Real Hourly Rate",
                body: "Most detailers think they're making $50-75/hour but they're really making $20-30 once you factor in:\n\n→ Drive time between jobs\n→ Product costs (15-20% of service price)\n→ Supplies & equipment wear\n→ Unbillable time (quoting, messaging, admin)\n\n**Formula:** (Total Revenue - Product Costs - Gas) ÷ Total Hours Worked = Real Hourly Rate",
              },
              {
                heading: "Target Rates by Market",
                body: "→ **Small town / rural:** $40-60/hour target\n→ **Suburban:** $60-85/hour target\n→ **Urban / luxury market:** $85-150/hour target\n\nIf you're below these, raise your prices using our price increase guide.",
              },
              {
                heading: "Quick Math",
                body: "If you want to make $100k/year:\n→ Working 50 weeks × 5 days = 250 working days\n→ $100,000 ÷ 250 = $400/day needed\n→ At 6 billable hours/day = ~$67/hour minimum\n→ Factor in 25% costs = charge at least $90/hour",
              },
            ],
            nextLessons: ["kpi-dashboard", "price-increase"],
          },
          {
            id: "kpi-dashboard",
            title: "5 KPIs Every Detailer Should Track Weekly",
            type: "lesson",
            level: "intermediate",
            tags: ["Business", "KPIs", "Data"],
            outcome: "Make smarter decisions by tracking 5 simple numbers every week.",
            estimatedMinutes: 10,
            icon: BarChart3,
            sections: [
              {
                heading: "The 5 KPIs",
                body: "Track these every Sunday night:\n\n1. **Revenue this week** — Total dollars collected\n2. **Jobs completed** — Number of cars detailed\n3. **Average ticket** — Revenue ÷ Jobs = how much per car\n4. **Show-up rate** — (Jobs completed ÷ Jobs booked) × 100\n5. **New vs. repeat** — What % of this week's jobs were repeat customers?",
              },
              {
                heading: "What Good Looks Like",
                body: "→ **Average ticket:** $150+ for mobile, $250+ for shop\n→ **Show-up rate:** 95%+ (if below, fix your reminder sequence)\n→ **Repeat rate:** 30%+ (if below, fix your follow-up sequence)\n→ **Weekly revenue:** Trending up month over month",
              },
              {
                heading: "Use Your Dashboard",
                body: "Your Darker dashboard already tracks most of these. Check it every Monday morning and ask yourself:\n\n→ Is my average ticket going up or down?\n→ Am I getting enough repeat customers?\n→ Where did my no-shows come from?\n\nThe numbers tell you exactly what to fix next.",
              },
            ],
            actionLink: "/dashboard",
            actionLabel: "View my dashboard KPIs",
            nextLessons: ["hourly-rate-calc"],
          },
        ],
      },
      {
        id: "qr-tools",
        title: "QR Code & Marketing Tools",
        promise: "Print-ready QR codes and shareable links for your business.",
        lessons: [
          {
            id: "qr-code-setup",
            title: "Generate & Share Your QR Code",
            type: "recipe",
            level: "beginner",
            tags: ["Marketing", "QR Code", "Tools"],
            outcome: "A print-ready QR code that links directly to your booking page.",
            estimatedMinutes: 5,
            icon: QrCode,
            sections: [
              {
                heading: "What to Do With Your QR Code",
                body: "→ Print it on business cards\n→ Put it on a car window cling\n→ Add it to flyers at car meets\n→ Tape it to your van or trailer\n→ Include it in thank-you cards after each detail\n→ Post it at local businesses (barber shops, gyms)\n\nEvery scan = a potential booking.",
              },
            ],
            // This lesson opens the QR tab
            nextLessons: ["social-content", "offer-design"],
          },
        ],
      },
    ],
  },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

/** Flatten all lessons across all categories */
export function getAllLessons(): (Lesson & { categoryId: string; moduleId: string })[] {
  const result: (Lesson & { categoryId: string; moduleId: string })[] = [];
  for (const cat of LAB_CATEGORIES) {
    for (const mod of cat.modules) {
      for (const lesson of mod.lessons) {
        result.push({ ...lesson, categoryId: cat.id, moduleId: mod.id });
      }
    }
  }
  return result;
}

/** Find a lesson by ID */
export function findLesson(id: string) {
  for (const cat of LAB_CATEGORIES) {
    for (const mod of cat.modules) {
      const lesson = mod.lessons.find(l => l.id === id);
      if (lesson) return { lesson, module: mod, category: cat };
    }
  }
  return null;
}

/** Get all unique tags */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const l of getAllLessons()) l.tags.forEach(t => tags.add(t));
  return Array.from(tags).sort();
}

/** Total lesson count */
export function getTotalLessonCount(): number {
  return getAllLessons().length;
}
