const api = require('../../utils/api')

Page({
  data: {
    duration: 60,
    intensity: '普通',
    painAreas: [],
    allAreas: ['肩', '肘', '膝', '踝', '腰', '腕', '小腿'],
    intensities: [
      { value: '轻松', emoji: '😌', desc: '悠闲打球' },
      { value: '普通', emoji: '😊', desc: '正常强度' },
      { value: '激烈', emoji: '🔥', desc: '高强度' },
    ],
    loading: false,
    plan: null,
    currentIdx: 0,
    currentAction: null,
    timer: 0,
    timerRunning: false,
  },

  _timerInterval: null,

  onDurationChange(e) { this.setData({ duration: e.detail.value }) },
  setIntensity(e) { this.setData({ intensity: e.currentTarget.dataset.val }) },
  toggleArea(e) {
    const area = e.currentTarget.dataset.area
    let areas = [...this.data.painAreas]
    if (areas.includes(area)) areas = areas.filter(a => a !== area)
    else areas.push(area)
    this.setData({ painAreas: areas })
  },

  async generate() {
    this.setData({ loading: true })
    try {
      const plan = await api.generateStretch({
        duration: this.data.duration,
        intensity: this.data.intensity,
        pain_areas: this.data.painAreas.length > 0 ? this.data.painAreas : ['肩'],
        recovery_time: 15,
      })
      this.setData({ plan, loading: false, currentIdx: 0, currentAction: plan.actions[0] })
    } catch (e) {
      wx.showToast({ title: '生成失败，检查网络', icon: 'error' })
      this.setData({ loading: false })
    }
  },

  startTimer() {
    const seconds = this.data.currentAction.duration_seconds
    this.setData({ timer: seconds, timerRunning: true })
    this._timerInterval = setInterval(() => {
      const t = this.data.timer - 1
      if (t <= 0) {
        clearInterval(this._timerInterval)
        this.setData({ timer: 0, timerRunning: false })
        wx.vibrateShort()
        wx.showToast({ title: '完成！', icon: 'success' })
      } else {
        this.setData({ timer: t })
      }
    }, 1000)
  },

  nextAction() {
    clearInterval(this._timerInterval)
    const idx = this.data.currentIdx + 1
    this.setData({ currentIdx: idx, currentAction: this.data.plan.actions[idx], timerRunning: false })
  },

  prevAction() {
    clearInterval(this._timerInterval)
    const idx = this.data.currentIdx - 1
    this.setData({ currentIdx: idx, currentAction: this.data.plan.actions[idx], timerRunning: false })
  },

  finish() {
    wx.showModal({
      title: '🎉 恢复完成！',
      content: '今日拉伸已完成，坚持每次打球后恢复，远离运动损伤！',
      showCancel: false,
      success: () => {
        this.setData({ plan: null, painAreas: [], duration: 60, intensity: '普通' })
      },
    })
  },
})
