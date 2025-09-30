# Audio API (CRUD)

## Endpoints
- `POST /api/audio` → Upload metadata (and file later).
- `GET /api/audio` → List all audios (user-specific).
- `GET /api/audio/:id` → Get single audio by ID.
- `DELETE /api/audio/:id` → Delete audio.

## Implementation Structure
- **Service:** `src/services/audioService.ts`
- **Routes:** `src/app/api/audio/route.ts` and `src/app/api/audio/[id]/route.ts`
