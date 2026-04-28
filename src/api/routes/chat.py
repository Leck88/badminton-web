"""
对话路由 — AI 智能问答入口
"""
from fastapi import APIRouter
from src.models.schemas import ChatRequest, ChatResponse
import uuid

router = APIRouter()


@router.post("/", response_model=ChatResponse, summary="AI 对话")
async def chat(request: ChatRequest):
    """
    与羽后伸 AI 康复师对话，支持伤病问答、拉伸建议、疲劳评估等。
    """
    from src.services.chat_service import process_chat
    session_id = request.session_id or str(uuid.uuid4())
    response = await process_chat(request.message, session_id)
    return ChatResponse(
        message=response["message"],
        session_id=session_id,
        suggestions=response.get("suggestions"),
    )
