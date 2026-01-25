if prd.json is empty, run /prd-builder with brief.md then /ralph-prd-to-json
otherwise pick highest priority story where passes: false

IMPORTANT:
- use standard patterns for unknown development
- run echo 'no tests configured' && echo 'no build configured' after changes
- for UI stories, verify with agent-browser before marking complete
- set passes: true only when fully verified
- commit: feat: [Story ID] - [Title]
- when all stories pass, output LOOP_COMPLETE

---

## All Stories Complete ✅

All 20 user stories have `passes: true`:

| Story | Title | Status |
|-------|-------|--------|
| US-001 | Initialize Next.js project with Supabase and Tailwind | ✅ |
| US-002 | Create database schema and migrations | ✅ |
| US-003 | Implement Magic Link authentication | ✅ |
| US-004 | Create landing page with email signup | ✅ |
| US-005 | Create onboarding flow - business profile form | ✅ |
| US-006 | Implement Twilio number provisioning | ✅ |
| US-007 | Create phone provisioning UI | ✅ |
| US-008 | Implement Twilio voice webhook for call handling | ✅ |
| US-009 | Implement missed call detection and auto-text | ✅ |
| US-010 | Implement two-way SMS routing | ✅ |
| US-011 | Implement STOP/START opt-out handling | ✅ |
| US-012 | Create dashboard layout and stats overview | ✅ |
| US-013 | Create conversations list component | ✅ |
| US-014 | Create conversation detail view | ✅ |
| US-015 | Create settings page with message customization | ✅ |
| US-016 | Add ring duration setting | ✅ |
| US-017 | Implement Stripe subscription integration | ✅ |
| US-018 | Add trial banner and upgrade UI | ✅ |
| US-019 | Add personal phone number update to settings | ✅ |
| US-020 | Add opt-out status to conversation view | ✅ |

### Summary

CallCatcher MVP is complete with:

1. **Foundation**: Next.js 14 + Supabase + Tailwind, database schema with RLS, Magic Link auth
2. **Landing & Onboarding**: Landing page with email signup, business profile form, Twilio number provisioning
3. **Call/SMS Handling**: Voice webhook with call forwarding, missed call auto-text, two-way SMS routing, STOP/START opt-outs
4. **Dashboard**: Stats overview (Today/Week/Month), conversations list with masking, conversation detail view
5. **Settings**: Message template customization with preview, ring duration control, personal phone update
6. **Billing**: Stripe subscription integration ($29/mo), trial banner with upgrade flow

**LOOP_COMPLETE**
