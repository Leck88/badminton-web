import { useState } from 'react'
import Home from './pages/Home.jsx'
import Stretch from './pages/Stretch.jsx'
import Chat from './pages/Chat.jsx'
import Fatigue from './pages/Fatigue.jsx'
import Weekly from './pages/Weekly.jsx'

const tabs = [
  { id: 'home',    icon: '🏠', label: '首页' },
  { id: 'stretch', icon: '🧘', label: '拉伸' },
  { id: 'chat',    icon: '🤖', label: 'AI问答' },
  { id: 'fatigue', icon: '🔍', label: '疲劳测' },
  { id: 'weekly',  icon: '📅', label: '周计划' },
]

export default function App() {
  const [tab, setTab] = useState('home')

  const pages = { home: <Home onStart={() => setTab('stretch')} />, stretch: <Stretch />, chat: <Chat />, fatigue: <Fatigue />, weekly: <Weekly /> }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* 顶部标题 */}
      <header className="px-5 pt-8 pb-4 flex items-center gap-3">
        <span className="text-2xl">🏸</span>
        <div>
          <h1 className="font-bold text-lg gradient-text">羽后伸</h1>
          <p className="text-xs text-white/40">AI 康复师 · BadRecover AI</p>
        </div>
      </header>

      {/* 内容区 */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {pages[tab]}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0f1117]/90 backdrop-blur border-t border-white/10 flex justify-around px-2 py-2 z-50">
        {tabs.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="text-xl">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
