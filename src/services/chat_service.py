"""
对话服务 — 接入 LLM
"""
from src.agent.prompts import SYSTEM_PROMPT
import os

# 对话历史（简单内存版，生产用Redis）
_sessions: dict = {}


async def process_chat(message: str, session_id: str) -> dict:
    """处理用户对话，返回AI回复"""
    
    # 初始化会话
    if session_id not in _sessions:
        _sessions[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
    
    history = _sessions[session_id]
    history.append({"role": "user", "content": message})
    
    try:
        # 优先用 OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=api_key)
            resp = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=history,
                max_tokens=1000,
            )
            reply = resp.choices[0].message.content
        else:
            # 演示模式（无 API Key 时返回示例）
            reply = _demo_reply(message)
        
        history.append({"role": "assistant", "content": reply})
        
        return {
            "message": reply,
            "suggestions": _get_suggestions(message),
        }
    except Exception as e:
        return {
            "message": f"抱歉，服务暂时不可用：{str(e)}",
            "suggestions": ["生成拉伸方案", "疲劳自测", "查看动作库"],
        }


def _demo_reply(message: str) -> str:
    """演示模式回复"""
    if "肩" in message:
        return "杀球后肩部酸痛是旋转肌群过度使用的典型反应。建议：\n1. 立即冰敷肩后侧10分钟\n2. 做肩袖外旋拉伸（30秒×3组）\n3. 避免第二天再次大力杀球\n\n需要我为您生成完整的肩部恢复方案吗？"
    elif "膝" in message:
        return "羽毛球膝多由急停和弓步引起。建议：\n1. 打球后立即冰敷膝盖15分钟\n2. 做股四头肌和髂腰肌拉伸\n3. 检查鞋底磨损情况\n\n要生成今天的膝关节恢复计划吗？"
    elif "跟腱" in message:
        return "跟腱炎需要认真对待！\n• 急性期（红肿热痛）：立即冰敷，停止运动，就医\n• 慢性期：每天做小腿拉伸，逐步恢复\n\n跟腱断裂是紧急情况，如果听到'啪'的声音立刻就医！"
    else:
        return "您好！我是羽后伸 AI 康复师 🏸\n\n请告诉我：\n1. 今天打了多久球？\n2. 强度如何？\n3. 哪里不舒服？\n\n我来为您生成专属恢复方案！"


def _get_suggestions(message: str) -> list:
    return ["生成拉伸方案", "10秒疲劳自测", "查看本周恢复计划", "伤病问答"]
