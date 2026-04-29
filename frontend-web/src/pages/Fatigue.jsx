import { useState } from 'react'

// 本地疲劳计算逻辑（不依赖API）
function calculateFatigueLocal(answers) {
  const { squat_quality, shoulder_rotation, perceived_fatigue, sleep_quality } = answers

  // 计算疲劳分数 (0-100)
  let score = perceived_fatigue * 8 // 0-80

  // 深蹲质量扣分
  if (squat_quality === '流畅') score += 0
  else if (squat_quality === '有点吃力') score += 10
  else if (squat_quality === '很困难') score += 20

  // 睡眠质量扣分
  if (sleep_quality === '好') score += 0
  else if (sleep_quality === '一般') score += 8
  else if (sleep_quality === '差') score += 16

  // 肩关节角度受限扣分 (正常90°)
  const shoulderDeficit = Math.max(0, 90 - shoulder_rotation)
  score += (shoulderDeficit / 90) * 16

  // 判断疲劳等级
  let level, recommendation, priority_areas, recovery_plan

  if (score < 35) {
    level = '轻度'
    recommendation = '身体状态良好，可以正常运动。建议运动后做好拉伸放松即可。'
    priority_areas = ['全身放松', '轻度拉伸']
    recovery_plan = [
      '运动后全身拉伸10分钟',
      '睡前放松小腿和肩部',
      '保持充足睡眠（7-8小时）'
    ]
  } else if (score < 60) {
    level = '中度'
    recommendation = '身体有明显疲劳积累，建议减少运动强度或休息1-2天。优先恢复重点部位。'
    priority_areas = ['股四头肌', '髋屈肌', '肩袖肌群']
    recovery_plan = [
      '休息1天，避免高强度运动',
      '针对股四头肌和髋屈肌进行拉伸',
      '肩袖肌群激活练习',
      '使用泡沫轴放松下肢',
      '充足睡眠，补充蛋白质'
    ]
  } else {
    level = '重度'
    recommendation = '身体疲劳程度较高，建议完全休息2-3天。避免一切高强度运动，以免受伤。'
    priority_areas = ['全身恢复', '重点疼痛区域', '睡眠质量']
    recovery_plan = [
      '完全休息2-3天',
      '每天冰敷疼痛部位15分钟',
      '轻度行走活动促进血液循环',
      '摄入抗炎食物（深色蔬菜、鱼类）',
      '如症状持续，请就医检查'
    ]
  }

  return {
    level,
    score: Math.round(score),
    recommendation,
    priority_areas,
    recovery_plan,
    // 额外本地数据
    fatigue_factors: {
      perceived: perceived_fatigue,
      squat: squat_quality,
      sleep: sleep_quality,
      shoulder: shoulder_rotation
    }
  }
}

