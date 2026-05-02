"""
FastAPI 主入口
"""
import os
import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.routes import stretch, fatigue, injury, weekly, chat

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🏸 羽后伸 AI 康复师启动中...")
    yield
    logger.info("🏸 服务关闭")


app = FastAPI(
    title="羽后伸 · Badminton Recovery Agent",
    description="专为羽毛球爱好者设计的 AI 康复师 API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 配置：仅允许配置的域名
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") or ["*"]
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS if o.strip()]

if "*" in ALLOWED_ORIGINS:
    # 生产环境禁止使用 *，仅开发环境允许
    if os.getenv("APP_ENV") == "production":
        logger.warning("⚠️ APP_ENV=production 但 CORS 配置为 *，已拒绝启动。请设置 ALLOWED_ORIGINS")
        ALLOWED_ORIGINS = []
    else:
        logger.warning("⚠️ CORS 允许所有来源，仅适用于开发环境")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# API 认证（可选，通过 API_KEY 环境变量启用）
API_KEY = os.getenv("API_KEY", "")
API_KEY_HEADER = os.getenv("API_KEY_HEADER", "X-API-Key")


@app.middleware("http")
async def authenticate_request(request: Request, call_next):
    """API Key 认证中间件（若配置了 API_KEY）"""
    if not API_KEY:
        # 未配置密钥，不进行认证
        return await call_next(request)

    # 跳过健康检查
    if request.url.path in ("/", "/health", "/docs", "/openapi.json", "/redoc"):
        return await call_next(request)

    provided_key = request.headers.get(API_KEY_HEADER) or request.cookies.get(API_KEY_HEADER)
    if provided_key != API_KEY:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid or missing API Key"},
        )
    return await call_next(request)


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
