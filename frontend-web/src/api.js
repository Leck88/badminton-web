const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001/api/v1'

export async function generateStretch(data) {
  const res = await fetch(`${API_BASE}/stretch/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function assessFatigue(data) {
  const res = await fetch(`${API_BASE}/fatigue/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function sendChat(message, sessionId) {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })
  return res.json()
}

export async function generateWeeklyPlan(frequency) {
  const res = await fetch(`${API_BASE}/weekly/generate?weekly_frequency=${frequency}`, {
    method: 'POST',
  })
  return res.json()
}
