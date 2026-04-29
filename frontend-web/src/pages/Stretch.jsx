import { useState } from 'react'
import { generateStretch } from '../api.js'

const AREAS = ['肩', '肘', '膝', '踝', '腰', '腕', '小腿']
const INTENSITIES = [
  { value: '轻松', emoji: '😌', desc: '悠闲打球' },
  { value: '普通', emoji: '😊', desc: '正常强度' },
  { value: '激烈', emoji: '🔥', desc: '高强度竞技' },
]

export default function Stretch() {
  const [step, setStep] = useState(1)
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
      setStep(3)
      setCurrentAction(0)
    } catch (e) {
      alert('生成失败，请检查服务连接')
    }
    setLoading(false)
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

  if (step === 3 && plan) {
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
              onClick={() => { setPlan(null); setStep(1); setPainAreas([]) }}>
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
