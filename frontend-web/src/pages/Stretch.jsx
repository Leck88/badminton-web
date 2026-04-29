import { useState } from 'react'
import { generateStretch } from '../api.js'

const AREAS = ['肩', '肘', '膝', '踝', '腰', '腕', '小腿']
const INTENSITIES = [
  { value: '轻松', emoji: '😌', desc: '悠闲打球' },
  { value: '普通', emoji: '😊', desc: '正常强度' },
  { value: '激烈', emoji: '🔥', desc: '高强度竞技' },
]

// ─────────────────────────────────────────
// 离线拉伸方案预设库
// ─────────────────────────────────────────
const OFFLINE_PLANS = {
  // 肩部
  shoulder_easy: {
    title: '🧘 肩部放松 · 轻松版',
    target: '肩',
    intensity: '轻松',
    duration_label: '约10分钟',
    overall_advice: '运动后做轻柔拉伸可减少肩部僵硬，第二天肩膀更轻松。',
    actions: [
      { emoji: '🤷', name: '耸肩后仰', target_muscle: '斜方肌', duration_seconds: 30, notes: '呼气时下巴微微向上推，感受颈部前侧拉伸', steps: ['自然站立，双脚与肩同宽', '深吸一口气，同时将肩膀向上耸起靠近耳朵', '呼气时慢慢将头向后仰，下巴朝天花板', '保持30秒，重复3组'] },
      { emoji: '🚪', name: '门框胸肩拉伸', target_muscle: '胸大肌·三角肌前束', duration_seconds: 45, notes: '肘部不要超过肩线，掌心朝前', steps: ['站在门框前，双臂呈"投降"姿势靠在门框两侧', '手掌扶门框，肘部与肩同高', '一只脚向前跨出，重心微微前移', '感受到胸前和肩前有拉伸感时停住', '保持45秒，换脚重复'] },
      { emoji: '🤲', name: '背后交叉手臂', target_muscle: '三角肌后束·菱形肌', duration_seconds: 30, notes: '手肘伸直但不要锁死，肩胛骨微微夹紧', steps: ['双脚与肩同宽站立', '一只手臂从下方穿过体前', '另一只手臂从上方绕过，两手在背后尽量靠近', '轻轻向胸部方向按压上臂', '保持30秒，换边'] },
      { emoji: '🪟', name: '手臂画圈放松', target_muscle: '肩袖肌群', duration_seconds: 20, notes: '速度要慢，幅度由小到大", "呼吸配合', steps: ['双臂自然垂于体侧', '从最小的圈开始，慢慢增大活动范围', '向前画10圈，再向后画10圈', '全程保持呼吸顺畅'] },
    ],
  },
  shoulder_hard: {
    title: '🔥 肩部强化 · 竞技版',
    target: '肩',
    intensity: '激烈',
    duration_label: '约20分钟',
    overall_advice: '高强度对抗后充分拉伸肩部，有效预防肩袖损伤。',
    actions: [
      { emoji: '🤷', name: '耸肩后仰', target_muscle: '斜方肌', duration_seconds: 30, steps: ['自然站立', '深吸气耸肩靠近耳朵', '呼气头向后仰', '保持30秒×3组'] },
      { emoji: '🚪', name: '门框胸肩拉伸', target_muscle: '胸大肌', duration_seconds: 45, steps: ['门框前投降姿势', '一脚前跨重心前移', '感受胸前拉伸', '保持45秒×2组'] },
      { emoji: '🤲', name: '背后交叉手臂', target_muscle: '三角肌后束', duration_seconds: 30, steps: ['下方手臂穿过体前', '上方手臂绕下背后相扣', '轻压上臂', '30秒×2组换边'] },
      { emoji: '💪', name: '招财猫式', target_muscle: '冈上肌·三角肌', duration_seconds: 30, notes: '大拇指朝上，小臂与地面平行', steps: ['大臂与地面平行，小臂垂直地面', '大拇指朝上，像招财猫手势', '缓缓放下小臂到最底部', '重复15次×2组'] },
      { emoji: '🔄', name: '弹力带外旋', target_muscle: '肩袖外旋肌', duration_seconds: 40, notes: '动作要慢，离心收缩为主', steps: ['弹力带一端固定，肘部贴近腰部', '前臂从身体正前方水平向外旋转', '慢放慢收，20次×2组'] },
    ],
  },

  // 膝部
  knee_easy: {
    title: '🧘 膝部保护 · 轻松版',
    target: '膝',
    intensity: '轻松',
    duration_label: '约10分钟',
    overall_advice: '膝盖承受体重压力，每次运动后拉伸股四头肌和腘绳肌可减轻膝关节负担。',
    actions: [
      { emoji: '🧍', name: '扶墙单腿站', target_muscle: '股四头肌', duration_seconds: 45, notes: '膝盖不要内扣，脚尖朝前', steps: ['单手扶墙，抬起一条腿', '膝盖弯曲90度，小腿垂直地面', '保持45秒×2组换边'] },
      { emoji: '🪑', name: '坐姿腿后侧拉伸', target_muscle: '腘绳肌', duration_seconds: 40, notes: '坐骨紧贴椅子，脊柱挺直向前倾', steps: ['坐在椅子边缘，一条腿伸直脚跟着地', '另一条腿弯曲踩实地面', '保持腰背挺直，慢慢向前屈髋', '感受到大腿后侧拉伸时停住', '保持40秒换边'] },
      { emoji: '🐸', name: '青蛙蹲', target_muscle: '髂胫束·内收肌', duration_seconds: 45, notes: '膝盖与脚尖同向，不要内扣', steps: ['双脚与肩同宽，慢慢蹲下', '双手撑在膝盖内侧，轻轻向外推', '感受大腿内侧和髋部的拉伸', '保持45秒×2组'] },
      { emoji: '🧘', name: '坐姿大腿内侧拉伸', target_muscle: '内收肌群', duration_seconds: 40, steps: ['坐在垫子上，双脚底相对', '膝盖向两侧打开下压', '轻轻将身体向前倾', '保持40秒'] },
    ],
  },
  knee_hard: {
    title: '🔥 膝部强化 · 竞技版',
    target: '膝',
    intensity: '激烈',
    duration_label: '约20分钟',
    overall_advice: '竞技级别需要更全面的膝关节防护，包括股四头肌离心和髂胫束放松。',
    actions: [
      { emoji: '🧍', name: '扶墙单腿站', target_muscle: '股四头肌', duration_seconds: 45, steps: ['单手扶墙抬起一条腿', '弯曲90度', '保持45秒×3组换边'] },
      { emoji: '🦵', name: '深蹲后小腿拉伸', target_muscle: '股四头肌', duration_seconds: 45, notes: '重心在脚尖和脚跟之间', steps: ['双脚与肩同宽站立', '慢慢深蹲至大腿与地面平行', '双手撑在膝盖上向上撑', '保持45秒'] },
      { emoji: '🪑', name: '坐姿腿后侧拉伸', target_muscle: '腘绳肌', duration_seconds: 40, steps: ['坐姿腿伸直脚跟着地', '腰背挺直前倾', '40秒×2组换边'] },
      { emoji: '🐸', name: '青蛙蹲', target_muscle: '髂胫束', duration_seconds: 45, steps: ['宽站距蹲下', '双手推膝向外', '45秒×2组'] },
      { emoji: '🔄', name: '膝盖绕环', target_muscle: '膝关节囊', duration_seconds: 30, notes: '动作缓慢，不要诱发疼痛', steps: ['站姿，一只腿轻轻抬起', '用双手抱住小腿，膝盖画圈', '顺时针10圈，逆时针10圈换边'] },
      { emoji: '🧘', name: '臀肌拉伸', target_muscle: '臀大肌·梨状肌', duration_seconds: 40, notes: '膝盖不要内扣，保持骶骨正对前方', steps: ['仰卧，一条腿弯曲脚踝放在对侧膝盖上', '双手环抱对侧腿向胸口方向拉', '保持40秒×2组换边'] },
    ],
  },

  // 腰背
  back_easy: {
    title: '🧘 腰背舒缓 · 轻松版',
    target: '腰',
    intensity: '轻松',
    duration_label: '约10分钟',
    overall_advice: '羽毛球弯腰救球多，腰部容易疲劳。运动后做猫牛式和坐姿扭转可有效缓解。',
    actions: [
      { emoji: '🐈', name: '猫牛式', target_muscle: '脊柱深层肌群', duration_seconds: 60, notes: '动作配合呼吸，吸气时充分延展', steps: ['四点支撑（双手双膝）', '吸气：腰部下沉，头向上仰（牛式）', '呼气：背部拱起，下巴收向胸口（猫式）', '缓慢交替，10个呼吸循环'] },
      { emoji: '🪑', name: '坐姿脊柱扭转', target_muscle: '竖脊肌·腰方肌', duration_seconds: 45, notes: '转动时骨盆保持稳定，肩膀不要耸起', steps: ['坐在椅子上，双脚踩实地面', '右手扶住左膝外侧', '左手扶住椅背，上半身向左扭转', '保持45秒换边'] },
      { emoji: '🌾', name: '骨盆前后倾', target_muscle: '髂腰肌·腹肌', duration_seconds: 40, notes: '活动骨盆带动腰椎，不是用力弯腰', steps: ['站立或坐在椅子边缘', '慢慢将骨盆向前倾（腰部自然拱起）', '慢慢将骨盆向后倾（腰部自然弯曲）', '缓慢交替20次'] },
      { emoji: '🤸', name: '婴儿式', target_muscle: '腰背筋膜', duration_seconds: 45, notes: '额头贴地时不要憋气，保持深层呼吸', steps: ['跪坐在垫子上，臀部坐在脚跟上', '身体向前趴下，双臂伸直贴地', '额头轻轻触地', '保持45秒，自然呼吸'] },
    ],
  },
  back_hard: {
    title: '🔥 腰背强化 · 竞技版',
    target: '腰',
    intensity: '激烈',
    duration_label: '约20分钟',
    overall_advice: '高强度竞技后腰背筋膜紧张，充分的拉伸和滚动放松能有效防止慢性腰痛。',
    actions: [
      { emoji: '🐈', name: '猫牛式', target_muscle: '脊柱', duration_seconds: 60, steps: ['四点支撑', '吸气下沉腰抬头', '呼气拱背收下巴', '10个呼吸循环'] },
      { emoji: '🪑', name: '坐姿脊柱扭转', target_muscle: '竖脊肌', duration_seconds: 45, steps: ['坐姿扭转', '手推膝肩向后', '45秒×2组换边'] },
      { emoji: '🌾', name: '骨盆前后倾', target_muscle: '髂腰肌', duration_seconds: 40, steps: ['骨盆前后活动', '带动腰椎运动', '20次循环'] },
      { emoji: '🤸', name: '婴儿式', target_muscle: '腰背筋膜', duration_seconds: 45, steps: ['跪坐前趴', '额头触地', '45秒×2组'] },
      { emoji: '🔄', name: '花生球筋膜放松', target_muscle: '腰方肌', duration_seconds: 60, notes: '将花生球放在腰部下方，轻轻滚动找到痛点后定住30秒', steps: ['仰卧，屈膝踩地，将花生球放在腰部下方', '轻轻左右滚动腰部找到酸痛点', '在痛点上定住30-60秒', '换边重复'] },
      { emoji: '🧘', name: '死虫式核心激活', target_muscle: '核心肌群', duration_seconds: 45, notes: '下背始终贴地，腰椎不会离开地面', steps: ['仰卧，双手向天花板伸直', '双腿屈髋屈膝90度', '慢慢放下对侧手和脚（不触地）', '保持下背贴地，交替20次×2组'] },
    ],
  },

  // 全身通用
  fullbody_easy: {
    title: '🧘 全身放松 · 轻松版',
    target: '全身',
    intensity: '轻松',
    duration_label: '约15分钟',
    overall_advice: '轻度休闲后做全身拉伸，帮助身体恢复，减少第二天肌肉酸痛。',
    actions: [
      { emoji: '🚪', name: '门框胸肩拉伸', target_muscle: '胸部·肩部', duration_seconds: 30, steps: ['门框前投降姿势', '一脚前跨', '感受胸前拉伸', '30秒×2组'] },
      { emoji: '🤲', name: '背后交叉手臂', target_muscle: '肩后侧', duration_seconds: 30, steps: ['双臂背后交叉', '轻轻按压', '30秒×2组换边'] },
      { emoji: '🧍', name: '扶墙股四头肌拉伸', target_muscle: '大腿前侧', duration_seconds: 30, steps: ['扶墙单腿站立', '弯屈膝关节脚向臀部靠近', '30秒×2组换边'] },
      { emoji: '🪑', name: '坐姿腘绳肌拉伸', target_muscle: '大腿后侧', duration_seconds: 30, steps: ['坐姿腿伸直', '腰背挺直前倾', '30秒×2组换边'] },
      { emoji: '🐸', name: '青蛙蹲', target_muscle: '髋内侧', duration_seconds: 30, steps: ['宽站距蹲下', '双手推膝向外', '30秒×2组'] },
      { emoji: '🤸', name: '婴儿式', target_muscle: '腰背', duration_seconds: 30, steps: ['跪坐前趴', '额头触地', '30秒×2组'] },
    ],
  },
  fullbody_hard: {
    title: '🔥 全身恢复 · 竞技版',
    target: '全身',
    intensity: '激烈',
    duration_label: '约25分钟',
    overall_advice: '高强度比赛后全身筋膜都有疲劳，这套方案覆盖全身每个主要肌群，确保第二天继续高水平发挥。',
    actions: [
      { emoji: '🤷', name: '耸肩后仰', target_muscle: '颈部·斜方肌', duration_seconds: 30, steps: ['耸肩向上', '头向后仰', '30秒×2组'] },
      { emoji: '🚪', name: '门框胸肩拉伸', target_muscle: '胸大肌', duration_seconds: 45, steps: ['投降姿势门框前', '一脚前跨重心前移', '45秒×2组'] },
      { emoji: '💪', name: '招财猫式', target_muscle: '冈上肌', duration_seconds: 30, steps: ['大臂平行地面', '大拇指朝上', '慢起慢放15次×2组'] },
      { emoji: '🤲', name: '背后交叉手臂', target_muscle: '三角肌后束', duration_seconds: 30, steps: ['双臂背后交叉', '轻压上臂', '30秒×2组换边'] },
      { emoji: '🧍', name: '扶墙股四头肌拉伸', target_muscle: '股四头肌', duration_seconds: 45, steps: ['扶墙单腿站', '脚向臀部靠近', '45秒×2组换边'] },
      { emoji: '🦵', name: '深蹲离心收缩', target_muscle: '股四头肌离心', duration_seconds: 40, notes: '下蹲3秒，站起来1秒，离心为主', steps: ['靠墙深蹲或徒手深蹲', '下蹲用3秒，站起来用1秒', '8-10次×2组'] },
      { emoji: '🪑', name: '坐姿腘绳肌拉伸', target_muscle: '腘绳肌', duration_seconds: 40, steps: ['坐姿腿伸直', '腰背挺直前倾', '40秒×2组换边'] },
      { emoji: '🐸', name: '青蛙蹲', target_muscle: '髂胫束', duration_seconds: 45, steps: ['宽站距蹲下', '双手推膝向外', '45秒×2组'] },
      { emoji: '🐈', name: '猫牛式', target_muscle: '脊柱', duration_seconds: 45, steps: ['四点支撑', '吸气下沉呼气拱背', '10个呼吸循环'] },
      { emoji: '🧘', name: '臀肌拉伸（鸽式）', target_muscle: '臀大肌·梨状肌', duration_seconds: 45, notes: '前腿小腿可以横向调整角度找到最合适拉伸感', steps: ['右腿在前，小腿横向放置', '左腿在后伸直', '慢慢将上半身向前倾', '45秒×2组换边'] },
      { emoji: '🤸', name: '婴儿式', target_muscle: '腰背筋膜', duration_seconds: 45, steps: ['跪坐前趴', '额头触地', '45秒×2组'] },
      { emoji: '🔄', name: '花生球全身放松', target_muscle: '足底·小腿·背', duration_seconds: 60, notes: '从上到下滚动：足底→小腿→背阔肌，每个部位找到痛点定住', steps: ['用花生球或滚筒从足底开始', '沿小腿后侧向上滚动', '最后到背阔肌位置', '每个痛点定住30秒'] },
    ],
  },
}

