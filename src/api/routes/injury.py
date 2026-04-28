from fastapi import APIRouter
router = APIRouter()

@router.post("/ask", summary="伤病问答")
async def injury_qa(question: str):
    from src.services.chat_service import process_chat
    import uuid
    result = await process_chat(question, str(uuid.uuid4()))
    return {"answer": result["message"]}
