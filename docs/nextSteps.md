Step 1: Text Upload & Analysis API

Goal: Enable users to submit poems, lyrics, or prose and perform structural & semantic analysis.

Tasks:

Database Design:

texts table:

CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


text_analysis table:

CREATE TABLE text_analysis (
  id SERIAL PRIMARY KEY,
  text_id INT REFERENCES texts(id),
  rhyme_scheme TEXT,
  meter TEXT,
  sentiment JSONB,
  themes JSONB,
  entities JSONB,
  readability FLOAT
);


API Routes (Next.js Route Handlers)

POST /api/texts → Save text and enqueue analysis job.

GET /api/texts/:id/analysis → Retrieve analysis results.

Service Layer

textService.ts: Methods to insert text, retrieve analysis, and enqueue job to ML service.

ML Integration

Define a Python/FastAPI endpoint /analyze/text that receives text, computes embeddings, rhyme, meter, sentiment, and returns metrics.

Decide on communication method: REST API or message queue (RabbitMQ/Redis).

Step 2: Audio Upload & Analysis API

Goal: Enable users to submit song clips for signal processing & mood analysis.

Tasks:

Database Design:

audio table:

CREATE TABLE audio (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


audio_analysis table:

CREATE TABLE audio_analysis (
  id SERIAL PRIMARY KEY,
  audio_id INT REFERENCES audio(id),
  tempo FLOAT,
  key TEXT,
  mood JSONB,
  genre_tags JSONB,
  instrument_tags JSONB
);


API Routes

POST /api/audio → Upload audio, enqueue analysis job.

GET /api/audio/:id/analysis → Retrieve analysis.

Service Layer

audioService.ts: Methods for saving file paths, enqueueing tasks, retrieving analysis.

ML Integration

Python/FastAPI endpoint /analyze/audio.

Compute tempo, key, MFCCs, mood embeddings, genre classification.

Step 3: Cross-Modal Recommendations

Goal: Enable matching text to audio and audio to text based on embeddings.

Tasks:

Database

Store embeddings in pgvector fields:

ALTER TABLE texts ADD COLUMN embedding vector(768);
ALTER TABLE audio ADD COLUMN embedding vector(768);


API Routes

POST /api/recommendations/from-text → Input text ID → output top-k audio.

POST /api/recommendations/from-audio → Input audio ID → output top-k text.

Service Layer

recommendationService.ts: Methods to query nearest neighbors in pgvector using cosine similarity.

Step 4: Background Jobs

Goal: Offload ML processing to async tasks to keep the API responsive.

Tasks:

Configure Redis + Celery (Python) or RQ for async job queue.

API endpoints enqueue jobs with job ID.

Provide job status endpoint:

GET /api/jobs/:job_id

Step 5: Frontend Integration

Goal: Connect UI with the backend.

Tasks:

Upload UI (text/audio)

Dashboard to show:

Analysis results (table + charts)

Cross-modal recommendations

Job progress (poll or SSE/WebSocket)