const OFFLINE_PLAN_LIST = [
  { id: 'shoulder_easy', emoji: '🦴', tag: '肩部' },
  { id: 'shoulder_hard', emoji: '🔥', tag: '肩部' },
  { id: 'knee_easy', emoji: '🦴', tag: '膝部' },
  { id: 'knee_hard', emoji: '🔥', tag: '膝部' },
  { id: 'back_easy', emoji: '🦴', tag: '腰背' },
  { id: 'back_hard', emoji: '🔥', tag: '腰背' },
  { id: 'fullbody_easy', emoji: '🦴', tag: '全身' },
  { id: 'fullbody_hard', emoji: '🔥', tag: '全身' },
]

export default function Stretch() {
  const [mode, setMode] = useState(null)    // null | 'ai' | 'offline'
  const [step, setStep] = useState(1)        // 1=表单 2=执行
  const [duration, setDuration] = useState(60)
  const [intensity, setIntensity] = useState('普通')
  const [painAreas, setPainAreas] = useState([])
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  const toggleArea = (area) => {
    setPainAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await generateStretch({
        duration,
        intensity,
        pain_areas: painAreas.length > 0 ? painAreas : ['肩'],
        recovery_time: 15,
      })
      setPlan(result)
      setStep(2)
      setCurrentAction(0)
    } catch (e) {
      alert('生成失败，请检查服务连接')
    }
    setLoading(false)
  }

  const selectOfflinePlan = (planId) => {
    setPlan(OFFLINE_PLANS[planId])
    setStep(2)
    setCurrentAction(0)
  }

  const startTimer = (seconds) => {
    setTimer(seconds)
    setTimerRunning(true)
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setTimerRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── 模式选择 ──
  if (!mode) {
    return (
      <div className="space-y-4 py-2">
        <h2 className="font-bold text-xl">🧘 拉伸方案</h2>
        <div className="grid grid-cols-1 gap-3">
          <button className="card p-5 border border-cyan-400/40 bg-cyan-400/5 hover:bg-cyan-400/10 transition-all text-left space-y-2"
            onClick={() => setMode('ai')}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <div className="font-bold">AI 智能生成</div>
                <div className="text-white/50 text-sm">根据你的情况，动态生成专属方案</div>
              </div>
            </div>
          </button>
          <button className="card p-5 border border-green-400/40 bg-green-400/5 hover:bg-green-400/10 transition-all text-left space-y-2"
            onClick={() => setMode('offline')}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📦</span>
              <div>
                <div className="font-bold">离线预设方案</div>
                <div className="text-white/50 text-sm">无需网络，随时可用 · 精选动作库</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ── 离线方案选择 ──
  if (mode === 'offline' && step === 1) {
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">📦 离线预设方案</h2>
          <button className="text-white/40 text-sm hover:text-white" onClick={() => { setMode(null); setStep(1) }}>← 返回</button>
        </div>
        <p className="text-white/40 text-xs">无需网络，从预设库中选择方案</p>

        {[
          { category: '🦴 肩部', plans: OFFLINE_PLAN_LIST.filter(p => p.tag === '肩部') },
          { category: '🦴 膝部', plans: OFFLINE_PLAN_LIST.filter(p => p.tag === '膝部') },
          { category: '🦴 腰背', plans: OFFLINE_PLAN_LIST.filter(p => p.tag === '腰背') },
          { category: '🦴 全身', plans: OFFLINE_PLAN_LIST.filter(p => p.tag === '全身') },
        ].map(group => (
          <div key={group.category} className="space-y-2">
            <h3 className="text-sm font-semibold text-white/60">{group.category}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.plans.map(planMeta => {
                const p = OFFLINE_PLANS[planMeta.id]
                return (
                  <button key={planMeta.id}
                    className="card p-4 border border-white/10 hover:border-cyan-400/50 transition-all text-left space-y-1"
                    onClick={() => selectOfflinePlan(planMeta.id)}>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{planMeta.emoji}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${planMeta.emoji === '🔥' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {planMeta.emoji === '🔥' ? '竞技' : '轻松'}
                      </span>
                    </div>
                    <div className="font-medium text-sm leading-tight">{p.title.split('·')[0].replace('🧘 ', '').replace('🔥 ', '')}</div>
                    <div className="text-white/40 text-xs">{p.duration_label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── AI 模式表单 ──
  if (mode === 'ai' && step === 1) {
    return (
      <div className="space-y-5 py-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">🤖 AI 拉伸方案</h2>
          <button className="text-white/40 text-sm hover:text-white" onClick={() => setMode(null)}>← 返回</button>
        </div>

        {/* 打球时长 */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-sm text-white/70">⏱ 打球时长</h3>
          <div className="text-center">
            <span className="text-4xl font-bold gradient-text">{duration}</span>
            <span className="text-white/50 ml-1">分钟</span>
          </div>
          <input type="range" min={10} max={180} step={10} value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-full accent-cyan-400" />
          <div className="flex justify-between text-xs text-white/30">
            <span>10分钟</span><span>90分钟</span><span>180分钟</span>
          </div>
        </div>

        {/* 运动强度 */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-sm text-white/70">💪 运动强度</h3>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map(i => (
              <button key={i.value}
                className={`p-3 rounded-xl border text-center transition-all ${intensity === i.value ? 'border-cyan-400 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
                onClick={() => setIntensity(i.value)}>
                <div className="text-2xl">{i.emoji}</div>
                <div className="text-xs font-medium mt-1">{i.value}</div>
                <div className="text-white/40 text-xs">{i.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 不适部位 */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-sm text-white/70">🎯 不适部位（可多选）</h3>
          <div className="flex flex-wrap gap-2">
            {AREAS.map(area => (
              <button key={area} className={`tag ${painAreas.includes(area) ? 'active' : ''}`}
                onClick={() => toggleArea(area)}>
                {area}
              </button>
            ))}
          </div>
          {painAreas.length === 0 && <p className="text-white/30 text-xs">未选择时将生成全身方案</p>}
        </div>

        {/* 生成按钮 */}
        <button className="btn-primary w-full text-base py-4" onClick={handleGenerate} disabled={loading}>
          {loading ? '⏳ 正在编排方案...' : '🚀 生成我的专属方案'}
        </button>
      </div>
    )
  }

  // ── 方案执行界面 ──
  if (step === 2 && plan) {
    const action = plan.actions[currentAction]
    const progress = Math.round(((currentAction + 1) / plan.actions.length) * 100)
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{plan.title}</h2>
          <span className="text-white/40 text-sm">{currentAction + 1}/{plan.actions.length}</span>
        </div>

        {/* 进度条 */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00d4ff, #00ff88)' }} />
        </div>

        {/* 当前动作 */}
        <div className="card p-6 space-y-4">
          <div className="text-center space-y-2">
            <span className="text-5xl">{action.emoji}</span>
            <h3 className="text-xl font-bold">{action.name}</h3>
            <span className="tag">{action.target_muscle}</span>
          </div>

          {/* 步骤 */}
          <div className="space-y-2">
            {action.steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #00ff88)', color: '#000' }}>{i + 1}</span>
                <p className="text-white/80 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {/* 备注 */}
          {action.notes && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-300 text-xs">💡 {action.notes}</p>
            </div>
          )}

          {/* 计时器 */}
          <div className="text-center space-y-3">
            <div className="text-4xl font-mono font-bold gradient-text">
              {timerRunning ? timer : action.duration_seconds}s
            </div>
            {!timerRunning ? (
              <button className="btn-primary w-full" onClick={() => startTimer(action.duration_seconds)}>
                ▶ 开始计时 {action.duration_seconds}秒
              </button>
            ) : (
              <div className="text-white/50 text-sm">保持动作，专注呼吸...</div>
            )}
          </div>
        </div>

        {/* 导航 */}
        <div className="flex gap-3">
          {currentAction > 0 && (
            <button className="btn-secondary flex-1" onClick={() => setCurrentAction(c => c - 1)}>← 上一个</button>
          )}
          {currentAction < plan.actions.length - 1 ? (
            <button className="btn-primary flex-1" onClick={() => { setCurrentAction(c => c + 1); setTimerRunning(false) }}>
              下一个 →
            </button>
          ) : (
            <button className="btn-primary flex-1" style={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}
              onClick={() => { setPlan(null); setStep(1); setMode(null); setPainAreas([]) }}>
              ✅ 完成恢复！
            </button>
          )}
        </div>

        {/* 总建议 */}
        <div className="card p-4 bg-green-500/5 border-green-500/20">
          <p className="text-green-400 text-sm">🌿 {plan.overall_advice}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 py-2">
      <h2 className="font-bold text-xl">🧘 生成拉伸方案</h2>

      {/* 打球时长 */}
      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-sm text-white/70">⏱ 打球时长</h3>
        <div className="text-center">
          <span className="text-4xl font-bold gradient-text">{duration}</span>
          <span className="text-white/50 ml-1">分钟</span>
        </div>
        <input type="range" min={10} max={180} step={10} value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-full accent-cyan-400" />
        <div className="flex justify-between text-xs text-white/30">
          <span>10分钟</span><span>90分钟</span><span>180分钟</span>
        </div>
      </div>

      {/* 运动强度 */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-sm text-white/70">💪 运动强度</h3>
        <div className="grid grid-cols-3 gap-2">
          {INTENSITIES.map(i => (
            <button key={i.value}
              className={`p-3 rounded-xl border text-center transition-all ${intensity === i.value ? 'border-cyan-400 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
              onClick={() => setIntensity(i.value)}>
              <div className="text-2xl">{i.emoji}</div>
              <div className="text-xs font-medium mt-1">{i.value}</div>
              <div className="text-white/40 text-xs">{i.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 不适部位 */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-sm text-white/70">🎯 不适部位（可多选）</h3>
        <div className="flex flex-wrap gap-2">
          {AREAS.map(area => (
            <button key={area} className={`tag ${painAreas.includes(area) ? 'active' : ''}`}
              onClick={() => toggleArea(area)}>
              {area}
            </button>
          ))}
        </div>
        {painAreas.length === 0 && <p className="text-white/30 text-xs">未选择时将生成全身方案</p>}
      </div>

      {/* 生成按钮 */}
      <button className="btn-primary w-full text-base py-4" onClick={handleGenerate} disabled={loading}>
        {loading ? '⏳ 正在编排方案...' : '🚀 生成我的专属方案'}
      </button>
    </div>
  )
}
