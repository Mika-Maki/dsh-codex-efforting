<div align="center">

# dsh-codex-efforting

**把 DeepSeek Harness 输入框里的模型选择器，做成一张带推理等级滑块的卡片。**

[![GitHub](https://img.shields.io/badge/GitHub-Mika--Maki%2Fdsh--codex--efforting-181717?logo=github&logoColor=white)](https://github.com/Mika-Maki/dsh-codex-efforting)
[![version](https://img.shields.io/badge/version-1.0.0-5B50E6)](https://github.com/Mika-Maki/dsh-codex-efforting/releases)
[![license](https://img.shields.io/badge/license-MIT-3083FD)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-171717)](#)

[English](./README.en.md) · **中文**

</div>

---

## 简介

插件接管输入框里的模型座位，把它重做成一个两层控件。折叠态是工具行里的小控件，显示 `模型名 · 档位`；展开后是一张卡片：档位名与模型名居中，底部是按档位等分的滑块，右上角一个按键把等级复位。滑块越往右越高，拖动时会浮出当前档位的消耗提示，不用先记住档位名就知道自己正在换成什么。

档位不写死：插件直接读模型声明的 `reasoning.efforts`，按声明顺序铺开，适配器新增、删除或改名档位都不需要动这里。

## 特性

- **档位来自模型本身** —— 读 `reasoning.efforts` 自动分档，无需任何配置
- **方向直觉** —— 越往右越高，最左端 `Off`，最右端 `Max`
- **点击与拖动都可用** —— 松手吸附到最近档位，键盘 `←` / `→` 同样能切
- **消耗可见** —— 拖动时浮出该档位的提示，覆盖 `off` / `none`、`low` / `minimal`、`medium`、`high`、`xhigh`、`maximum` / `max` / `ultra` 等常见写法
- **换模型不打断** —— 点模型名进入列表，选完自动回到等级滑块；目标模型支持当前档位就沿用，否则落到它的默认档
- **复位只动等级** —— 右上角按键把推理等级复位为模型默认，模型本身不动
- **跟随系统深浅色** —— 卡片配色随 `prefers-color-scheme` 切换
- **没有思考能力就让位** —— 模型无 `reasoning` 时自动交回，不挡路

## 安装

```sh
dsh plugin --profile web add github:Mika-Maki/dsh-codex-efforting
```

装完重启 Profile 生效。

## 使用

| 操作 | 结果 |
| --- | --- |
| 点输入框里的控件 | 展开卡片 |
| 点或拖动滑块 | 切换推理等级，吸附到最近档位；键盘 ← / → 同样可用 |
| 拖动时 | 卡片浮出该档位的消耗提示 |
| 点中间的模型名 | 进入模型列表，选完自动回到等级滑块 |
| 点右上角的重置键 | 把推理等级复位为模型默认，**不动模型** |

## 许可

MIT
