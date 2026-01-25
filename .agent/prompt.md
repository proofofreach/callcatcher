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

## Completed: US-006 - Implement Twilio number provisioning

### Status: COMPLETE ✅

### What was implemented:
1. Installed `twilio` package
2. Created `src/lib/twilio.ts` - Twilio client configured with environment variables
3. Created `src/lib/twilio-actions.ts` - Server action `provisionPhoneNumber(areaCodeOrZip, userId)` that:
   - Accepts 3-digit area code or 5-digit ZIP code
   - Searches for available local numbers via Twilio API
   - Purchases the number with voice/SMS webhooks configured
   - Stores `twilio_number` in user's profile
   - Returns success/error with the provisioned number
4. Updated `.env.example` with Twilio environment variables

### Files Modified:
- `package.json` - Added twilio dependency
- `package-lock.json` - Updated lockfile
- `src/lib/twilio.ts` - NEW: Twilio client configuration
- `src/lib/twilio-actions.ts` - NEW: provisionPhoneNumber server action
- `.env.example` - Added Twilio variables
- `.agent/prd.json` - Marked US-006 as passes: true

### Verification:
- ✅ `npm run type-check` passes