export default function Fatigue() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ squat_quality: '', shoulder_rotation: 90, perceived_fatigue: 5, sleep_quality: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // 监听网络状态
  useState(() => {
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  const set = (k, v) => setAnswers(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 尝试使用本地计算（即使在线也优先本地，以展示离线能力）
      // 如果需要API调用，可以在这里切换
      await new Promise(r => setTimeout(r, 600)) // 模拟API延迟
      const res = calculateFatigueLocal(answers)
      setResult(res)
      
      // 保存到localStorage
      const history = JSON.parse(localStorage.getItem('fatigue_history') || '[]')
      history.unshift({ ...res, timestamp: new Date().toISOString() })
      localStorage.setItem('fatigue_history', JSON.stringify(history.slice(0, 10)))
    } catch (e) {
      alert('评估失败，请重试')
    }
    setLoading(false)
  }

  const levelColor = { '轻度': '#00ff88', '中度': '#ffd700', '重度': '#ff4444' }
  const levelEmoji = { '轻度': '✅', '中度': '⚠️', '重度': '🚨' }

  if (result) return (
    <div className="space-y-4 py-2">
      <h2 className="font-bold text-xl">📊 评估结果</h2>
      <div className="card p-6 text-center space-y-4">
        <div className="text-5xl">{levelEmoji[result.level]}</div>
        <div>
          <span className="text-3xl font-bold" style={{ color: levelColor[result.level] }}>{result.level}疲劳</span>
          {result.score !== undefined && <span className="text-white/40 text-sm ml-2">({result.score}/100)</span>}
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-left">
          <p className="text-white/70 text-sm">💬 {result.recommendation}</p>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-sm text-white/70">🎯 重点恢复部位</h3>
        <div className="flex flex-wrap gap-2">
          {result.priority_areas.map((a, i) => <span key={i} className="tag">{a}</span>)}
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-sm text-white/70">📋 今日恢复方案</h3>
        <div className="space-y-2">
          {result.recovery_plan.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0">{i+1}</span>
              <span className="text-sm text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {isOffline && (
        <div className="text-xs text-yellow-400/60 text-center">📴 结果已保存至本地</div>
      )}

      <button className="btn-secondary w-full" onClick={() => { setResult(null); setStep(0); setAnswers({ squat_quality: '', shoulder_rotation: 90, perceived_fatigue: 5, sleep_quality: '' }) }}>
        🔄 重新评估
      </button>
    </div>
  )

  const questions = [
    {
      title: '🦵 深蹲质量', key: 'squat_quality',
      options: [{ v: '流畅', e: '😊' }, { v: '有点吃力', e: '😅' }, { v: '很困难', e: '😰' }]
    },
    {
      title: '😴 昨晚睡眠', key: 'sleep_quality',
      options: [{ v: '好', e: '😴' }, { v: '一般', e: '😐' }, { v: '差', e: '😫' }]
    },
  ]

  const q = questions[step]

  if (step < 2) return (
    <div className="space-y-5 py-2">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-xl">🔍 疲劳自测</h2>
        <span className="text-white/40 text-sm">{step + 1}/4</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400" style={{ width: `${(step + 1) * 25}%` }} /></div>
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-lg">{q.title}</h3>
        <div className="space-y-3">
          {q.options.map(o => (
            <button key={o.v} onClick={() => { set(q.key, o.v); setStep(s => s + 1) }}
              className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${answers[q.key] === o.v ? 'border-cyan-400 bg-cyan-400/15' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}>
              <span className="text-2xl">{o.e}</span>
              <span className="font-medium">{o.v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (step === 2) return (
    <div className="space-y-5 py-2">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-xl">🔍 疲劳自测</h2>
        <span className="text-white/40 text-sm">3/4</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 w-3/4" /></div>
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-lg">😰 主观疲劳感</h3>
        <div className="text-center">
          <span className="text-5xl font-bold gradient-text">{answers.perceived_fatigue}</span>
          <span className="text-white/50"> / 10</span>
        </div>
        <input type="range" min={1} max={10} value={answers.perceived_fatigue}
          onChange={e => set('perceived_fatigue', Number(e.target.value))} className="w-full accent-cyan-400" />
        <div className="flex justify-between text-xs text-white/30"><span>完全不累</span><span>精疲力竭</span></div>
        <button className="btn-primary w-full" onClick={() => setStep(3)}>下一步 →</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-xl">🔍 疲劳自测</h2>
        <span className="text-white/40 text-sm">4/4</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400" /></div>
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-lg">💪 肩关节外旋角度</h3>
        <p className="text-white/50 text-sm">手臂侧平举，向外旋转，估计角度</p>
        <div className="text-center">
          <span className="text-5xl font-bold gradient-text">{answers.shoulder_rotation}°</span>
        </div>
        <input type="range" min={0} max={90} step={5} value={answers.shoulder_rotation}
          onChange={e => set('shoulder_rotation', Number(e.target.value))} className="w-full accent-cyan-400" />
        <div className="flex justify-between text-xs text-white/30"><span>0° 受限</span><span>90° 正常</span></div>
        <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ 评估中...' : '📊 查看评估结果'}
        </button>
      </div>
    </div>
  )
}
