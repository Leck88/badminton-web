from fastapi import APIRouter
router = APIRouter()

@router.post("/generate", summary="生成周恢复计划")
async def generate_weekly_plan(weekly_frequency: int = 3):
    days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    plan = {}
    for day in days:
        plan[day] = {
            "play": False,
            "stretch": "10分钟全身拉伸",
            "recovery": "泡沫轴放松腿部",
        }
    return {"plan": plan, "tip": "每次打球后30分钟内完成拉伸效果最佳"}
