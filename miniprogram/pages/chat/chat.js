const api = require('../../utils/api')
const sessionId = Math.random().toString(36).slice(2)

Page({
  data: {
    messages: [{ role: 'ai', content: '你好！我是羽后伸 AI 康复师 🏸\n\n告诉我今天打了多久球、哪里不舒服，我来为你生成专属恢复方案！' }],
    inputText: '',
    loading: false,
    scrollTo: '',
    suggestions: ['打了2小时肩膀酸', '跟腱不舒服怎么办', '膝盖弓步后很痛', '怎么预防网球肘'],
  },

  onInput(e) { this.setData({ inputText: e.detail.value }) },

  async send() {
    const text = this.data.inputText.trim()
    if (!text || this.data.loading) return
    this.setData({ inputText: '', loading: true, messages: [...this.data.messages, { role: 'user', content: text }] })
    this.scrollBottom()
    try {
      const res = await api.sendChat(text, sessionId)
      this.setData({ messages: [...this.data.messages, { role: 'ai', content: res.message, suggestions: res.suggestions }], loading: false })
    } catch (e) {
      this.setData({ messages: [...this.data.messages, { role: 'ai', content: '网络连接失败，请检查服务。' }], loading: false })
    }
    this.scrollBottom()
  },

  sendSuggestion(e) { this.setData({ inputText: e.currentTarget.dataset.text }); this.send() },
  scrollBottom() { this.setData({ scrollTo: 'bottom' }) },
})
