"""Estate OS backend placeholder.

The prototype keeps all data in the browser (frontend/website/data.js plus each
module's seed). This FastAPI app exists so the project matches the standard
Emergent layout (frontend on :3000, backend on :8001 behind /api) and gives a
health check to build real persistence on later.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Estate OS API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "estate-os"}


@app.get("/api/")
def root():
    return {"message": "Estate OS API. The demo data lives in the frontend for now."}
