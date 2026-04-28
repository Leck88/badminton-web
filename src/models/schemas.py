"""
数据模型定义
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


class IntensityLevel(str, Enum):
    EASY = "轻松"
    NORMAL = "普通"
    INTENSE = "激烈"


class PainArea(str, Enum):
    SHOULDER = "肩"
    ELBOW = "肘"
    KNEE = "膝"
    ANKLE = "踝"
    WAIST = "腰"
    WRIST = "腕"
    CALF = "小腿"


class FatigueLevel(str, Enum):
    LIGHT = "轻度"
    MEDIUM = "中度"
    HEAVY = "重度"


# ====== 请求模型 ======

class StretchRequest(BaseModel):
    duration: int = Field(..., description="打球时长（分钟）", ge=10, le=300)
    intensity: IntensityLevel = Field(..., description="运动强度")
    pain_areas: List[PainArea] = Field(..., description="不适部位")
    recovery_time: int = Field(default=15, description="可用恢复时间（分钟）")
    user_id: Optional[str] = None


class FatigueAssessmentRequest(BaseModel):
    squat_quality: str = Field(..., description="深蹲质量：流畅/有点吃力/很困难")
    shoulder_rotation: int = Field(..., description="肩关节外旋角度（度）")
    perceived_fatigue: int = Field(..., description="主观疲劳感 1-10", ge=1, le=10)
    sleep_quality: str = Field(..., description="睡眠质量：好/一般/差")


class InjuryQARequest(BaseModel):
    question: str = Field(..., description="伤病问题")
    user_id: Optional[str] = None


class WeeklyPlanRequest(BaseModel):
    weekly_frequency: int = Field(..., description="每周打球次数", ge=1, le=14)
    play_days: List[str] = Field(..., description="打球日期，如['周一','周三','周六']")
    vulnerable_areas: List[PainArea] = Field(default=[], description="易伤部位")
    available_time: int = Field(default=15, description="每天可用恢复时间（分钟）")


class ChatRequest(BaseModel):
    message: str = Field(..., description="用户消息")
    session_id: Optional[str] = None
    user_id: Optional[str] = None


# ====== 响应模型 ======

class StretchAction(BaseModel):
    name: str
    emoji: str
    target_muscle: str
    steps: List[str]
    duration_seconds: int
    notes: Optional[str] = None


class StretchPlan(BaseModel):
    title: str
    total_duration: int
    actions: List[StretchAction]
    overall_advice: str
    created_at: datetime = Field(default_factory=datetime.now)


class FatigueResult(BaseModel):
    level: FatigueLevel
    recommendation: str
    priority_areas: List[str]
    recovery_plan: List[str]


class ChatResponse(BaseModel):
    message: str
    session_id: str
    suggestions: Optional[List[str]] = None
