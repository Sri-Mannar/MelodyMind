# Step 1: Text (Lyrics) API + Service Layer

## 1. Service: `textService.ts`
Handles DB interactions using Prisma.

- `createText(userId, title, raw)`
- `getUserTexts(userId)`
- `getTextById(id, userId)`
- `deleteText(id, userId)`

---

## 2. API Routes (Next.js App Router)

- `POST /api/texts` → upload new lyrics
- `GET /api/texts` → get all texts for logged-in user
- `GET /api/texts/[id]` → get one text
- `DELETE /api/texts/[id]` → delete a text

---

## 3. Flow
- Request comes in  
- `requireAuth()` checks user  
- API calls service (`textService`)  
- Service talks to Prisma DB  
- Returns response
