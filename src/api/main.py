"""
FastAPI 主入口
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from src.api.routes import stretch, fatigue, injury, weekly, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🏸 羽后伸 AI 康复师启动中...")
    yield
    print("🏸 服务关闭")


app = FastAPI(
    title="羽后伸 · Badminton Recovery Agent",
    description="专为羽毛球爱好者设计的 AI 康复师 API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(stretch.router, prefix="/api/v1/stretch", tags=["拉伸方案"])
app.include_router(fatigue.router, prefix="/api/v1/fatigue", tags=["疲劳评估"])
app.include_router(injury.router, prefix="/api/v1/injury", tags=["伤病问答"])
app.include_router(weekly.router, prefix="/api/v1/weekly", tags=["周计划"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["AI 对话"])


@app.get("/")
async def root():
    return {
        "name": "羽后伸 AI 康复师",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
