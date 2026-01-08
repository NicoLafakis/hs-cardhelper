# AI Model Configuration - LOCKED IN ✅

## PRIMARY MODEL: Claude Haiku (claude-haiku-4-5-20251001)
- **Provider:** Anthropic
- **Status:** PRIMARY - Always tries this first
- **Use Cases:** Card generation, table configuration, smart suggestions
- **API Key Location:** `CLAUDE_API_KEY` in `.env`
- **Advantages:** Fast, efficient, great for JSON generation tasks

## FALLBACK MODEL: GPT-5 Mini (gpt-5-mini-2025-08-07)
- **Provider:** OpenAI
- **Status:** FALLBACK - Only used if Claude Haiku fails
- **API Key Location:** Stored in database (encrypted), associated with 'openai' service
- **When Used:** 
  - If Claude API is down
  - If Claude API key is missing/invalid
  - If Claude API returns an error
- **Advantages:** Excellent fallback, maintains continuity

## How It Works

### Request Flow:
```
User Request for AI Generation
    ↓
Try Claude Haiku (claude-haiku-4-5-20251001)
    ↓
Success? → Return with "claude-haiku" provider label
    ↓
Failure → Try GPT-5 Mini (gpt-5-mini-2025-08-07)
    ↓
Success? → Return with "gpt-5-mini-fallback" provider label
    ↓
Both Failed? → Return error with details on both failures
```

## Endpoints Using This Configuration

1. **POST /api/ai/suggest**
   - Generates card configurations from natural language
   - Used by: Natural Language Builder, AI Wizard
   
2. **POST /api/ai/table-wizard**
   - Generates table configurations from descriptions
   - Used by: Advanced Components, Table Builder

## Configuration Files

### `.env` (Backend)
```properties
CLAUDE_API_KEY=sk-ant-api03-[your-key]
OPENAI_API_KEY=sk-proj-[your-key]  # For fallback only
```

### `server/routes/ai.js`
- Import statements updated for both Anthropic and OpenAI
- `callAIProvider()` wrapper function handles the fallback logic
- All routes updated to use the new provider wrapper

## Testing the Integration

### Test Claude Haiku:
```bash
curl -X POST http://localhost:3020/api/ai/suggest \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a contact card with name and email",
    "objectType": "contacts",
    "properties": ["firstname", "lastname", "email"]
  }'
```

Expected response includes `"provider": "claude-haiku"`

### Test Fallback:
Set `CLAUDE_API_KEY` to an invalid value and rerun the test.
Expected response includes `"provider": "gpt-5-mini-fallback"`

## Important Notes

⚠️ **DO NOT CHANGE THIS CONFIGURATION**
- Claude Haiku is the PRIMARY model - always
- GPT-5 Mini is the FALLBACK - secondary only
- Order is locked in this priority

🔐 **API Key Security**
- Claude key: In `.env` (environment variable)
- OpenAI key: In encrypted database (user-specific)
- Both are never exposed in responses

📊 **Provider Tracking**
- All responses include `"provider"` field for debugging
- Check which provider handled each request
- Monitor fallback usage to identify Claude API issues

## Future Expansion

When adding new AI features, always follow this pattern:
```javascript
const result = await callAIProvider(systemPrompt, userPrompt, req.user.userId)
// This automatically handles Claude → GPT-5 fallback
res.json({ result: result.content, provider: result.provider })
```

---

**Last Updated:** January 7, 2026
**Status:** PRODUCTION READY
**Lock Status:** 🔒 LOCKED - Claude Haiku Primary, GPT-5 Mini Backup
