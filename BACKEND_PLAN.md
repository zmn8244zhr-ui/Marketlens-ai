# MarketLens AI — live backend plan

The GitHub Pages front end must NOT contain private API keys. It needs a secure backend.

Required backend endpoints:
- GET /api/market/nasdaq?interval=1m
- GET /api/macro
- GET /api/news?from=...&to=...
- GET /api/calendar?from=...&to=...
- POST /api/candle-analysis

The backend should:
1. Pull the licensed market feed.
2. Pull timestamped news.
3. Pull economic-calendar events.
4. Pull cross-market observations (DXY, US 10Y, oil, S&P).
5. Store/cache observations with timestamps.
6. For a selected candle, gather a tight time window around it.
7. Return evidence and source timestamps to the AI.
8. Classify the catalyst as confirmed, likely, technical/liquidity, or uncertain.

Important: real-time U.S. market data can require paid/licensed exchange entitlements. Do not put a provider secret in index.html or a public GitHub repository.
