if prd.json is empty, run /prd-builder with brief.md then /ralph-prd-to-json
otherwise pick highest priority story where passes: false

ENV CHECK (run before each story that uses external services):
1. Check if .env exists (not just .env.example)
2. Verify required vars are set (not placeholder values like "your-*")
3. If missing/invalid, output:
   WAITING_ON_USER

   Missing environment variables. Copy .env.example to .env and fill in:
   - SUPABASE: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   - TWILIO: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
   - STRIPE: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID

   Then restart: ralph run -c ralph.yml
4. If env is configured, proceed with story

IMPORTANT:
- use Next.js patterns for Node/TypeScript development
- run npm run type-check && npm run build after changes
- for UI stories, verify with agent-browser before marking complete
- set passes: true only when build passes AND feature works with real credentials
- commit: feat: [Story ID] - [Title]
- when all stories pass, output LOOP_COMPLETE (to stdout only, never write into files)
