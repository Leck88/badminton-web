import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api.js'

const SUGGESTIONS = ['打了2小时球，肩膀酸，帮我拉伸', '跟腱有点不舒服怎么办', '膝盖弓步后很痛', '怎么预防网球肘', '今天可以打球吗']

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '你好！我是羽后伸 AI 康复师 🏸\n\n告诉我今天打了多久球、哪里不舒服，我来为你生成专属恢复方案！' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const bottomRef = useRef(null)

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
      const res = await sendChat(msg, sessionId)
      setMessages(prev => [...prev, { role: 'ai', content: res.message, suggestions: res.suggestions }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: '网络连接失败，请检查服务是否启动。' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
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
