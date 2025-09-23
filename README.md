# MelodyMind: AI-Powered Literature & Music Analyzer

## 1. Project Purpose

MelodyMind is a full-stack, production-grade web platform connecting literature (text: poems, lyrics, prose) and music (audio clips) for deep analysis and cross-modal recommendations.

### Key Objectives:

* Analyze text: rhyme, meter, sentiment, theme, readability, named entities.
* Analyze audio: tempo, key, low-level features, energy, mood, genre/instruments.
* Cross-modal recommendations: match poems with songs and vice-versa using embeddings in a shared vector space.

## 2. Technology Stack

| Layer           | Stack                                      | Role                                                                                |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Frontend        | Next.js 14, React 18, Tailwind, shadcn/ui  | UI for uploads, dashboards, progress tracking (WebSocket/SSE), interactive visuals  |
| API Gateway     | Next.js Route Handlers / Node.js           | Handles JWT auth, validation, rate limiting, orchestration to ML services           |
| ML Service      | Python + FastAPI                           | Core analysis engine (NLP, audio processing, ML embeddings, BERTopic, transformers) |
| Datastore       | PostgreSQL + pgvector, Redis, MinIO/S3     | Stores metadata, embeddings, cached results, and files                              |
| Background Jobs | Celery/RQ + Redis/RabbitMQ                 | Async long-running analysis (audio, embedding generation)                           |
| Infra/Ops       | Docker, GitHub Actions, Prometheus/Grafana | Containerized deployment, observability, structured logging, security               |

## 3. Data Flow

1. **Upload → Analysis → Vector Embedding**

   * User uploads text/audio.
   * Metadata stored in PostgreSQL.
   * ML service performs analysis and generates embeddings (pgvector).
2. **Cross-Modal Retrieval**

   * Nearest-neighbor search using cosine similarity.
   * Recommendations generated between text and audio.
3. **Async Job Handling**

   * Job progress tracked in Redis.
   * Frontend updates in real-time via WebSocket/SSE.

## 4. Core API Contracts

| Contract Type        | Endpoint Sample                       | Function                                                |
| -------------------- | ------------------------------------- | ------------------------------------------------------- |
| User Upload/Analysis | `POST /api/texts` / `POST /api/audio` | Stores metadata and triggers analysis job               |
| Job Status           | `GET /api/jobs/:job_id`               | Check async job status and progress                     |
| Analysis Retrieval   | `GET /api/texts/:id/analysis`         | Retrieve calculated metrics, visuals URLs, summary JSON |
| Cross-Modal Match    | `POST /api/recommendations/from-text` | Find top-k audio matches for a text embedding           |
| ML Service Internal  | `POST /analyze/text {textId, text}`   | Full analysis and embedding generation                  |

## 5. Authentication & Session Management

* JWT-based authentication (`/register`, `/login`, `/refresh`, `/logout`, `/logoutAll`).
* Access tokens for protected routes.
* Refresh tokens stored securely in DB and rotated on refresh.

## 6. MVP Focus

* Dockerized backend + frontend.
* Basic text analysis (rhyme, meter, sentiment).
* Basic audio analysis (BPM, key, embeddings).
* Embedding-based cross-modal search.
* Async jobs with progress tracking.
* Full JWT-based auth and session management.

---

*This document provides a consolidated overview of MelodyMind, its architecture, data flow, core API contracts, and technology stack, designed to guide development and onboarding.*
