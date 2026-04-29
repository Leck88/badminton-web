const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001/api/v1'

// 离线fallback数据
const OFFLINE_RESPONSES = {
  stretch: {
    message: '已为你生成拉伸方案 🧘\n\n1. 肩部交叉拉伸：患侧手臂水平内收，对侧手辅助加压，保持30秒×3组\n2. 胸小肌拉伸：门框前俯身45°，手臂与门框平行，保持30秒×3组\n3. 肩外旋练习：弹力带抗阻外旋，15次×3组\n\n注意：每个动作如有疼痛立即停止。',
    suggestions: ['跟腱有点不舒服怎么办', '膝盖弓步后很痛']
  },
  fatigue: {
    level: '中度',
    recommendation: '身体有明显疲劳，建议休息1-2天并做恢复训练。',
    priority_areas: ['股四头肌', '髋屈肌', '肩袖肌群'],
    recovery_plan: ['休息1天', '股四头肌拉伸', '肩袖激活练习', '泡沫轴放松']
  }
}

async function fetchWithFallback(url, options, fallbackKey) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
    
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn(`API call failed, using offline fallback: ${e.message}`)
    // 返回离线fallback数据
    if (fallbackKey && OFFLINE_RESPONSES[fallbackKey]) {
      return OFFLINE_RESPONSES[fallbackKey]
    }
    throw e
  }
}

export async function generateStretch(data) {
  return fetchWithFallback(`${API_BASE}/stretch/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, 'stretch')
}

export async function assessFatigue(data) {
  return fetchWithFallback(`${API_BASE}/fatigue/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, 'fatigue')
}

export async function sendChat(message, sessionId) {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })
  if (!res.ok) throw new Error('Chat API failed')
  return res.json()
}

export async function generateWeeklyPlan(frequency) {
  const res = await fetch(`${API_BASE}/weekly/generate?weekly_frequency=${frequency}`, {
    method: 'POST',
  })
  return res.json()
}

// 网络状态检测
export function isOnline() {
  return navigator.onLine
}

export function onNetworkChange(callback) {
  window.addEventListener('online', () => callback(true))
  window.addEventListener('offline', () => callback(false))
  return () => {
    window.removeEventListener('online', () => callback(true))
    window.removeEventListener('offline', () => callback(false))
  }
}
