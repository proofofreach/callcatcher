[PRD]
# CallCatcher - Product Requirements Document

**Created**: 2026-01-25
**Status**: Draft
**Owner**: Product
**Clarity Score**: 89/100

---

## 1. Overview

### Problem Statement
Service businesses (plumbers, electricians, HVAC, salons) lose leads when they miss calls while on jobs. 60% of customers prefer calling businesses, but when no one answers, they call the competitor. Most SMBs have no automated way to engage missed callers before they move on.

**Research/Evidence**: Industry data shows 90% of consumers prefer texting over calling back; SMS has 55% open rate vs 20% for email.

### Goals
- Automatically send personalized text within 60 seconds of every missed call
- Enable two-way SMS threading so conversations continue naturally
- Provide simple visibility into missed calls and response rates
- Convert 25+ beta users to paying customers at $29/mo within 90 days

### Non-Goals (Out of Scope)
- Review request automation
- AI-powered responses or chatbots
- Multiple team members / shared inbox
- CRM integrations
- Email/WhatsApp/other channels
- Appointment booking or scheduling
- Number porting (MVP uses new Twilio numbers only)

---

## 2. Quality Gates

> Commands that MUST pass for every user story in this PRD.

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

---

## 3. User Stories

### US-001: User Registration with Magic Link

**As a** service business owner
**I want** to sign up using just my email address
**So that** I can get started quickly without remembering another password

**Acceptance Criteria:**
- [ ] Landing page has email input field and "Get Started" button
- [ ] Entering email sends magic link via Supabase Auth
- [ ] Magic link email arrives within 30 seconds
- [ ] Clicking link logs user in and redirects to onboarding
- [ ] Invalid email shows inline validation error
- [ ] Existing users clicking magic link go to dashboard

**Priority**: P0 (Must Have)

---

### US-002: Business Profile Setup

**As a** newly registered user
**I want** to enter my business name and hours
**So that** my auto-reply messages can be personalized

**Acceptance Criteria:**
- [ ] Onboarding form collects: business name (required), business hours (optional)
- [ ] Business hours uses simple format: "Mon-Fri 8am-6pm" text input
- [ ] Form validates business name is 2-100 characters
- [ ] Successful save proceeds to phone number provisioning
- [ ] User can skip hours (optional field)

**Priority**: P0 (Must Have)

---

### US-003: Phone Number Provisioning

**As a** new user completing onboarding
**I want** to receive a dedicated business phone number
**So that** I can start receiving calls and auto-texts

**Acceptance Criteria:**
- [ ] System detects user's location from IP or asks for ZIP code
- [ ] Twilio provisions local area code number automatically
- [ ] Number displays prominently: "Your new business number: (555) 123-4567"
- [ ] Instructions show: "Update your Google Business listing with this number"
- [ ] If provisioning fails, show error and retry button
- [ ] Number stored in user's account record

**Priority**: P0 (Must Have)

---

### US-004: Auto-Reply Message Customization

**As a** business owner
**I want** to customize the text message sent to missed callers
**So that** it sounds like my business and includes relevant info

**Acceptance Criteria:**
- [ ] Settings page shows message editor with live preview
- [ ] Default template: "Hi from {business_name}! Sorry we missed your call. We're open {hours}. How can we help?"
- [ ] Variables {business_name} and {hours} auto-populate from profile
- [ ] Character counter shows remaining (max 160 characters)
- [ ] Save button persists message to database
- [ ] If hours not set, {hours} variable omits that sentence

**Priority**: P0 (Must Have)

---

### US-005: Missed Call Detection and Auto-Text

**As a** service business owner
**I want** missed calls to automatically trigger a text to the caller
**So that** I never lose a lead while I'm busy on a job

**Acceptance Criteria:**
- [ ] Incoming call to Twilio number forwards to owner's personal phone
- [ ] Call rings for 20 seconds (configurable 10-30s in settings)
- [ ] If unanswered, Twilio webhook triggers auto-SMS to caller
- [ ] SMS sent within 60 seconds of call ending
- [ ] SMS uses customized message template with variables replaced
- [ ] SMS includes opt-out footer: "Reply STOP to opt out"
- [ ] Answered calls do NOT trigger auto-text
- [ ] Call and SMS logged in database

**Priority**: P0 (Must Have)

---

### US-006: Two-Way SMS Threading

**As a** business owner
**I want** to continue conversations via text after the auto-reply
**So that** I can help customers without them knowing it's routed

