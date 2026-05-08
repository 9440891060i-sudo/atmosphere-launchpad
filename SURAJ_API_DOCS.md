# Atmosphere — Backend API Docs for Suraj

## Overview

The frontend reads from **Supabase** in real time. You push data via the Supabase REST API using the **service role key** (get it from Krishna — Supabase Dashboard → Project Settings → API → `service_role` key).

---

## Base URL

```
https://qdpodfowuutipyomoffi.supabase.co/rest/v1
```

## Auth Header (ALL requests)

```
Authorization: Bearer <SERVICE_ROLE_KEY>
apikey: <SERVICE_ROLE_KEY>
Content-Type: application/json
Prefer: resolution=merge-duplicates
```

---

## Step 1 — Run the Schema (one time)

Ask Krishna to go to **Supabase Dashboard → SQL Editor** and run the contents of:
`supabase/migrations/20260508_create_narratives_coins.sql`

---

## Tables

### `narratives`

| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | e.g. `"privacy"`, `"defi"`, `"ai-ml"` |
| `title` | text | Display name |
| `score` | integer | 0–100 |
| `tag` | text | e.g. `"Trending"`, `"Hot"`, `"Stable"` |
| `summary` | text | Short blurb shown on the card |
| `detailed_report` | text | Full report paragraph |
| `coins_in_space` | jsonb | Array of coin objects (see schema below) |
| `upcoming_coins` | jsonb | Array of upcoming coin objects |
| `news` | jsonb | Array of news objects |
| `ai_summary` | text | AI analysis paragraph |

### `coins`

| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | e.g. `"ondo"`, `"scrt"` |
| `symbol` | text | e.g. `"ONDO"` |
| `name` | text | e.g. `"Ondo Finance"` |
| `price` | text | e.g. `"$1.24"` |
| `change_24h` | text | e.g. `"+4.2%"` |
| `positive` | boolean | true if price change is up |
| `description` | text | Full coin description |
| `token_metrics` | jsonb | Array of `{label, value}` |
| `news` | jsonb | Array of news objects |
| `social_activity` | jsonb | Array of social objects |
| `similar_coin_ids` | text[] | Array of coin IDs |
| `ai_summary` | text | AI analysis |
| `ai_score` | integer | 0–100 |

---

## JSON Schemas

### News item
```json
{
  "id": "unique-string",
  "title": "Headline text",
  "body": "Full article body",
  "time": "2h ago",
  "url": "https://link-to-article.com",
  "importance": "major"
}
```
`importance` must be `"major"` or `"minor"`.  
`url` is optional but recommended — shows "Read full article ↗" link.

### Coin in space (inside narrative)
```json
{
  "id": "ondo",
  "symbol": "ONDO",
  "name": "Ondo Finance",
  "price": "$1.24",
  "change": "+12.4%",
  "positive": true,
  "quickInfo": "Short description for the card",
  "tokenMetrics": [
    { "label": "Market Cap", "value": "$1.24B" },
    { "label": "24h Volume", "value": "$89.4M" },
    { "label": "Price", "value": "$1.24" },
    { "label": "7D Change", "value": "+12.4%" }
  ],
  "personalView": "One sentence analyst opinion"
}
```

### Upcoming coin (inside narrative)
```json
{
  "id": "qntm",
  "symbol": "QNTM",
  "name": "Quantum Shield",
  "quickInfo": "Short description",
  "tkm": "$50M FDV · 20% TGE unlock",
  "launchDate": "Q3 2026"
}
```

### Token metric
```json
{ "label": "Market Cap", "value": "$1.24B" }
```

### Social activity item
```json
{
  "platform": "X (Twitter)",
  "metric": "Mentions 24h",
  "value": "14,200",
  "trend": "+38%",
  "positive": true
}
```

---

## API Examples

### Push / Update a Narrative

