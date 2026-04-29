import { useState, useEffect } from 'react'

export default function Home({ onStart }) {
  const [recentRecords, setRecentRecords] = useState([])

  useEffect(() => {
    // 加载历史记录
    const fatigueHistory = JSON.parse(localStorage.getItem('fatigue_history') || '[]')
    const chatHistory = localStorage.getItem('chat_history')
    const hasChats = chatHistory && JSON.parse(chatHistory).length > 1
    
    // 合并显示最近活动
    const records = fatigueHistory.slice(0, 3).map(h => ({
      type: 'fatigue',
      level: h.level,
      timestamp: h.timestamp,
      score: h.score
    }))
    setRecentRecords(records)
  }, [])

  const formatTime = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 3600000) return `${Math.floor(diff/60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff/3600000)}小时前`
    return `${Math.floor(diff/86400000)}天前`
  }

  const levelColor = { '轻度': '#00ff88', '中度': '#ffd700', '重度': '#ff4444' }

  const features = [
    { icon: '🧘', title: '智能拉伸编排', desc: '根据打球时长、强度、酸痛部位生成专属方案' },
    { icon: '🎙️', title: '语音实时指导', desc: '手机摄像头检测动作，AI语音实时纠错' },
    { icon: '📚', title: '伤病专业问答', desc: '肩袖/网球肘/羽毛球膝，引用运动医学指南' },
    { icon: '🔍', title: '10秒疲劳自测', desc: '简单动作评估疲劳等级，给出恢复优先级' },
  ]

  return (
    <div className="space-y-6 py-2">
      {/* Hero */}
      <div className="card p-6 text-center space-y-3"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,255,136,0.08))' }}>
        <div className="text-5xl">🏸</div>
        <h2 className="text-2xl font-bold gradient-text">羽后伸 AI 康复师</h2>
        <p className="text-white/60 text-sm leading-relaxed">
          全球首个专为羽毛球「杀球-弓步-急停」<br/>动作链设计的 AI 康复师
        </p>
        <button className="btn-primary w-full mt-4" onClick={onStart}>
          🚀 开始今日恢复
        </button>
      </div>

      {/* 最近记录 */}
      {recentRecords.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white/60 text-sm font-medium px-1">📊 最近记录</h3>
          <div className="card p-4 space-y-2">
            {recentRecords.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🔍</span>
                  <span className="text-white/70">疲劳自测</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium" style={{ color: levelColor[r.level] }}>{r.level}</span>
                  {r.score !== undefined && <span className="text-white/40 text-xs">({r.score}/100)</span>}
                  <span className="text-white/30 text-xs">{formatTime(r.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 功能卡片 */}
      <div className="space-y-2">
        <h3 className="text-white/60 text-sm font-medium px-1">核心功能</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="card p-4 space-y-2 hover:border-white/20 transition-colors">
              <span className="text-2xl">{f.icon}</span>
              <h4 className="font-semibold text-sm">{f.title}</h4>
              <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 受伤警告 */}
      <div className="card p-4 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex gap-3 items-start">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-yellow-400 text-sm font-medium">温馨提示</p>
            <p className="text-white/50 text-xs mt-1">本 App 提供运动恢复建议，不代替医疗诊断。急性损伤请及时就医。</p>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-3">
        {[['15+', '专项动作'], ['5', '身体区域'], ['AI', '智能编排']].map(([val, label], i) => (
          <div key={i} className="card p-4 text-center">
            <div className="text-xl font-bold gradient-text">{val}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* 离线状态提示 */}
      {!navigator.onLine && (
        <div className="card p-4 border-yellow-500/30 bg-yellow-500/5 text-center">
          <span className="text-yellow-400 text-sm">📴 当前处于离线模式，部分功能可能受限</span>
        </div>
      )}
    </div>
  )
}
