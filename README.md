# 🏸 羽后伸 · AI 康复师

### Badminton Recovery & Stretch Agent

> 全球首个专为羽毛球"杀球-弓步-急停"动作链设计的 AI 康复师，而非通用健身拉伸模板。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Leck88/badminton-web?style=flat&color=yellow)](https://github.com/Leck88/badminton-web/stargazers)
[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-success?logo=vercel)](https://github.com/Leck88/badminton-web/deployments)

---

## 🎯 项目简介

羽毛球是急停、跳跃、多向爆发的运动，损伤率极高：

| 常见损伤 | 风险部位 |
|---------|---------|
| 肩袖损伤 | 杀球高频挥拍 |
| 网球肘 | 握拍过度 |
| 膝半月板 | 弓步救球 |
| 跟腱拉伤 | 跳起落地 |

现有拉伸 App 全是通用健身模板，没有专门针对羽毛球运动特点的精准方案。

**羽后伸** 专为羽毛球爱好者（业余→半专业）设计，解决打球后肌肉紧张、关节劳损、恢复盲区问题。

---

## ✨ 核心功能

| 功能 | 说明 |
|-----|------|
| 🧘 **智能拉伸编排** | 根据打球时长、强度、酸痛部位，AI 生成 5-25 分钟个性化拉伸序列 |
| 📦 **离线预设方案** | 无需网络，8 套预设动作库随时可用（肩/膝/腰背/全身 × 轻松/竞技版） |
| 🤖 **AI 专业问答** | 解答"杀球后肩峰疼""跟腱拉伤冰敷""羽毛球膝预防"等运动医学问题 |
| 📅 **周期恢复计划** | 按每周打球频次，制定拉伸+泡沫轴+冰敷/热敷周计划 |
| 🔍 **10秒疲劳自测** | 简单动作自测，AI 判断恢复优先级 |

---

## 🏗 技术架构

```
羽后伸/
├── frontend-web/          # 🖥 Web 前端（React + Vite + TailwindCSS）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx     # 首页
│   │   │   ├── Stretch.jsx  # 拉伸方案（AI生成 + 离线预设）
│   │   │   ├── Chat.jsx     # AI 问答
│   │   │   ├── Fatigue.jsx  # 疲劳度评估
│   │   │   └── Weekly.jsx   # 周恢复计划
│   │   └── api.js           # 后端 API 调用
│   └── package.json
│
├── src/                   # 🐍 Python 后端（FastAPI）
│   ├── agent/              # AI Agent 核心逻辑
│   ├── api/routes/         # API 路由（stretch/chat/fatigue/weekly）
│   ├── models/schemas.py   # 数据模型
│   └── services/           # 业务逻辑服务
│
├── miniprogram/           # 📱 微信小程序（基础结构）
└── .env.example           # 环境变量示例
```

---

## 🚀 快速使用

### 🌐 Web 在线版（无需安装）

**线上地址：** https://frontend-web.vercel.app

直接打开即可使用，支持 AI 拉伸方案生成和离线预设库。

### 🖥 本地运行 Web 前端

```bash
# 克隆项目
git clone https://github.com/Leck88/badminton-web.git
cd badminton-web/frontend-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 🐍 本地运行后端 API

```bash
cd badminton-web

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 API Key

# 启动服务
uvicorn src.api.main:app --reload

# 打开 API 文档
# http://localhost:8000/docs
```

---

## 📦 离线预设方案库

无需网络，打开 App 即可用：

| 分类 | 轻松版 | 竞技版 |
|------|--------|--------|
| 🦴 肩部 | ~10分钟 | ~20分钟 |
| 🦴 膝部 | ~10分钟 | ~20分钟 |
| 🦴 腰背 | ~10分钟 | ~20分钟 |
| 🦴 全身 | ~15分钟 | ~25分钟 |

每套方案包含 4-12 个羽毛球专项动作（猫牛式、青蛙蹲、门框拉伸、婴儿式等），附带详细步骤和注意事项。

---

## 🤖 AI 功能说明

AI 智能拉伸编排需要连接后端 API 服务，支持：

- **动态方案生成**：根据当天打球情况（时长、强度、部位）实时生成
- **语音实时指导**：摄像头检测动作幅度（MoveNet/MediaPipe），语音纠错
- **运动医学问答**：引用专业指南，解答羽毛球专项伤病问题

> 💡 离线预设方案完全免费，无需 API Key，随时可用。

---

## 🛠 技术栈

| 层级 | 技术 |
|-----|------|
| Web 前端 | React 18 + Vite 5 + TailwindCSS + React Router |
| 移动端 | 微信小程序（开发中） |
| 后端 | Python 3.11 + FastAPI + Uvicorn |
| AI | OpenAI GPT-4 / Claude / 兼容 OpenAI 接口的大模型 |
| 姿态检测 | MediaPipe / MoveNet |
| 部署 | Vercel（前端）+ Railway/Render（后端） |

---

## 📄 开源协议

MIT License — 永久免费，可以直接商用。

引用本项目请注明来源：
```
羽后伸 badminton-recovery-agent
https://github.com/Leck88/badminton-web
MIT License by Leck88
```

---

## 🙏 致谢

- [MediaPipe](https://mediapipe.dev/) — 姿态检测
- [TailwindCSS](https://tailwindcss.com/) — 样式框架
- [Vercel](https://vercel.com/) — 前端免费托管

---

**如果这个项目对你有帮助，欢迎 ⭐ Star！**