```bash
curl -X POST "https://qdpodfowuutipyomoffi.supabase.co/rest/v1/narratives" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{
    "id": "privacy",
    "title": "Privacy",
    "score": 93,
    "tag": "Trending",
    "summary": "Short summary shown on card...",
    "detailed_report": "Full detailed report...",
    "ai_summary": "AI generated analysis...",
    "news": [
      {
        "id": "n1",
        "title": "ONDO integrates ZK-proof layer",
        "body": "Full article body...",
        "time": "2h ago",
        "url": "https://example.com/article",
        "importance": "major"
      }
    ],
    "coins_in_space": [
      {
        "id": "ondo",
        "symbol": "ONDO",
        "name": "Ondo Finance",
        "price": "$1.24",
        "change": "+12.4%",
        "positive": true,
        "quickInfo": "Tokenized real-world assets...",
        "tokenMetrics": [
          { "label": "Market Cap", "value": "$1.24B" },
          { "label": "24h Volume", "value": "$89.4M" },
          { "label": "Price", "value": "$1.24" },
          { "label": "7D Change", "value": "+12.4%" }
        ],
        "personalView": "Strong fundamentals..."
      }
    ],
    "upcoming_coins": []
  }'
```

### Push / Update a Coin

```bash
curl -X POST "https://qdpodfowuutipyomoffi.supabase.co/rest/v1/coins" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{
    "id": "ondo",
    "symbol": "ONDO",
    "name": "Ondo Finance",
    "price": "$1.24",
    "change_24h": "+4.2%",
    "positive": true,
    "description": "Full description of the coin...",
    "ai_score": 83,
    "ai_summary": "AI analysis text...",
    "token_metrics": [
      { "label": "Market Cap", "value": "$1.24B" },
      { "label": "Fully Diluted Val", "value": "$12.4B" },
      { "label": "24h Volume", "value": "$89.4M" },
      { "label": "Circulating Supply", "value": "1.0B ONDO" },
      { "label": "Total Supply", "value": "10.0B ONDO" },
      { "label": "ATH", "value": "$2.14" },
      { "label": "ATL", "value": "$0.08" },
      { "label": "Launch Date", "value": "Jan 2024" }
    ],
    "news": [
      {
        "id": "o1",
        "title": "ONDO integrates ZK-proof layer",
        "body": "Full body...",
        "time": "2h ago",
        "url": "https://example.com/article",
        "importance": "major"
      }
    ],
    "social_activity": [
      { "platform": "X (Twitter)", "metric": "Mentions 24h", "value": "14,200", "trend": "+38%", "positive": true }
    ],
    "similar_coin_ids": ["scrt", "zen", "aave"]
  }'
```

### Update just the score + news (partial update)

```bash
curl -X PATCH "https://qdpodfowuutipyomoffi.supabase.co/rest/v1/narratives?id=eq.privacy" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 95,
    "news": [ ... ]
  }'
```

---

## Python helper (optional)

```python
import requests

BASE = "https://qdpodfowuutipyomoffi.supabase.co/rest/v1"
KEY  = "<SERVICE_ROLE_KEY>"
HEADERS = {
    "Authorization": f"Bearer {KEY}",
    "apikey": KEY,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

def upsert_narrative(data: dict):
    r = requests.post(f"{BASE}/narratives", headers=HEADERS, json=data)
    r.raise_for_status()
    return r.json()

def upsert_coin(data: dict):
    r = requests.post(f"{BASE}/coins", headers=HEADERS, json=data)
    r.raise_for_status()
    return r.json()
```

---

## Notes

- Use `Prefer: resolution=merge-duplicates` header to upsert (insert or update by PK)
- The frontend reads live from Supabase and falls back to mock data if the table is empty
- `time` field in news is a display string (`"2h ago"`, `"1d ago"`) — format it however you want
- Always include `url` in news items — it shows a "Read full article ↗" link in the UI
- `id` fields must be lowercase with hyphens, e.g. `"ai-ml"`, `"layer2"`, `"defi"`
