# Lyrics & Audio Upload - Database Schema and API Contracts

## 1. Database Schema

### a) Texts Table (Lyrics)
| Column | Type | Description |
|--------|------|------------|
| id | UUID / SERIAL PK | Unique identifier for the text record |
| user_id | UUID FK | References the user who uploaded the lyrics |
| title | VARCHAR(255) | Optional title of the song/lyrics |
| content | TEXT | Raw lyrics content |
| metadata | JSONB | Optional metadata (e.g., original filename if uploaded via file) |
| embedding | VECTOR(768) | Text embedding vector for cross-modal search (pgvector) |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### b) Audio Table
| Column | Type | Description |
|--------|------|------------|
| id | UUID / SERIAL PK | Unique identifier for the audio record |
| user_id | UUID FK | References the user who uploaded the audio |
| title | VARCHAR(255) | Optional title of the audio track |
| file_path | TEXT | S3/MinIO URL or local path for raw audio |
| metadata | JSONB | Audio features (BPM, key, duration, instruments, etc.) |
| embedding | VECTOR(1024) | Audio embedding vector for cross-modal search (pgvector) |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

---

## 2. API Contracts

### a) Upload Lyrics
**Endpoint:** `POST /api/texts`  
**Request Body (JSON):**
```json
{
  "title": "Optional title",
  "content": "Lyrics text content here..."
}
Response (201 Created):

json
Copy code
{
  "id": "text_id",
  "user_id": "user_id",
  "title": "Optional title",
  "message": "Text uploaded successfully"
}
b) Upload Audio
Endpoint: POST /api/audio
Request Body: multipart/form-data

file: .mp3 / .wav

title: optional

Response (201 Created):

json
Copy code
{
  "id": "audio_id",
  "user_id": "user_id",
  "file_path": "https://bucket.s3/audio.mp3",
  "message": "Audio uploaded successfully"
}
c) Retrieve Text Analysis
Endpoint: GET /api/texts/:id/analysis
Response (200 OK):

json
Copy code
{
  "id": "text_id",
  "content": "Lyrics content...",
  "features": {
    "rhyme_scheme": "ABAB",
    "syllable_count": 120,
    "emotion": "Joy",
    "topics": ["love", "nature"]
  },
  "embedding": [0.123, 0.456, ...]
}
d) Retrieve Audio Analysis
Endpoint: GET /api/audio/:id/analysis
Response (200 OK):

json
Copy code
{
  "id": "audio_id",
  "file_path": "https://bucket.s3/audio.mp3",
  "features": {
    "tempo": 120,
    "key": "C Major",
    "energy": 0.85,
    "valence": 0.7,
    "mfcc": [...],
    "spectral_centroid": [...]
  },
  "embedding": [0.234, 0.567, ...]
}
e) Cross-Modal Recommendation
Endpoint: POST /api/recommendations/from-text
Request Body:

json
Copy code
{
  "text_id": "text_id",
  "top_k": 5
}
Response (200 OK):

json
Copy code
{
  "matches": [
    {
      "audio_id": "audio_id_1",
      "similarity_score": 0.92,
      "file_path": "https://bucket.s3/audio1.mp3"
    },
    ...
  ]
}
f) Notes
Embeddings: Text embeddings 768 dims, Audio embeddings 1024 dims (adjustable).

Storage: Use S3/MinIO for raw files; PostgreSQL + pgvector for embeddings.

Analysis: NLP for lyrics, signal processing + audio ML models for audio.

Next Steps After This:

Implement DB migrations with these tables.

Build the Next.js API routes (/api/texts, /api/audio) and integrate with ML microservice.

Connect pgvector for embeddings storage.

Implement frontend upload forms with validation.

