const API_BASE = 'http://129.226.152.47:8001/api/v1'

function request(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err),
    })
  })
}

module.exports = {
  generateStretch: (data) => request('/stretch/generate', 'POST', data),
  assessFatigue: (data) => request('/fatigue/assess', 'POST', data),
  sendChat: (message, sessionId) => request('/chat/', 'POST', { message, session_id: sessionId }),
  generateWeeklyPlan: (freq) => request(`/weekly/generate?weekly_frequency=${freq}`, 'POST'),
}