**Acceptance Criteria:**
- [ ] Customer replies to Twilio number
- [ ] Reply forwards to owner's personal phone via SMS
- [ ] Owner texts back from personal phone
- [ ] Reply routes through Twilio number to customer
- [ ] Customer sees consistent business number throughout
- [ ] All messages logged in conversation record
- [ ] Dashboard shows full conversation thread

**Priority**: P0 (Must Have)

---

### US-007: Dashboard - Stats Overview

**As a** business owner
**I want** to see my missed call statistics at a glance
**So that** I know how many leads I'm capturing

**Acceptance Criteria:**
- [ ] Dashboard header shows three stat cards: Today, This Week, This Month
- [ ] Each card shows: missed calls count, texts sent count
- [ ] Stats update in real-time (or on page refresh)
- [ ] Zero state shows "No missed calls yet - that's good!"
- [ ] Week = last 7 days rolling, Month = last 30 days rolling

**Priority**: P0 (Must Have)

---

### US-008: Dashboard - Conversations List

**As a** business owner
**I want** to see all my conversations in one place
**So that** I can review what customers are asking

**Acceptance Criteria:**
- [ ] Below stats, show scrollable list of conversations
- [ ] Each row shows: phone number (masked: ***-***-1234), last message preview, timestamp
- [ ] Sorted by most recent activity first
- [ ] Clicking row opens conversation detail view
- [ ] Unread/new conversations highlighted
- [ ] Empty state: "Conversations will appear here after your first missed call"

**Priority**: P0 (Must Have)

---

### US-009: Conversation Detail View

**As a** business owner
**I want** to view the full thread with a customer
**So that** I can see the complete conversation history

**Acceptance Criteria:**
- [ ] Shows all messages in chronological order (oldest first)
- [ ] Messages styled as chat bubbles (sent = right/blue, received = left/gray)
- [ ] Each message shows timestamp
- [ ] Auto-reply marked with subtle "Auto-reply" label
- [ ] Back button returns to conversations list
- [ ] Phone number shown at top (full number, not masked)

**Priority**: P1 (Should Have)

---

### US-010: Subscription and Billing Setup

**As a** user whose trial is ending
**I want** to enter payment details to continue service
**So that** my auto-replies keep working

**Acceptance Criteria:**
- [ ] Stripe Checkout integration for $29/mo subscription
- [ ] 14-day free trial, no card required to start
- [ ] Trial banner shows days remaining: "Trial: 7 days left"
- [ ] "Upgrade" button in dashboard opens Stripe Checkout
- [ ] Successful payment activates subscription
- [ ] Failed payment shows error, service continues during grace period
- [ ] Billing page shows current plan status and manage subscription link

**Priority**: P0 (Must Have)

---

### US-011: STOP Opt-Out Handling

**As a** customer who texted STOP
**I want** to stop receiving texts from this business
**So that** I'm not bothered if I'm no longer interested

**Acceptance Criteria:**
- [ ] Reply of "STOP" (case-insensitive) triggers opt-out
- [ ] System replies: "You've been unsubscribed. Reply START to resubscribe."
- [ ] Opted-out numbers stored in blocklist
- [ ] Future missed calls from opted-out numbers do NOT send auto-text
- [ ] Dashboard shows opt-out status on conversation
- [ ] "START" reply removes from blocklist

**Priority**: P0 (Must Have)

---

### US-012: Ring Duration Setting

**As a** business owner
**I want** to adjust how long my phone rings before auto-text triggers
**So that** I have enough time to answer if I'm nearby

**Acceptance Criteria:**
- [ ] Settings page has "Ring duration" slider or dropdown
- [ ] Options: 10, 15, 20, 25, 30 seconds
- [ ] Default: 20 seconds
- [ ] Change updates Twilio call handling immediately
- [ ] Help text: "How long should we try to reach you before texting the caller?"

**Priority**: P1 (Should Have)

---

### US-013: Personal Phone Number Configuration

**As a** business owner
**I want** to set which phone number receives forwarded calls
**So that** calls ring on my actual phone

**Acceptance Criteria:**
- [ ] Onboarding collects personal phone number
- [ ] Phone number validated (10 digits US format)
- [ ] Settings page allows updating personal number
- [ ] Change takes effect on next incoming call
- [ ] Verification SMS sent to confirm ownership (optional for MVP)

**Priority**: P0 (Must Have)

---

