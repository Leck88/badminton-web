# 🏸 羽后伸 · AI 康复师
### Badminton Recovery & Stretch Agent

> 全球首个专为羽毛球"杀球-弓步-急停"动作链设计的 AI 康复师，而非通用拉伸模板。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)

---

## 📖 项目简介

羽毛球是急停、跳跃、多向爆发的运动，损伤率极高（肩袖、网球肘、膝半月板、跟腱）。现有拉伸 App 全是通用健身模板，没有专门针对羽毛球运动特点的 AI 精准方案。

**羽后伸** 专为羽毛球爱好者（业余→半专业）设计，解决打球后肌肉紧张、关节劳损、恢复盲区问题。

---

## 🤖 核心功能模块

| 模块 | 功能描述 |
|------|---------|
| 🧘 **智能拉伸编排** | 根据打球时长、强度、酸痛部位（肩/肘/膝/踝/腰），生成 5-10 分钟个性化拉伸序列 |
| 🎙️ **语音实时指导** | 手机摄像头检测动作幅度（MoveNet/MediaPipe），语音实时纠错提醒 |
| 📚 **恢复知识库** | 解答"杀球后肩峰疼""跟腱拉伤冰敷""羽毛球膝预防"等专业问题 |
| 📅 **周期恢复计划** | 按每周打球频次，制定拉伸+泡沫轴+冰敷/热敷周计划，设置提醒 |
| 🔍 **疲劳度评估** | 简单动作自测（深蹲/肩关节外旋），AI 判断恢复优先级 |

---

## 🗂️ 项目结构

```
badminton-recovery-agent/
├── src/
│   ├── agent/          # AI Agent 核心逻辑（LLM + 工具链）
│   ├── api/            # FastAPI 接口层
│   ├── models/         # 数据模型（用户、计划、动作库）
│   ├── services/       # 业务逻辑（拉伸编排、疲劳评估）
│   └── utils/          # 工具函数
├── frontend/           # 前端（微信小程序 / Web）
├── docs/               # 详细文档
├── tests/              # 测试用例
├── scripts/            # 部署脚本
└── .github/workflows/  # CI/CD
```

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/your-org/badminton-recovery-agent.git
cd badminton-recovery-agent

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 API Key

# 启动服务
uvicorn src.api.main:app --reload
```

---

## 🌐 部署入口

- 微信小程序：`羽后伸`
- 独立网站：`stretch.ymq.ai`
- API 文档：`http://localhost:8000/docs`

---

## 📄 License

MIT License — 开源免费，欢迎 PR 和 Star ⭐
