Page({
  data: {
    features: [
      { icon: '🧘', title: '智能拉伸编排', desc: '根据部位生成专属方案', page: 'stretch' },
      { icon: '🤖', title: 'AI 伤病问答', desc: '运动医学专业解答', page: 'chat' },
      { icon: '🔍', title: '疲劳自测', desc: '10秒评估恢复优先级', page: 'fatigue' },
      { icon: '📅', title: '周恢复计划', desc: '科学安排训练与恢复', page: 'weekly' },
    ],
    stats: [
      { value: '15+', label: '专项动作' },
      { value: '5', label: '身体区域' },
      { value: 'AI', label: '智能编排' },
    ],
  },
  goStretch() {
    wx.switchTab({ url: '/pages/stretch/stretch' })
  },
  goPage(e) {
    const page = e.currentTarget.dataset.page
    wx.switchTab({ url: `/pages/${page}/${page}` })
  },
})
