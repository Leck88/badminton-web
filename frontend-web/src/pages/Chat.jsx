import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api.js'

const SUGGESTIONS = ['打了2小时球，肩膀酸，帮我拉伸', '跟腱有点不舒服怎么办', '膝盖弓步后很痛', '怎么预防网球肘', '今天可以打球吗']

// 离线知识库：常见问题回复
const OFFLINE_KB = {
  patterns: [
    { keywords: ['肩膀', '酸', '肩'], response: '肩膀酸痛通常是肩袖肌群疲劳或肩胛骨不稳定导致的。建议：\n\n1. 胸小肌拉伸：门框前俯身，保持30秒×3组\n2. 肩外旋练习：弹力带抗阻外旋，15次×3组\n3. 肩胛下沉练习：每日做肩胛下沉15次×2组\n\n近期减少杀球频率，加强肩部热身。', suggestions: ['跟腱有点不舒服怎么办', '膝盖弓步后很痛'] },
    { keywords: ['跟腱', '脚后跟', '踝'], response: '跟腱不适需高度重视！建议：\n\n1. 立即冰敷10分钟，抬高患肢\n2. 腓肠肌/比目鱼肌拉伸：墙壁前弓步，保持30秒×3组\n3. 踝关节背屈练习：坐姿拉弹力带，20次×3组\n4. 睡前用泡沫轴放松小腿\n\n⚠️ 如持续疼痛超过3天或出现肿胀，请停止运动并就医。', suggestions: ['膝盖弓步后很痛', '肩膀酸怎么拉伸'] },
    { keywords: ['膝盖', '痛', '膝'], response: '膝盖问题在羽毛球中很常见，通常与弓步和急停有关。\n\n1. 股四头肌拉伸：站立扶墙拉伸大腿前侧，30秒×2侧\n2. 臀中肌激活：侧卧抬腿，15次×3组\n3. 髂胫束放松：侧卧滚泡沫轴，每侧2分钟\n4. 护膝支撑\n\n❌ 出现肿胀或卡顿感时禁止继续打球。', suggestions: ['跟腱有点不舒服怎么办', '怎么预防网球肘'] },
    { keywords: ['网球肘', '肘', '外侧'], response: '网球肘（肱骨外上髁炎）在羽毛球反手击球中常见。\n\n1. 离心握力练习：手握弹力球慢放，15次×3组\n2. 伸腕练习：坐姿哑铃屈腕，15次×3组\n3. 前臂筋膜放松：每日用拇指按压痛点2分钟\n4. 护肘带加压\n\n注意反手动作不要过度用力，发力时手腕保持中立位。', suggestions: ['膝盖弓步后很痛', '肩膀酸怎么拉伸'] },
    { keywords: ['可以', '打球', '今天'], response: '能否继续打球取决于：\n\n✅ 可以继续的情况：\n- 轻微肌肉酸痛，活动后缓解\n- 无明显疼痛和肿胀\n- 疲劳自测为轻度\n\n⚠️ 建议休息的情况：\n- 关节有明显疼痛\n- 疲劳自测为中度或重度\n- 睡眠质量差\n- 连续运动超过3天\n\n建议先做一次疲劳自测评估身体状态。', suggestions: ['帮我做疲劳自测', '肩膀酸怎么拉伸'] },
    { keywords: ['拉伸', '热身', '放松'], response: '羽毛球后必做的5个拉伸动作：\n\n1. 肩部交叉拉伸（30秒×2侧）\n2. 胸部扩展（30秒×2组）\n3. 弓步小腿拉伸（30秒×2侧）\n4. 股四头肌拉伸（30秒×2侧）\n5. 髋屈肌拉伸（30秒×2侧）\n\n⏱️ 建议总时长：10-15分钟\n💡 强度：轻微牵拉感，不要过度疼痛', suggestions: ['跟腱有点不舒服怎么办', '膝盖弓步后很痛'] },
  ],
  default: '感谢你的提问！为了给你更准确的建议，请告诉我：\n\n1. 具体哪个部位不适？\n2. 打球后不适还是运动中？\n3. 持续多长时间了？\n\n或者你可以尝试「疲劳自测」让我评估你的身体状态。🏸',
}

function getOfflineResponse(message) {
  const lower = message.toLowerCase()
  for (const item of OFFLINE_KB.patterns) {
    if (item.keywords.some(k => lower.includes(k))) {
      return { message: item.response, suggestions: item.suggestions }
    }
  }
  return { message: OFFLINE_KB.default, suggestions: ['帮我做疲劳自测', '肩膀酸怎么拉伸'] }
}

export default function Chat() {
  const [messages, setMessages] = useState([{ role: 'ai', content: '你好！我是羽后伸 AI 康复师 🏸\n\n告诉我今天打了多久球、哪里不舒服，我来为你生成专属恢复方案！' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const bottomRef = useRef(null)

  // 初始化：从localStorage加载聊天历史
  useEffect(() => {
    const saved = localStorage.getItem('chat_history')
    if (saved) {
      try {
        const history = JSON.parse(saved)
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history)
        }
      } catch (e) { /* ignore */ }
    }
  }, [])

  // 保存聊天历史到localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chat_history', JSON.stringify(messages))
    }
  }, [messages])

  // 监听网络状态
  useEffect(() => {
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      let res
      if (isOffline) {
        // 离线模式：使用本地知识库
        await new Promise(r => setTimeout(r, 800)) // 模拟延迟
        res = getOfflineResponse(msg)
      } else {
        res = await sendChat(msg, sessionId)
      }
      setMessages(prev => [...prev, { role: 'ai', content: res.message, suggestions: res.suggestions }])
    } catch (e) {
      // API失败时降级到离线知识库
      const offlineRes = getOfflineResponse(msg)
      setMessages(prev => [...prev, { role: 'ai', content: offlineRes.message + '\n\n⚠️ 网络异常，已切换到离线模式', suggestions: offlineRes.suggestions }])
      setIsOffline(true)
    }
    setLoading(false)
  }

  const clearHistory = () => {
    if (confirm('确定清除聊天记录？')) {
      setMessages([{ role: 'ai', content: '你好！我是羽后伸 AI 康复师 🏸\n\n告诉我今天打了多久球、哪里不舒服，我来为你生成专属恢复方案！' }])
      localStorage.removeItem('chat_history')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* 离线指示器 */}
      {isOffline && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-1.5 mb-2 text-xs text-yellow-400 flex items-center gap-2">
          <span>📴</span>
          <span>离线模式 - 使用本地知识库</span>
          <button onClick={clearHistory} className="ml-auto underline hover:no-underline">清除记录</button>
        </div>
      )}
      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              {msg.role === 'ai' && <span className="text-xs text-cyan-400 font-medium block mb-1">🏸 AI 康复师</span>}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.suggestions && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {msg.suggestions.map((s, j) => (
                    <button key={j} className="tag text-xs" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai flex items-center gap-2">
              <span className="text-xs text-cyan-400">🏸 AI 康复师</span>
              <div className="flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 快捷问题 */}
      <div className="py-2 overflow-x-auto flex gap-2 no-scrollbar">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="tag whitespace-nowrap flex-shrink-0 text-xs" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      {/* 输入框 */}
      <div className="flex gap-2 pb-2">
        <input className="input-field flex-1 text-sm" placeholder="描述你的不适..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
        <button className="btn-primary px-4 flex-shrink-0" onClick={() => send()} disabled={loading || !input.trim()}>
          发送
        </button>
      </div>
    </div>
  )
}
