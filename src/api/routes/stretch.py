"""
拉伸方案路由
"""
from fastapi import APIRouter, HTTPException
from src.models.schemas import StretchRequest, StretchPlan
from src.services.stretch_service import generate_stretch_plan

router = APIRouter()


@router.post("/generate", response_model=StretchPlan, summary="生成个性化拉伸方案")
async def create_stretch_plan(request: StretchRequest):
    """
    根据打球时长、强度、不适部位，生成个性化拉伸序列。
    """
    try:
        plan = await generate_stretch_plan(request)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/library", summary="获取拉伸动作库")
async def get_stretch_library(area: str = None):
    """
    获取羽毛球专项拉伸动作库，可按部位筛选。
    """
    from src.services.stretch_service import get_action_library
    return get_action_library(area)