### US-014: Landing Page with Value Proposition

**As a** potential customer visiting the website
**I want** to understand what CallCatcher does and why I need it
**So that** I can decide to sign up

**Acceptance Criteria:**
- [ ] Hero section: headline, subheadline, email signup CTA
- [ ] Headline: "Never Lose a Lead to a Missed Call Again"
- [ ] How it works section: 3-step visual (miss call → auto-text → conversation)
- [ ] Pricing section: $29/mo, 100 SMS included, 14-day free trial
- [ ] Social proof section (placeholder for testimonials)
- [ ] Footer with basic links
- [ ] Mobile responsive

**Priority**: P0 (Must Have)

---

## 4. Functional Requirements

| ID | Requirement | Acceptance Criteria | Priority |
|----|-------------|---------------------|----------|
| FR-001 | Twilio number provisioning | Number created within 5 seconds of request | P0 |
| FR-002 | Call forwarding | Calls ring personal phone for configured duration | P0 |
| FR-003 | Auto-SMS on missed call | Text sent within 60 seconds of unanswered call | P0 |
| FR-004 | Two-way SMS routing | Replies route through Twilio to maintain business number | P0 |
| FR-005 | Magic link auth | Login link valid for 1 hour, single use | P0 |
| FR-006 | Message template variables | {business_name} and {hours} replaced at send time | P0 |
| FR-007 | Opt-out compliance | STOP/START keywords handled per TCPA | P0 |
| FR-008 | Stripe subscription | Recurring billing, trial management, webhook handling | P0 |

---

## 5. Technical Considerations

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **SMS/Voice**: Twilio Programmable Voice + SMS
- **Payments**: Stripe Checkout + Billing Portal
- **Hosting**: Vercel

### Integrations
- **Twilio**: Webhooks for call status, SMS inbound/outbound
- **Supabase Auth**: Magic link email delivery
- **Stripe**: Checkout sessions, subscription webhooks

### Constraints
- SMS message limit: 160 characters (1 segment)
- Twilio webhook latency: Must process within 15 seconds
- Trial period: 14 days, enforced server-side

### Data Model (Core Tables)

```
users
  - id, email, created_at, trial_ends_at, subscription_status

profiles
  - user_id, business_name, business_hours, personal_phone, twilio_number

messages
  - id, user_id, customer_phone, direction (inbound/outbound), body, is_auto_reply, created_at

calls
  - id, user_id, customer_phone, status (missed/answered), duration, created_at

opt_outs
  - user_id, phone_number, created_at
```

---

## 6. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Beta signups | 50 users | Supabase user count |
| Trial → Paid conversion | 50% (25+ paying) | Stripe subscription count |
| Month-1 retention | 80%+ | Stripe churn tracking |
| Auto-text delivery rate | 99%+ | Twilio delivery reports |
| Time to first auto-text | <60 seconds | Timestamp delta logging |

---

## 7. Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| Twilio account with Voice + SMS | External | Ready | Dev |
| Stripe account | External | Ready | Dev |
| Supabase project | External | Ready | Dev |
| Domain name | External | Needed | Product |
| Vercel deployment | Technical | Ready | Dev |

---

## 8. Assumptions Log

| ID | Assumption | Risk Level | Validation Plan |
|----|------------|------------|-----------------|
| A-001 | Users will update Google Business listing with new number | Medium | Ask during beta feedback |
| A-002 | 160 char limit sufficient for most auto-replies | Low | Monitor message truncation |
| A-003 | 20-second default ring time is appropriate | Low | A/B test with users |
| A-004 | Service businesses check texts regularly | Low | Industry data supports this |
| A-005 | $29/mo price point acceptable | Medium | Beta conversion rate will validate |

---

## 9. Open Questions

- [ ] Should we support Canadian phone numbers in MVP or US-only?
- [ ] Do we need email notifications for new conversations or SMS-only?
- [ ] Should dashboard have real-time updates (WebSocket) or refresh-based?

---

## 10. Appendix

### Glossary
- **Auto-reply**: The automated text message sent when a call is missed
- **Two-way threading**: Routing replies so customer sees consistent business number
- **Opt-out**: Customer requesting to stop receiving texts (TCPA compliance)

### References
- [Twilio Programmable Voice](https://www.twilio.com/docs/voice)
- [Twilio SMS](https://www.twilio.com/docs/sms)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Stripe Billing](https://stripe.com/docs/billing)

[/PRD]
