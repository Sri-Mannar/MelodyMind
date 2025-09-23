# MelodyMind Dev Run Script
# Usage: ./run.ps1

Write-Host "🚀 Starting MelodyMind Development Environment..." -ForegroundColor Cyan

# 1️⃣ Ensure Docker Desktop is running
Write-Host "🔧 Checking Docker Desktop..."
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running. Please start it manually." -ForegroundColor Red
    exit 1
}

# 2️⃣ Start or create melodymind-db container
$containerExists = docker ps -a --format "{{.Names}}" | Select-String "melodymind-db"
if ($containerExists) {
    Write-Host "✅ Container melodymind-db found. Starting..."
    docker start melodymind-db | Out-Null
} else {
    Write-Host "⚙️  Creating and starting melodymind-db container..."
    docker run --name melodymind-db `
      -e POSTGRES_USER=melody `
      -e POSTGRES_PASSWORD=melodypass `
      -e POSTGRES_DB=melodymind `
      -p 5432:5432 -d pgvector/pgvector:pg16
}

# 3️⃣ Install dependencies
Write-Host "📦 Installing dependencies..."
npm install

# 4️⃣ Prisma client + migrations
Write-Host "🛠 Generating Prisma client..."
npx prisma generate

Write-Host "📜 Running migrations (dev)..."
npx prisma migrate dev --name auto_migration

# 5️⃣ Start Next.js server
Write-Host "🚀 Starting Next.js dev server..."
npm run dev
