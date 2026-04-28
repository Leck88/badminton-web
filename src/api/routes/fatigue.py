from fastapi import APIRouter
from src.models.schemas import FatigueAssessmentRequest, FatigueResult, FatigueLevel

router = APIRouter()

@router.post("/assess", response_model=FatigueResult, summary="疲劳度评估")
async def assess_fatigue(request: FatigueAssessmentRequest):
    score = 0
    if request.squat_quality == "很困难": score += 3
    elif request.squat_quality == "有点吃力": score += 1
    if request.perceived_fatigue >= 8: score += 3
    elif request.perceived_fatigue >= 5: score += 1
    if request.sleep_quality == "差": score += 2
    elif request.sleep_quality == "一般": score += 1
    if request.shoulder_rotation < 45: score += 2

    if score >= 6:
        level = FatigueLevel.HEAVY
        rec = "今天完全休息，不建议任何训练"
        plan = ["冰敷主要不适部位 15 分钟", "轻柔拉伸10分钟", "充足睡眠8小时", "明天重新评估"]
    elif score >= 3:
        level = FatigueLevel.MEDIUM
        rec = "主动恢复日，轻度拉伸+散步"
        plan = ["完成今日拉伸方案", "泡沫轴放松腿部", "冰敷膝盖/踝关节", "避免高强度训练"]
    else:
        level = FatigueLevel.LIGHT
        rec = "状态良好，可以正常训练"
        plan = ["10分钟热身拉伸", "正常打球", "打完后做恢复拉伸"]

    return FatigueResult(
        level=level,
        recommendation=rec,
        priority_areas=["肩", "膝", "踝"],
        recovery_plan=plan,
    )
