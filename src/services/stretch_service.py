"""
核心拉伸服务 — 羽毛球专项动作库 + AI 编排
"""
from src.models.schemas import StretchRequest, StretchPlan, StretchAction, PainArea
from src.agent.prompts import STRETCH_PLAN_PROMPT, SYSTEM_PROMPT
from datetime import datetime
import json

# ====== 羽毛球专项拉伸动作库 ======
BADMINTON_STRETCH_LIBRARY = {
    "肩": [
        StretchAction(
            name="肩袖外旋拉伸",
            emoji="🏸",
            target_muscle="冈下肌、小圆肌（杀球关键肌群）",
            steps=["右手持门框或墙壁，手臂与肩同高", "身体向左转，感受右肩后侧拉伸", "缓慢呼吸，不要耸肩"],
            duration_seconds=30,
            notes="杀球后必做，防止肩袖撕裂",
        ),
        StretchAction(
            name="胸前交叉拉伸",
            emoji="💪",
            target_muscle="三角肌后束、菱形肌",
            steps=["右臂横过胸前", "左手轻压右肘向身体靠", "感受右肩后部延伸感"],
            duration_seconds=30,
            notes="每侧各做2组",
        ),
        StretchAction(
            name="毛巾辅助肩关节拉伸",
            emoji="🧘",
            target_muscle="旋转肌群（360°覆盖）",
            steps=["毛巾从背后一手上一手下抓住", "上方手向上轻拉", "感受下方肩关节拉伸"],
            duration_seconds=20,
            notes="有肩袖旧伤者力度减半",
        ),
    ],
    "肘": [
        StretchAction(
            name="腕伸肌拉伸（网球肘预防）",
            emoji="🦾",
            target_muscle="桡侧腕短伸肌",
            steps=["右臂向前伸直", "左手将右手腕向下弯", "保持肘部伸直"],
            duration_seconds=30,
            notes="吊球、切球频繁者必做",
        ),
        StretchAction(
            name="腕屈肌拉伸",
            emoji="✋",
            target_muscle="尺侧腕屈肌、指屈肌",
            steps=["右臂向前伸直，掌心向上", "左手将手指向下压", "感受前臂内侧拉伸"],
            duration_seconds=30,
            notes="网拍握力强者重点做",
        ),
    ],
    "膝": [
        StretchAction(
            name="股四头肌站立拉伸",
            emoji="🦵",
            target_muscle="股四头肌（跳跃制动关键）",
            steps=["单腿站立，手扶墙", "另一腿屈膝，手抓脚踝向臀部靠", "骨盆保持中立，不要翘屁股"],
            duration_seconds=45,
            notes="急停后膝盖酸胀首选",
        ),
        StretchAction(
            name="弓步髂腰肌拉伸",
            emoji="🏃",
            target_muscle="髂腰肌、股直肌（弓步核心）",
            steps=["右脚向前大步弓步", "左膝跪地", "上身直立，骨盆前推", "感受左侧髋前方深层拉伸"],
            duration_seconds=45,
            notes="每次弓步网前之后必做",
        ),
        StretchAction(
            name="IT 髂胫束泡沫轴放松",
            emoji="🔄",
            target_muscle="髂胫束（膝外侧痛根源）",
            steps=["侧卧，泡沫轴放在大腿外侧", "用手撑地控制体重", "缓慢滚动从髋到膝盖"],
            duration_seconds=60,
            notes="找到痛点停留10秒呼吸放松",
        ),
    ],
    "踝": [
        StretchAction(
            name="小腿三头肌拉伸",
            emoji="🦶",
            target_muscle="腓肠肌、比目鱼肌（急停核心）",
            steps=["面对墙壁，右脚向后一步", "前腿弯曲，后腿伸直蹬地", "脚跟不离地，感受小腿后侧拉伸"],
            duration_seconds=45,
            notes="跟腱旧伤者在平地做，不要在台阶上",
        ),
        StretchAction(
            name="踝关节环绕放松",
            emoji="🌀",
            target_muscle="踝关节周围韧带",
            steps=["坐姿，抬起一脚", "顺时针缓慢画圆 10 次", "逆时针 10 次"],
            duration_seconds=30,
            notes="扭伤史者每次打球后必做",
        ),
    ],
    "腰": [
        StretchAction(
            name="猫牛式脊椎放松",
            emoji="🐱",
            target_muscle="竖脊肌、多裂肌",
            steps=["四肢跪地，手在肩下膝在髋下", "吸气：塌腰抬头（牛式）", "呼气：拱背低头（猫式）"],
            duration_seconds=60,
            notes="来回各10次，动作要慢",
        ),
        StretchAction(
            name="仰卧膝触胸拉伸",
            emoji="🛌",
            target_muscle="腰方肌、臀大肌",
            steps=["仰卧，双膝弯曲", "双手抱膝向胸口拉", "轻轻左右摇晃腰椎"],
            duration_seconds=30,
            notes="腰椎间盘突出者用单腿版本",
        ),
    ],
}


def get_action_library(area: str = None):
    if area and area in BADMINTON_STRETCH_LIBRARY:
        return {area: BADMINTON_STRETCH_LIBRARY[area]}
    return BADMINTON_STRETCH_LIBRARY


async def generate_stretch_plan(request: StretchRequest) -> StretchPlan:
    """生成个性化拉伸方案（优先用本地库，可扩展为AI生成）"""
    
    actions = []
    
    # 按不适部位从库中选取动作
    for area in request.pain_areas:
        area_name = area.value
        if area_name in BADMINTON_STRETCH_LIBRARY:
            area_actions = BADMINTON_STRETCH_LIBRARY[area_name]
            # 高强度多选动作
            count = 3 if request.intensity.value == "激烈" else 2
            actions.extend(area_actions[:count])

    # 如果没有指定部位，给默认全身方案
    if not actions:
        actions = [
            BADMINTON_STRETCH_LIBRARY["肩"][0],
            BADMINTON_STRETCH_LIBRARY["膝"][1],
            BADMINTON_STRETCH_LIBRARY["踝"][0],
            BADMINTON_STRETCH_LIBRARY["腰"][0],
        ]

    total_duration = sum(a.duration_seconds for a in actions)
    
    # 生成整体建议
    intensity_advice = {
        "轻松": "今天强度不大，重点做关节活动度维护，5分钟即可。",
        "普通": "建议完成全部拉伸，配合深呼吸，约10-15分钟。",
        "激烈": "高强度后肌肉紧张，建议完整拉伸+冰敷肩膝10分钟，充分恢复再训练。",
    }
    
    return StretchPlan(
        title=f"{'·'.join([a.value for a in request.pain_areas])} 专项恢复方案",
        total_duration=total_duration,
        actions=actions,
        overall_advice=intensity_advice.get(request.intensity.value, "完成拉伸后多补水，保持良好睡眠。"),
        created_at=datetime.now(),
    )
