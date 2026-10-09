<div align="center">

# dsh-codex-efforting

**把 DeepSeek Harness 输入框里的模型选择器，做成一张带推理等级滑块的卡片。**

[![GitHub](https://img.shields.io/badge/GitHub-Mika--Maki%2Fdsh--codex--efforting-181717?logo=github&logoColor=white)](https://github.com/Mika-Maki/dsh-codex-efforting)
[![version](https://img.shields.io/badge/version-1.1.0-5B50E6)](https://github.com/Mika-Maki/dsh-codex-efforting/releases)
[![license](https://img.shields.io/badge/license-MIT-3083FD)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-171717)](#)

[English](./README.en.md) · **中文**

</div>

---

## 简介

插件接管输入框里的模型座位，把它重做成一个两层控件。折叠态是工具行里的小控件，显示 `模型名 · 档位`；展开后是一张卡片：档位名与模型名居中，底部是按档位等分的滑块，右上角一个按键把等级复位。滑块越往右越高，拖动时会浮出当前档位的消耗提示，不用先记住档位名就知道自己正在换成什么。

档位不写死：插件直接读模型声明的 `reasoning.efforts`，并按**位置**推出强度阶梯。适配器改名、换序或增删档位，这里都不需要跟着动。

## 特性

- **档位来自模型本身** —— 读 `reasoning.efforts` 自动分档，无需任何配置
- **强度只看位置** —— 首档恒为静止、末档恒为最热，中间几档平摊；两档模型就是「静止 → 最热」，四档模型刚好铺满四级，更长的列表会重复中间档
- **方向直觉** —— 越往右越高，最左端 `Off`，最右端 `Max`
- **点击与拖动都可用** —— 松手吸附到最近档位，键盘 `←` / `→` 同样能切
- **消耗可见** —— 拖动时浮出该档位的提示；能认出 `off` / `none`、`low` / `minimal`、`medium`、`high`、`xhigh`、`maximum` / `max` / `ultra` 等常见写法，认不出的适配器按所处档位给通用措辞
- **动效随档位递增** —— `Off` 静止；`Low` 静色条；`High` 稀疏喷发；`Max` 密集喷发叠在静态紫渐变上。粒子按确定性伪随机撒开，不是排队行进
- **输入框跟着档位走** —— 档位色画到输入框上：一层全覆盖柔光、一层外缘描边与光环
- **换模型不打断** —— 点模型名进入列表，选完自动回到等级滑块；目标模型支持当前档位就沿用，否则落到它的默认档
- **复位只动等级** —— 右上角按键把推理等级复位为模型默认，模型本身不动
- **跟随系统深浅色** —— 卡片配色随 `prefers-color-scheme` 切换
- **没有思考能力就让位** —— 模型无 `reasoning` 时自动交回，不挡路
- **三层效果可分别关闭** —— 输入框粒子、中心光晕、边缘辉光各有独立开关，见下方「设置」

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

## 设置

三个开关各自独立，都在 **设置 → 通用**：

| 开关 | 关掉后 |
| --- | --- |
| **输入框粒子** | 输入框范围内不再喷发粒子 |
| **中心光晕** | 输入框上那层全覆盖柔光消失 |
| **边缘辉光** | 输入框外缘的描边与光环消失 |

只影响输入框上的光效；卡片内部的动效不受这几个开关控制。

> 偏好存在浏览器本地（`localStorage`），因此**按浏览器生效**，不随 Profile 同步，清站点数据会回到默认的全开。

## 许可

MIT
