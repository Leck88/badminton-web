import { useState } from 'react'

const WEEK_PLAN = {
  '周一': { play: true,  stretch: ['肩袖外旋拉伸', '胸前交叉拉伸', '股四头肌拉伸'], ice: '肩膝冰敷10分钟', foam: '大腿外侧', time: '打球后30分钟内' },
  '周二': { play: false, stretch: ['猫牛式脊椎放松', '踝关节环绕放松'], ice: null, foam: '小腿', time: '晚上任意时间' },
  '周三': { play: true,  stretch: ['腕伸肌拉伸', '弓步髂腰肌拉伸', '小腿三头肌拉伸'], ice: '踝关节冰敷', foam: '髂胫束', time: '打球后30分钟内' },
  '周四': { play: false, stretch: ['仰卧膝触胸拉伸', '肩袖外旋拉伸'], ice: null, foam: '背部', time: '早上或晚上' },
  '周五': { play: false, stretch: ['全身5分钟主动拉伸'], ice: null, foam: null, time: '任意时间' },
  '周六': { play: true,  stretch: ['完整15分钟拉伸序列'], ice: '全身主要关节冰敷', foam: '全身放松', time: '打球后30分钟内' },
  '周日': { play: false, stretch: ['轻度拉伸10分钟', '泡沫轴全身放松'], ice: null, foam: '全身', time: '上午' },
}

export default function Weekly() {
  const [selectedDay, setSelectedDay] = useState('周一')
  const day = WEEK_PLAN[selectedDay]

  return (
    <div className="space-y-4 py-2">
      <h2 className="font-bold text-xl">📅 本周恢复计划</h2>
      <p className="text-white/50 text-sm">每周3次打球的标准恢复方案</p>

      {/* 周历 */}
      <div className="grid grid-cols-7 gap-1">
        {Object.entries(WEEK_PLAN).map(([d, info]) => (
          <button key={d} onClick={() => setSelectedDay(d)}
            className={`p-2 rounded-xl text-center transition-all ${selectedDay === d ? 'bg-cyan-400/20 border border-cyan-400' : 'bg-white/5 border border-transparent'}`}>
            <div className="text-xs text-white/50">{d.slice(1)}</div>
            <div className="text-lg mt-1">{info.play ? '🏸' : '😴'}</div>
          </button>
        ))}
      </div>

      {/* 当日详情 */}
      <div className="card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{selectedDay}</h3>
          <span className={`tag ${day.play ? '' : 'bg-green-500/15 border-green-500/30 text-green-400'}`}>
            {day.play ? '🏸 打球日' : '😴 恢复日'}
          </span>
        </div>

        {/* 拉伸 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/60">🧘 拉伸动作</h4>
          <div className="space-y-2">
            {day.stretch.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0">{i+1}</span>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 冰敷热敷 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/60">🧊 冰敷建议</h4>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-blue-300 text-sm">{day.ice || '今日无需冰敷，以热敷或轻柔按摩为主'}</p>
          </div>
        </div>

        {/* 泡沫轴 */}
        {day.foam && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/60">🔄 泡沫轴部位</h4>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
              <p className="text-purple-300 text-sm">重点放松：{day.foam}</p>
            </div>
          </div>
        )}

        {/* 时间建议 */}
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
          <span>⏰</span>
          <p className="text-yellow-300 text-sm">{day.time}</p>
        </div>
      </div>

      {/* 小贴士 */}
      <div className="card p-4 space-y-2">
        <h4 className="text-sm font-semibold text-white/70">💡 本周要点</h4>
        <div className="space-y-1 text-xs text-white/50">
          <p>• 打球后30分钟内是拉伸黄金期</p>
          <p>• 冰敷时间：每次15分钟，布包住冰袋不要直接接触皮肤</p>
          <p>• 泡沫轴痛点停留10秒后松开，重复3次</p>
          <p>• 睡眠是最好的恢复，保证7-8小时</p>
        </div>
      </div>
    </div>
  )
}
