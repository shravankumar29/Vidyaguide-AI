import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.api import router_auth, router_career, router_interactive, router_progress, router_resume, router_training

app = FastAPI(
    title="VidyaMitra API",
    description="Backend for the Intelligent Career Agent",
    version="1.0.0",
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_auth)
app.include_router(router_resume)
app.include_router(router_career)
app.include_router(router_interactive)
app.include_router(router_training)
app.include_router(router_progress)

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "dist"

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    file_path = FRONTEND_DIST / full_path
    if file_path.is_file():
        return FileResponse(str(file_path))
    
    index_path = FRONTEND_DIST / "index.html"
    if index_path.is_file():
        return FileResponse(str(index_path))
        
    return {"message": f"Frontend build not found at {index_path}."}
