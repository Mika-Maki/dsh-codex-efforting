window.__ModuleLoader__.load({
	id: "dsh-codex-efforting",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let React = require("react");

		const PKG = "dsh-codex-efforting";
		const CARD_W = 340;
		const KNOB = 30;
		const KNOB_HALF = KNOB / 2;

		//#region styles
		/**
		 * One idempotent stylesheet per package. The `data-plugin-css` marker keeps
		 * a re-mount (HMR, reload) from stacking duplicate rules, and the
		 * `data-plugin` stamp attributes the tag to this package.
		 */
		const CSS = [
			// 输入框里的折叠触发器
			".efs-trigger{position:relative;min-width:0;max-width:min(360px,45cqw);height:28px;display:flex;align-items:center;gap:4px;padding:0 4px 0 8px;border:none;background:0 0;border-radius:24px;font-size:13px;font-weight:500;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer}",
			".efs-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
			".efs-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}",
			".efs-trigger-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".efs-trigger-tier{position:relative;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1000;font-weight:600}",
			// 折叠态触发器：档位圆点常驻在档位名前，收起时也能看出当前档位
			".efs-tdot{flex:none;width:6px;height:6px;border-radius:50%;background:var(--efs-accent,currentColor);will-change:transform,opacity}",
			".efs-tdot-erupt{box-shadow:0 0 4px currentColor;animation:efsTdotPulse 4.4s ease-in-out infinite}",
			".efs-tdot-burst{box-shadow:0 0 6px currentColor;animation:efsTdotPulse 3.6s ease-in-out infinite}",
			".efs-chev{flex:none;color:var(--dsw-alias-label-caption)}",
			// 卡片：一整套主题变量，深色模式整组覆盖
			".efs-card{--efs-surface:#FFFFFF;--efs-border:#D7D3CA;--efs-text:#171717;--efs-muted:#66645F;--efs-rail:#E8E8E8;--efs-hover:#F2F0EB;--efs-knob:#FFFFFF;--efs-marker:#C9C9C9;--efs-fill-still-base:#C9C9C9;--efs-knob-shadow:0 2px 10px rgb(24 20 14 / 22%);--efs-shadow:0 24px 70px rgb(24 20 14 / 10%);position:fixed;z-index:1100;box-sizing:border-box;background:var(--efs-surface);border:1px solid var(--efs-border);border-radius:24px;box-shadow:var(--efs-shadow),0 0 0 0 rgb(0 0 0 / 0%);padding:14px 18px 20px;color:var(--efs-text);transition:border-color .3s ease,box-shadow .3s ease}",
			"@media (prefers-color-scheme: dark){.efs-card{--efs-surface:#1F1F22;--efs-border:#3A3A40;--efs-text:#F3F3F4;--efs-muted:#9C9CA3;--efs-rail:#34343A;--efs-hover:#2A2A2F;--efs-knob:#F3F3F4;--efs-marker:#4A4A52;--efs-fill-still-base:#4A4A52;--efs-knob-shadow:0 2px 12px rgb(0 0 0 / 55%);--efs-shadow:0 24px 70px rgb(0 0 0 / 60%)}}",
			// 卡片随档位染色：边框与投影都带档位色
			".efs-live-glow{border-color:color-mix(in srgb,#5EA2FF 42%,var(--efs-border));box-shadow:var(--efs-shadow),0 0 26px rgb(94 162 255 / 12%)}",
			".efs-live-erupt{border-color:color-mix(in srgb,#3083FD 52%,var(--efs-border));box-shadow:var(--efs-shadow),0 0 32px rgb(48 131 253 / 18%)}",
			".efs-live-burst{border-color:color-mix(in srgb,#7C6BF7 62%,var(--efs-border));box-shadow:var(--efs-shadow),0 0 40px rgb(124 107 247 / 26%)}",
			".efs-head{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;min-height:44px;justify-content:center}",
			".efs-tier{display:flex;align-items:center;gap:3px;font-size:15px;font-weight:600;line-height:22px}",
			".efs-pane-title{font-size:14px;font-weight:600;line-height:22px;color:var(--efs-text)}",
			".efs-model-btn{display:inline-flex;align-items:center;gap:2px;max-width:100%;border:none;background:0 0;border-radius:8px;padding:1px 6px;font-size:13px;line-height:20px;color:var(--efs-muted);cursor:pointer;font-family:inherit}",
			".efs-model-btn:hover{background:var(--efs-hover)}",
			".efs-model-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".efs-corner{position:absolute;top:-2px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:none;background:0 0;border-radius:50%;color:var(--efs-muted);cursor:pointer;padding:0}",
			".efs-corner:hover{background:var(--efs-hover)}",
			".efs-reset{right:-4px}",
			".efs-back{left:-4px}",
			".efs-hint{margin-top:12px;font-size:12px;line-height:18px;font-weight:500;text-align:center;animation:efsHint .3s cubic-bezier(.34,1.56,.64,1)}",
			"@keyframes efsHint{from{opacity:0;transform:translateY(6px) scale(.97)}to{opacity:1;transform:none}}",
			"@keyframes efsTdotPulse{0%,100%{opacity:.62;transform:translate3d(0,0,0) scale(.94)}50%{opacity:1;transform:translate3d(0,0,0) scale(1.06)}}",
			// 档位光效联动到输入框：直接作用于插件落座的祖先编辑器容器
			// 描边线 + 外层晕圈是静态的，只做过渡；呼吸放在合成层伪元素上
			// 编辑器容器多为 static：补 relative，让粒子层的 inset:0 有确定的包含块
			"[data-efs-glow]{position:relative;transition:border-color .32s ease,box-shadow .32s ease}",
			"[data-efs-glow]::after{content:\"\";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .32s ease}",
			"[data-efs-glow=\"glow\"]{box-shadow:0 0 0 1px rgb(94 162 255 / 32%),0 0 22px rgb(94 162 255 / 24%)}",
			"[data-efs-glow=\"glow\"]::after{opacity:.4;background:radial-gradient(120% 150% at 50% 50%,rgb(94 162 255 / 15%) 0%,rgb(94 162 255 / 0%) 70%)}",
			"[data-efs-glow=\"erupt\"]{box-shadow:0 0 0 1px rgb(48 131 253 / 48%),0 0 30px rgb(48 131 253 / 32%)}",
			"[data-efs-glow=\"erupt\"]::after{opacity:.65;background:radial-gradient(120% 150% at 50% 50%,rgb(48 131 253 / 20%) 0%,rgb(48 131 253 / 0%) 72%)}",
			"[data-efs-glow=\"burst\"]{box-shadow:0 0 0 1px rgb(124 107 247 / 58%),0 0 38px rgb(124 107 247 / 44%)}",
			"[data-efs-glow=\"burst\"]::after{opacity:.85;background:radial-gradient(120% 150% at 50% 50%,rgb(124 107 247 / 27%) 0%,rgb(124 107 247 / 0%) 74%);animation:efsFrameGlow 8s ease-in-out infinite}",
			"@keyframes efsFrameGlow{0%,100%{opacity:.55}50%{opacity:.9}}",
			".efs-rail{position:relative;height:26px;margin-top:16px;border-radius:999px;background:var(--efs-rail);cursor:pointer;outline:none;touch-action:none}",
			".efs-rail:focus-visible{box-shadow:0 0 0 2px #5B50E6}",
			// 轨道外壳只负责承载档位辉光，本体仍在内层，避免 hover 时尺寸抖动
			// isolation 把负 z-index 的辉光关在本层内，否则它会跑到卡片背景之后
			".efs-rail-shell{position:relative;margin-top:16px;border-radius:999px;isolation:isolate}",
			// 辉光用预模糊的静态径向渐变承载，只动 opacity：filter:blur 每帧都要重新光栅化
			".efs-rail-glow{position:absolute;left:3%;right:3%;top:-7px;bottom:-7px;border-radius:999px;z-index:-1;pointer-events:none;opacity:0;transition:opacity .3s ease;background:radial-gradient(58% 128% at var(--efs-glow-x,50%) 50%,var(--efs-accent,#3083FD) 0%,rgb(0 0 0 / 0%) 70%)}",
			".efs-live-glow .efs-rail-glow{opacity:.14}",
			".efs-live-erupt .efs-rail-glow{opacity:.26}",
			".efs-live-burst .efs-rail-glow{opacity:.4;animation:efsHalo 9s ease-in-out infinite}",
			// 关掉中心辉光时不仅不渲染节点，还显式压掉动画，避免任何残留的合成层在跑
			".efs-root-no-center .efs-rail-glow{display:none}",
			".efs-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;overflow:hidden;transition:width .22s cubic-bezier(.34,1.56,.64,1)}",
			// 渐变是静态的：动 background-position 会让整条填充每帧重新光栅化
			".efs-fill-burst{background:linear-gradient(90deg,#3049D3 0%,#7C6BF7 25%,#9987FF 39%,#AD8FFF 56%,#9165FF 80%,#7558F2 100%)}",
			// 呼吸高光：只动 opacity，且铺满填充面而不是叠加第三层渐变
			".efs-fill-burst::before{content:\"\";position:absolute;inset:0;will-change:opacity;background:radial-gradient(140% 180% at 50% 50%,rgb(255 255 255 / 34%) 0%,rgb(255 255 255 / 0%) 70%);animation:efsBreath 7s ease-in-out infinite}",
			".efs-fill-erupt{background:#3083FD}",
			".efs-fill-glow{background:#5EA2FF}",
			".efs-fill-still{background:var(--efs-fill-still-base)}",
			".efs-marker{position:absolute;width:4px;height:4px;border-radius:50%;background:var(--efs-marker);top:50%;transform:translate(-50%,-50%)}",
			".efs-knob{position:absolute;width:" + KNOB + "px;height:" + KNOB + "px;border-radius:50%;background:var(--efs-knob);box-shadow:var(--efs-knob-shadow);top:50%;transform:translate(-50%,-50%);transition:left .22s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease;pointer-events:none}",
			// 高档位的手柄：描边加深。辉光交给静态阴影，脉冲只动 opacity
			".efs-knob-erupt{box-shadow:var(--efs-knob-shadow),0 0 0 2px #3083FD,0 0 10px rgb(48 131 253 / 40%)}",
			".efs-knob-burst{box-shadow:var(--efs-knob-shadow),0 0 0 2px #5B50E6,0 0 14px rgb(124 107 247 / 50%)}",
			".efs-knob-burst::after{content:\"\";position:absolute;inset:-4px;border-radius:50%;will-change:opacity;box-shadow:0 0 16px 4px rgb(124 107 247 / 45%);animation:efsKnobGlow 7s ease-in-out infinite}",
			".efs-rail-drag .efs-knob{transform:translate(-50%,-50%) scale(1.12)}",
			// 扫光已移除：那层 100deg 白色渐变在圆角条上读起来像廉价塑料反光
			"@keyframes efsBreath{0%,100%{opacity:.32}50%{opacity:.85}}",
			"@keyframes efsHalo{0%,100%{opacity:.26}50%{opacity:.46}}",
			"@keyframes efsKnobGlow{0%,100%{opacity:.34}50%{opacity:.72}}",
			/**
			 * Burst-rung particles: acceleration-timed so each one leaves fast and
			 * eases as it clears the fill, instead of sweeping at a constant rate.
			 *
			 * The intermediate stops matter. With only a start and an end, two
			 * thirds of the timeline went to the last 170px and every particle
			 * crawled there; the four stops below keep each span's travel roughly
			 * proportional to its share of the duration. The exit point is a
			 * per-particle variable as well, otherwise all of them pile up on one
			 * line at the fill's edge.
			 */
			"@keyframes efsBurst{0%{transform:translate3d(300px,0,0) scale(.3);opacity:0}6%{opacity:var(--efs-o,.8)}20%{transform:translate3d(215px,calc(var(--efs-fy,0)*.3),0) scale(1.05);opacity:var(--efs-o,.8)}55%{transform:translate3d(95px,calc(var(--efs-fy,0)*.7),0) scale(1);opacity:calc(var(--efs-o,.8)*.92)}82%{transform:translate3d(8px,var(--efs-fy,0),0) scale(.85);opacity:calc(var(--efs-o,.8)*.55)}100%{transform:translate3d(var(--efs-ex,-36px),var(--efs-fy,0),0) scale(.25);opacity:0}}",
			/**
			 * The same eruption, scaled to the composer field. Only the entry point
			 * differs: a particle starts one viewport to the right, so it is already
			 * off-screen when the frame is narrower than the distance it covers.
			 */
			"@keyframes efsFieldBurst{0%{transform:translate3d(100vw,0,0) scale(.3);opacity:0}6%{opacity:var(--efs-o,.8)}20%{transform:translate3d(calc(100vw - 85px),calc(var(--efs-fy,0)*.3),0) scale(1.05);opacity:var(--efs-o,.8)}55%{transform:translate3d(calc(100vw - 205px),calc(var(--efs-fy,0)*.7),0) scale(1);opacity:calc(var(--efs-o,.8)*.92)}82%{transform:translate3d(calc(100vw - 292px),var(--efs-fy,0),0) scale(.85);opacity:calc(var(--efs-o,.8)*.55)}100%{transform:translate3d(var(--efs-ex,-36px),var(--efs-fy,0),0) scale(.25);opacity:0}}",
			".efs-spark-field{animation-name:efsFieldBurst}",
			".efs-sparks{position:absolute;inset:0;pointer-events:none}",
			// 输入框粒子层：固定定位，坐标来自编辑器容器的 bounding rect，所以不依赖
			// composer 的定位祖先，也不会随着卡片一起移动
			// 挂进编辑器容器内部，靠 inset:0 贴合，不涉及视口坐标与层叠竞争；
			// border-radius:inherit 让粒子跟着 composer 自己的圆角走
			".efs-field{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit}",
			".efs-spark{position:absolute;left:0;will-change:transform,opacity;border-radius:50%;background:#FFFFFF;animation:efsBurst var(--efs-t,1s) linear var(--efs-d,0s) infinite}",
			/**
			 * High gets a sparse eruption — fewer particles, a longer period and a
			 * wider phase spread — so the gaps between them read as deliberate rather
			 * than as a stuttering Max.
			 *
			 * The count is capped with a class rather than by rendering fewer
			 * elements: `animation: none` stops the work outright, while the element
			 * itself is a 2px div that costs nothing to hold in the tree.
			 */
			".efs-spark-hidden{animation:none;opacity:0}",
			".efs-spark-core{box-shadow:0 0 2px 1px rgb(255 255 255 / 80%)}",
			".efs-spark-strong{box-shadow:0 0 4px 2px rgb(255 255 255 / 90%)}",
			".efs-spark-wide{box-shadow:0 0 7px 3px rgb(255 255 255 / 82%)}",
			// 模型列表：同一套变量与圆角
			".efs-list{margin-top:10px;max-height:236px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;scrollbar-width:thin}",
			".efs-list::-webkit-scrollbar{width:8px}",
			".efs-list::-webkit-scrollbar-thumb{background:var(--efs-marker);border-radius:999px}",
			".efs-group{padding:6px 8px 2px;font-size:12px;line-height:18px;font-weight:500;color:var(--efs-muted)}",
			".efs-item{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;border:none;background:0 0;border-radius:10px;padding:7px 8px;font-size:14px;line-height:20px;color:var(--efs-text);cursor:pointer;text-align:left;font-family:inherit}",
			".efs-item:hover{background:var(--efs-hover)}",
			".efs-item-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".efs-item-check{flex:none;display:flex;align-items:center}",
			".efs-empty{padding:10px 8px;font-size:13px;line-height:20px;color:var(--efs-muted)}",

			// 设置行：只在设置页出现，用通用主题变量，不依赖任何 Client UI 包
			".efs-set-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 4px;border-bottom:1px solid var(--dsw-alias-border-l1)}",
			".efs-set-row:last-child{border-bottom:none}",
			".efs-set-text{min-width:0;display:flex;flex-direction:column;gap:2px}",
			".efs-set-title{font-size:14px;line-height:20px;font-weight:600;color:var(--dsw-alias-label-primary)}",
			".efs-set-desc{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}",
			".efs-set-toggle{flex:none;width:36px;height:20px;appearance:none;border-radius:999px;background:var(--dsw-alias-border-l2);cursor:pointer;position:relative;transition:background .18s ease}",
			".efs-set-toggle::after{content:\"\";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#FFFFFF;transition:transform .18s ease}",
			".efs-set-toggle:checked{background:var(--dsw-alias-brand-primary)}",
			".efs-set-toggle:checked::after{transform:translateX(16px)}",
			".efs-set-toggle:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}",
		].join("\n");

		function installStyles() {
			if (typeof document === "undefined" || document.head === undefined) return;
			const tagId = PKG + "/lib/client.js";
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = PKG;
			tag.dataset.pluginCss = tagId;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region effort metadata
		/**
		 * Effect ladder. Four rungs, named by heat rather than by any effort id,
		 * because `LlmReasoningEffortInfo.id` is documented as an opaque value:
		 * inferring strength from the string "max" happens to work for the built-in
		 * adapters and silently misreads every other spelling.
		 */
		const STILL = 0;
		const GLOW = 1;
		const ERUPT = 2;
		const BURST = 3;

		/** Accent per rung, cool to hot. */
		const HEAT_COLOR = ["#66645F", "#5EA2FF", "#2E7DF7", "#5B50E6"];

		/**
		 * Class-name suffix per rung. Indexed so the ladder stays aligned with
		 * HEAT_COLOR; the names describe the motion rather than any effort id.
		 */
		const LIVE_NAME = ["still", "glow", "erupt", "burst"];

		/**
		 * Map an effort's position in `reasoning.efforts` onto the ladder.
		 *
		 * The array arrives in adapter-preferred display order, so position is the
		 * only honest source of strength: a two-effort model reads as still and
		 * burst, a four-effort model fills the whole ladder, and a longer list
		 * repeats the middle rungs so the first is always still and the last always
		 * burst. This cannot go stale when an adapter renames, reorders or adds
		 * efforts.
		 */
		function heatOfIndex(index, count) {
			if (!Number.isFinite(count) || count <= 1 || !Number.isFinite(index) || index <= 0) return STILL;
			if (index >= count - 1) return BURST;
			return 1 + Math.round(((index - 1) * 2) / (count - 2));
		}

		/** The model-declared display name, falling back to a capitalized id. */
		function prettify(stop) {
			if (stop !== undefined && stop !== null && typeof stop.name === "string" && stop.name.length > 0) return stop.name;
			if (stop !== undefined && stop !== null && typeof stop.id === "string") return stop.id.charAt(0).toUpperCase() + stop.id.slice(1);
			return "Off";
		}

		/**
		 * Drag-time cost hint. The id table is best effort only — it offers wording
		 * for the spells the built-in adapters use, and an unrecognised adapter
		 * falls through to the wording for its rung.
		 */
		const ID_HINT = {
			off: "无思考消耗",
			none: "无思考消耗",
			disabled: "无思考消耗",
			low: "低思考消耗",
			minimal: "低思考消耗",
			medium: "中等思考消耗",
			high: "平衡质量与额度",
			xhigh: "更高思考消耗，质量优先",
			maximum: "更快消耗使用额度",
			max: "更快消耗使用额度",
			ultra: "更快消耗使用额度",
		};
		const HEAT_HINT = ["无思考消耗", "低思考消耗", "平衡质量与额度", "更快消耗使用额度"];

		/** Resolve a hint by id, then by declared name, then by rung. */
		function hintFor(stop, heat) {
			const id = stop !== undefined && stop !== null && typeof stop.id === "string" ? stop.id.toLowerCase() : "";
			if (Object.prototype.hasOwnProperty.call(ID_HINT, id)) return ID_HINT[id];
			if (stop !== undefined && stop !== null && typeof stop.name === "string") {
				const byName = ID_HINT[stop.name.toLowerCase()];
				if (typeof byName === "string") return byName;
			}
			return HEAT_HINT[heat];
		}

		/**
		 * Knob-center position, inset by half a knob at both ends so a 30px knob
		 * on a 26px rail never overhangs the rounded caps:
		 * `center = 15 + (W - 30) * p / 100 = W * p / 100 + (15 - 0.3p)`.
		 */
		function travel(percent) {
			return "calc(" + percent + "% + " + (KNOB_HALF - (2 * KNOB_HALF * percent) / 100) + "px)";
		}
		//#endregion

		//#region icons
		function svg(width, height, viewBox, paths) {
			return React.createElement("svg", {
				width: width, height: height, viewBox: viewBox, fill: "none", "aria-hidden": "true",
			}, paths);
		}

		const ICON_RESET = svg(15, 15, "0 0 14 14", [
			React.createElement("path", { key: "arc", d: "M11.8 7A4.8 4.8 0 1 1 7 2.2", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" }),
			React.createElement("path", { key: "head", d: "M5.5 0.7L7 2.2L5.5 3.7", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" }),
		]);
		const ICON_BACK = svg(16, 16, "0 0 14 14", [
			React.createElement("path", { key: "p", d: "M8.5 3.5L5 7L8.5 10.5", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }),
		]);
		const ICON_CHECK = (color) => svg(16, 16, "0 0 16 16", [
			React.createElement("path", { key: "p", d: "M3.5 8.5L6.5 11.5L12.5 4.5", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }),
		]);

		/**
		 * Collapsed-trigger rung pip: a dot in the rung colour that breathes faster
		 * as the rung rises, so the current effort is legible without expanding.
		 */
		function heatDot(color, heat, key) {
			let className = "efs-tdot";
			if (heat >= ERUPT) className += heat >= BURST ? " efs-tdot-burst" : " efs-tdot-erupt";
			return React.createElement("span", {
				key: key,
				className: className,
				style: { background: color, boxShadow: "0 0 6px " + color },
				"aria-hidden": "true",
			});
		}

		function chevronDown(className) {
			return svg(14, 14, "0 0 14 14", [
				React.createElement("path", { key: "p", d: "M3.5 5.5L7 9l3.5-3.5", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" }),
			]);
		}
		function chevronRight(color, key) {
			return React.createElement("svg", {
				key: key, width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true",
			}, React.createElement("path", { d: "M5.5 3.5L9 7L5.5 10.5", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }));
		}
		//#endregion

		//#region component
		/**
		 * The composer's model seat, reimagined as a card.
		 *
		 * Collapsed: `model · tier` with a chevron. Expanded: the tier and the
		 * model name centered, a reset control at the top right that resets the
		 * reasoning effort only, and a rail whose stops are the model's own
		 * `reasoning.efforts` in declaration order (left = lowest). Clicking the
		 * model name swaps the card to the model list.
		 *
		 * Injected props come from `apply`'s slot registrant: `directory` (the
		 * shared model-directory store), `load`, and `select`.
		 */
		function EffortSelector(props) {
			const dir = props.directory;
			const [snap, setSnap] = React.useState(null);
			const [open, setOpen] = React.useState(false);
			const [pane, setPane] = React.useState("effort");
			const [pos, setPos] = React.useState(null);
			const [railIndex, setRailIndex] = React.useState(null);
			const [pending, setPending] = React.useState(null);
			const [dragging, setDragging] = React.useState(false);
			const [bounce, setBounce] = React.useState(false);
			const prefs = usePrefs();
			const dragRef = React.useRef(false);
			const triggerRef = React.useRef(null);
			const cardRef = React.useRef(null);
			const railRef = React.useRef(null);
			const rootRef = React.useRef(null);
			const heatRef = React.useRef(null);

			React.useEffect(() => {
				if (dir === undefined || dir === null || typeof dir.getSnapshot !== "function") return undefined;
				setSnap(dir.getSnapshot());
				if (typeof dir.subscribe !== "function") return undefined;
				return dir.subscribe(() => setSnap(dir.getSnapshot()));
			}, [dir]);

			React.useEffect(() => {
				// Always hand over the store slot, including a null one: a null store
				// means the directory could not be resolved, which the watchdog reads
				// as "fail open" and hands the composer back.
				if (typeof props.watchStore === "function") props.watchStore(dir === undefined ? null : dir);
			}, [dir]);

			React.useEffect(() => {
				if (typeof props.load === "function") props.load();
			}, []);

			const current = snap !== null && snap !== undefined && snap.current !== undefined ? snap.current : null;
			const groups = snap !== null && snap !== undefined && Array.isArray(snap.groups) ? snap.groups : [];

			let choice = null;
			for (let gi = 0; gi < groups.length; gi++) {
				const group = groups[gi];
				if (group === undefined || group === null || current === null || group.id !== current.provider) continue;
				const models = Array.isArray(group.models) ? group.models : [];
				for (let mi = 0; mi < models.length; mi++) {
					const model = models[mi];
					if (model !== undefined && model !== null && model.id === current.model) choice = model;
				}
			}

			const modelName = choice !== null && typeof choice.name === "string" && choice.name.length > 0
				? choice.name
				: current === null ? "选择模型" : current.provider + "/" + current.model;

			const reasoning = choice !== null && choice.reasoning !== undefined && choice.reasoning !== null ? choice.reasoning : null;
			const stops = reasoning !== null && Array.isArray(reasoning.efforts) ? reasoning.efforts : [];
			// Declaration order is already ascending (Off → Low → High → Max): left is lowest.
			const ordered = stops.slice();

			const effective = current !== null && typeof current.reasoningEffort === "string"
				? current.reasoningEffort
				: reasoning !== null && typeof reasoning.defaultEffort === "string" ? reasoning.defaultEffort : null;

			let activeIndex = 0;
			for (let index = 0; index < ordered.length; index++) {
				const stop = ordered[index];
				if (stop !== undefined && stop !== null && stop.id === effective) activeIndex = index;
			}

			const percentOf = (index) => ordered.length <= 1 ? 100 : Math.round((index / (ordered.length - 1)) * 100);
			const shown = railIndex !== null ? railIndex : pending !== null ? pending : activeIndex;

			const submit = (selection, index) => {
				if (typeof props.select !== "function") return;
				setPending(typeof index === "number" ? index : null);
				Promise.resolve()
					.then(() => props.select(selection))
					.then(() => setPending(null), () => setPending(null));
			};

			const choose = (index) => {
				const stop = ordered[index];
				if (stop === undefined || stop === null || current === null) return;
				submit({ provider: current.provider, model: current.model, reasoningEffort: stop.id }, index);
			};

			/** Pick a model: carry the current tier when supported, else its default. */
			const pickModel = (group, model) => {
				if (group === undefined || model === undefined || group === null || model === null) return;
				const selection = { provider: group.id, model: model.id };
				const target = model.reasoning;
				const targetEfforts = target !== undefined && target !== null && Array.isArray(target.efforts) ? target.efforts : [];
				if (targetEfforts.length > 0) {
					let carried = null;
					for (let index = 0; index < targetEfforts.length; index++) {
						const level = targetEfforts[index];
						if (level !== undefined && level !== null && level.id === effective) carried = level.id;
					}
					if (carried !== null) selection.reasoningEffort = carried;
					else if (typeof target.defaultEffort === "string") selection.reasoningEffort = target.defaultEffort;
				}
				submit(selection, null);
				setPane("effort");
			};

			/** Top-right control: reset the reasoning effort only, never the model. */
			const reset = () => {
				if (current === null) return;
				const selection = { provider: current.provider, model: current.model };
				const target = reasoning !== null && typeof reasoning.defaultEffort === "string" ? reasoning.defaultEffort : null;
				if (target !== null) selection.reasoningEffort = target;
				let index = 0;
				for (let i = 0; i < ordered.length; i++) {
					const stop = ordered[i];
					if (stop !== undefined && stop !== null && target !== null && stop.id === target) index = i;
				}
				submit(selection, index);
			};

			const indexAt = (clientX) => {
				const el = railRef.current;
				if (el === null || ordered.length < 2) return activeIndex;
				const rect = el.getBoundingClientRect();
				if (rect.width <= 0) return activeIndex;
				const ratio = (clientX - rect.left) / rect.width;
				const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
				return Math.round(clamped * (ordered.length - 1));
			};

			const onPointerDown = (event) => {
				const el = railRef.current;
				if (el !== null && typeof el.setPointerCapture === "function" && event.pointerId !== undefined) {
					try { el.setPointerCapture(event.pointerId); } catch (error) { /* 指针可能已释放 */ }
				}
				dragRef.current = true;
				setDragging(true);
				setRailIndex(indexAt(event.clientX));
			};
			const onPointerMove = (event) => {
				if (dragRef.current !== true) return;
				setRailIndex(indexAt(event.clientX));
			};
			const onPointerUp = (event) => {
				if (dragRef.current !== true) return;
				dragRef.current = false;
				setDragging(false);
				const index = indexAt(event.clientX);
				setRailIndex(null);
				choose(index);
			};
			const onKeyDown = (event) => {
				if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
				event.preventDefault();
				const next = event.key === "ArrowRight" ? activeIndex + 1 : activeIndex - 1;
				if (next < 0 || next > ordered.length - 1) return;
				choose(next);
			};

			React.useEffect(() => {
				if (!open) return undefined;
				const place = () => {
					const el = triggerRef.current;
					if (el === null) return;
					const rect = el.getBoundingClientRect();
					let left = rect.left;
					if (left + CARD_W > window.innerWidth - 12) left = window.innerWidth - CARD_W - 12;
					if (left < 12) left = 12;
					setPos({ left: left, bottom: window.innerHeight - rect.top + 10 });
				};
				place();
				window.addEventListener("resize", place);
				window.addEventListener("scroll", place, true);
				return () => {
					window.removeEventListener("resize", place);
					window.removeEventListener("scroll", place, true);
				};
			}, [open]);

			React.useEffect(() => {
				if (!open) return undefined;
				const onDown = (event) => {
					const target = event.target;
					const inTrigger = triggerRef.current !== null && triggerRef.current.contains(target);
					const inCard = cardRef.current !== null && cardRef.current.contains(target);
					if (!inTrigger && !inCard) setOpen(false);
				};
				const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
				document.addEventListener("mousedown", onDown);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);

			/**
			 * Deterministic pseudo-random particles, seeded so they never reshuffle
			 * across renders (no Math.random).
			 *
			 * Twenty, with a negative delay spread narrower than one duration: that
			 * overlap is what makes roughly ten of them airborne at any instant, so
			 * the fill reads as a continuous eruption rather than a trickle of
			 * separate trips. Lane, size, fan angle, exit point and phase all come
			 * from per-particle CSS variables, which keeps every particle on one
			 * shared keyframe and therefore one composited animation each.
			 */
			const sparks = React.useMemo(() => {
				const out = [];
				for (let index = 0; index < 20; index++) {
					const seed = index + 1;
					const r1 = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
					const r2 = Math.abs(Math.sin(seed * 78.233) * 12345.6789) % 1;
					const r3 = Math.abs(Math.sin(seed * 39.425) * 24634.6345) % 1;
					const r4 = Math.abs(Math.sin(seed * 91.317) * 31415.9265) % 1;
					out.push({
						key: "spark" + index,
						size: (1.5 + r1 * 1.9).toFixed(2),
						top: (8 + r2 * 78).toFixed(1),
						duration: (0.66 + r4 * 0.5).toFixed(2),
						phase: (r1 * 0.75 + r2 * 0.48).toFixed(2),
						opacity: (0.6 + r3 * 0.4).toFixed(2),
						fan: (r3 * 14 - 7).toFixed(1) + "px",
						exit: (-(24 + r4 * 52)).toFixed(0) + "px",
						halo: r3 > 0.72 ? "efs-spark-wide" : r4 > 0.5 ? "efs-spark-strong" : "efs-spark-core",
						tint: r1 > 0.66
							? "radial-gradient(circle,#FFFFFF 0%,#FFFFFF 45%,rgb(255 255 255 / 0%) 100%)"
							: r2 > 0.5 ? "#FFFFFF" : "linear-gradient(90deg,rgb(255 255 255 / 55%) 0%,#FFFFFF 100%)",
					});
				}
				return out;
			}, []);


			const shownStop = ordered[shown];
			// Position in the model's own effort list is the only thing that says how
			// strong this rung is; the id is opaque.
			const heat = heatOfIndex(shown, ordered.length);
			const heatColor = HEAT_COLOR[heat];
			const heatLabel = shownStop !== undefined && shownStop !== null ? prettify(shownStop) : modelName;
			const live = "efs-live-" + LIVE_NAME[heat];

			/**
			 * The rung a colour may be painted onto the composer with. Still is
			 * deliberately absent: no reasoning effort means no glow, so the plain
			 * composer stays plain instead of wearing a grey halo.
			 */
			const glowHeat = heat === STILL || !prefs.edgeGlow ? null : LIVE_NAME[heat];

			/**
			 * Find the composer's editor frame: the first ancestor holding exactly
			 * one editor. The composer card below it also holds exactly one (this
			 * control sits in its tool row), so stopping at the first match keeps
			 * the glow on the editor frame instead of lighting up the whole card.
			 */
			const editorFrame = (node) => {
				let el = node.parentElement;
				while (el !== null && el !== document.body) {
					if (el.querySelector("textarea,[contenteditable=true]") !== null && el.querySelectorAll("textarea,[contenteditable=true]").length === 1) return el;
					el = el.parentElement;
				}
				return null;
			};

			/** Paint the current tier onto the composer frame; never leave it behind. */
			React.useEffect(() => {
				const node = rootRef.current;
				if (node === null) return undefined;
				const frame = editorFrame(node);
				if (frame === null) return undefined;
				if (glowHeat === null) frame.removeAttribute("data-efs-glow");
				else frame.setAttribute("data-efs-glow", glowHeat);
				return () => frame.removeAttribute("data-efs-glow");
			}, [glowHeat]);

			/**
			 * The same eruption, scaled to the composer field. Only the entry point
			 * differs, and these are real DOM nodes rather than React elements: the layer
			 * is mounted on `document.body` by the placement effect, outside this tree,
			 * so React must not own them.
			 */
			const particles = React.useMemo(() => {
				const out = [];
				if (heat < ERUPT) return out;
				const visible = heat >= BURST ? sparks.length : 6;
				const envelope = heat >= BURST ? 0.78 : 3.4;
				const phaseBase = heat >= BURST ? 0.1 : 2.2;
				for (let index = 0; index < sparks.length; index++) {
					if (index >= visible) break;
					const spark = sparks[index];
					const dot = document.createElement("span");
					dot.className = "efs-spark efs-spark-field " + spark.halo;
					const size = (spark.size * 0.78).toFixed(2) + "px";
					dot.style.width = size;
					dot.style.height = size;
					dot.style.top = spark.top + "%";
					dot.style.background = spark.tint;
					dot.style.setProperty("--efs-t", (envelope * spark.duration / 0.78).toFixed(2) + "s");
					dot.style.setProperty("--efs-d", (-(spark.phase * phaseBase)).toFixed(2) + "s");
					dot.style.setProperty("--efs-o", spark.opacity);
					dot.style.setProperty("--efs-fy", spark.fan);
					dot.style.setProperty("--efs-ex", spark.exit);
					out.push(dot);
				}
				return out;
			}, [heat, sparks]);

			/**
			 * Mount a particle layer inside the composer frame itself.
			 *
			 * Two earlier attempts failed for the same underlying reason: the layer was
			 * positioned from the outside. A `position: fixed` layer placed from measured
			 * viewport coordinates resolves against the nearest transformed ancestor
			 * rather than the viewport, so it lands nowhere useful wherever the
			 * surrounding chrome is animated; and moving it to `document.body` put it in a
			 * stacking context below the composer, which painted straight over it.
			 *
			 * Appending into the frame removes both problems at once: `inset: 0` against a
			 * positioned ancestor needs no measurement, and inside the frame the layer is
			 * painted after the frame background but before the editor content, which is
			 * exactly the wanted order. Nothing depends on viewport coordinates, so it
			 * behaves the same in the Web page and in Desktop.
			 *
			 * React owns the frame's children, so this node is created and removed by hand
			 * and never reconciled: appending one node that React does not know about
			 * cannot disturb the children it does.
			 */
			React.useEffect(() => {
				// Gated on the rung alone: `glowHeat` is intentionally not consulted
				// here, since it also carries the edge-glow preference, and one switch
				// must not turn off the other effect.
				if (heat < ERUPT || !prefs.particles) return undefined;
				const node = rootRef.current;
				if (node === null || typeof document === "undefined") return undefined;
				const frame = editorFrame(node);
				if (frame === null) return undefined;

				const layer = document.createElement("div");
				layer.className = "efs-field";
				layer.setAttribute("aria-hidden", "true");
				for (let index = 0; index < particles.length; index++) layer.appendChild(particles[index]);
				frame.appendChild(layer);
				return () => layer.remove();
			}, [glowHeat, heat, particles, prefs.particles]);

			/**
			 * Replay the settle animation whenever the tier actually changes, so a
			 * commit or a drag across a stop lands with a visible bounce. The ref
			 * seeds on first render, which keeps opening the card from bouncing.
			 */
			React.useEffect(() => {
				const previous = heatRef.current;
				heatRef.current = heat;
				if (previous === null || previous === heat) return undefined;
				setBounce(true);
				const timer = setTimeout(() => setBounce(false), 360);
				return () => clearTimeout(timer);
			}, [heat]);

			const trigger = React.createElement("button", {
				ref: triggerRef,
				key: "trigger",
				type: "button",
				className: "efs-trigger" + (bounce ? " efs-bounce" : ""),
				disabled: props.locked === true,
				"aria-haspopup": "dialog",
				"aria-expanded": open ? "true" : "false",
				onClick: () => {
					if (open) setOpen(false);
					else { setPane("effort"); setOpen(true); }
				},
			}, [
				React.createElement("span", { className: "efs-trigger-label", key: "model" }, modelName),
				React.createElement("span", { className: "efs-trigger-tier", key: "tier", style: { color: heatColor } }, [
					heatDot(heatColor, heat, "dot"),
					React.createElement("span", { key: "text" }, "· " + heatLabel),
				]),
				chevronDown("efs-chev"),
			]);

			const parts = [trigger];

			if (open && pos !== null) {
				const cardChildren = [];

				if (pane === "model") {
					cardChildren.push(React.createElement("div", { className: "efs-head", key: "head" }, [
						React.createElement("div", { className: "efs-pane-title", key: "title" }, "选择模型"),
						React.createElement("button", {
							key: "back", className: "efs-corner efs-back", type: "button",
							onClick: () => setPane("effort"), title: "返回推理等级", "aria-label": "返回推理等级",
						}, ICON_BACK),
					]));

					const listChildren = [];
					for (let gi = 0; gi < groups.length; gi++) {
						const group = groups[gi];
						if (group === undefined || group === null) continue;
						const label = typeof group.name === "string" && group.name.length > 0 ? group.name : group.id;
						listChildren.push(React.createElement("div", { className: "efs-group", key: "g" + gi }, label));
						const models = Array.isArray(group.models) ? group.models : [];
						for (let mi = 0; mi < models.length; mi++) {
							const model = models[mi];
							if (model === undefined || model === null) continue;
							const selected = current !== null && current.provider === group.id && current.model === model.id;
							listChildren.push(React.createElement("button", {
								key: "m" + gi + "-" + mi,
								type: "button",
								className: "efs-item",
								"aria-current": selected ? "true" : undefined,
								onClick: () => pickModel(group, model),
							}, [
								React.createElement("span", { className: "efs-item-name", key: "n" }, typeof model.name === "string" && model.name.length > 0 ? model.name : model.id),
								selected ? React.createElement("span", { className: "efs-item-check", key: "c" }, ICON_CHECK(heatColor)) : null,
							]));
						}
					}
					if (listChildren.length === 0) {
						listChildren.push(React.createElement("div", { className: "efs-empty", key: "empty" }, "目录尚未就绪"));
					}
					cardChildren.push(React.createElement("div", { className: "efs-list", key: "list" }, listChildren));
				} else if (ordered.length >= 2) {
					const anchor = travel(percentOf(shown));
					const cssPct = percentOf(shown);
					const fillClass = "efs-fill efs-fill-" + LIVE_NAME[heat];

					const sparkChildren = [];
					if (heat >= ERUPT) {
						// The rungs erupt sparsely: fewer particles, longer period, wider
						// phase spread. Max keeps the dense, fast burst.
						const visible = heat >= BURST ? sparks.length : 5;
						const envelope = heat >= BURST ? 0.78 : 3.4;
						const phaseBase = heat >= BURST ? 0.1 : 2.2;
						for (let index = 0; index < sparks.length; index++) {
							const spark = sparks[index];
							const sparkClass = "efs-spark " + spark.halo + (index < visible ? "" : " efs-spark-hidden");
							const duration = (envelope * spark.duration / 0.78).toFixed(2);
							const phase = -(spark.phase * phaseBase).toFixed(2);
							sparkChildren.push(React.createElement("span", {
								key: spark.key,
								className: sparkClass,
								style: {
									width: spark.size + "px",
									height: spark.size + "px",
									top: spark.top + "%",
									background: spark.tint,
									"--efs-t": duration + "s",
									"--efs-d": phase + "s",
									"--efs-o": spark.opacity,
									"--efs-fy": spark.fan,
									"--efs-ex": spark.exit,
								},
							}));
						}
					}

					const fillChildren = [];
					if (sparkChildren.length > 0) {
						fillChildren.push(React.createElement("div", {
							key: "sparks", className: "efs-sparks",
						}, sparkChildren));
					}

					const railChildren = [];
					for (let index = 1; index < ordered.length; index++) {
						railChildren.push(React.createElement("span", {
							key: "marker" + index,
							className: "efs-marker",
							style: { left: travel(percentOf(index)) },
						}));
					}
					railChildren.push(React.createElement("div", {
						key: "fill", className: fillClass, style: { width: anchor },
					}, fillChildren));
					railChildren.push(React.createElement("span", {
						key: "knob", className: "efs-knob efs-knob-" + LIVE_NAME[heat], style: { left: anchor },
					}));

					cardChildren.push(React.createElement("div", { className: "efs-head", key: "head" }, [
						React.createElement("div", { className: "efs-tier" + (heat >= BURST ? " efs-tier-pulse" : ""), key: "tier", style: { color: heatColor } }, [
							heatDot(heatColor, heat, "dot"),
							React.createElement("span", { key: "label" }, heatLabel),
							chevronRight(heatColor, "chev"),
						]),
						React.createElement("button", {
							key: "model",
							type: "button",
							className: "efs-model-btn",
							onClick: () => setPane("model"),
							title: "选择模型",
							"aria-label": "选择模型：" + modelName,
						}, [
							React.createElement("span", { className: "efs-model-name", key: "n" }, modelName),
							chevronRight("currentColor", "c"),
						]),
						React.createElement("button", {
							key: "reset", className: "efs-corner efs-reset", type: "button", onClick: reset,
							title: "重置为默认推理等级", "aria-label": "重置为默认推理等级",
						}, ICON_RESET),
					]));

					// Drag-time hint, colored by the tier under the pointer.
					if (railIndex !== null) {
						cardChildren.push(React.createElement("div", {
							className: "efs-hint", key: "hint", style: { color: heatColor },
						}, hintFor(shownStop, heat)));
					}

					cardChildren.push(React.createElement("div", {
						key: "railShell",
						className: "efs-rail-shell" + (dragging ? " efs-rail-drag" : ""),
						style: { "--efs-glow-x": cssPct + "%" },
					}, [
						prefs.centerGlow ? React.createElement("span", { key: "glow", className: "efs-rail-glow" }) : null,
						React.createElement("div", {
						ref: railRef,
						key: "rail",
						className: "efs-rail",
						tabIndex: 0,
						role: "slider",
						"aria-label": "推理等级",
						"aria-valuemin": 0,
						"aria-valuemax": ordered.length - 1,
						"aria-valuenow": shown,
						"aria-valuetext": heatLabel + "，" + hintFor(shownStop, heat),
						onPointerDown: onPointerDown,
						onPointerMove: onPointerMove,
						onPointerUp: onPointerUp,
						onKeyDown: onKeyDown,
					}, railChildren)]));
				}

				parts.push(React.createElement("div", {
					ref: cardRef,
					key: "card",
					className: "efs-card " + live,
					style: {
						left: pos.left + "px",
						bottom: pos.bottom + "px",
						width: CARD_W + "px",
						"--efs-accent": heatColor,
					},
					role: "dialog",
					"aria-label": pane === "model" ? "选择模型" : "模型与推理等级",
				}, cardChildren));
			}


			return React.createElement("div", {
				ref: rootRef,
				key: "root",
				className: "efs-root" + (prefs.centerGlow ? "" : " efs-root-no-center"),
				// Diagnostic marker: makes the live preference state readable from the DOM
				// when a toggle looks like it did nothing.
				"data-efs-prefs": (prefs.particles ? "1" : "0") + (prefs.centerGlow ? "1" : "0") + (prefs.edgeGlow ? "1" : "0"),
				"data-efs-open": open && pos !== null ? "1" : "0",
				"data-efs-center": prefs.centerGlow ? "1" : "0",
				style: { position: "relative", display: "inline-flex" },
			}, parts);
		}
		//#endregion

		//#region preferences
		/**
		 * Preference storage for the three visual effects.
		 *
		 * Held on the Client rather than in the plugin's Config: the Host would need a
		 * Config schema plus a `configForms` service to project it, and no active
		 * bundle in this profile provides `configForms`, so reading it from the Client
		 * would depend on a service that may not be there. `localStorage` needs neither
		 * and survives reloads. The trade-off is that the choice is per-browser rather
		 * than per-profile.
		 */
		const PREF_KEY = PKG + "/preferences";
		const PREF_DEFAULTS = { particles: true, centerGlow: true, edgeGlow: true };
		const PREF_FIELDS = ["particles", "centerGlow", "edgeGlow"];

		const prefStore = (() => {
			let state = Object.assign({}, PREF_DEFAULTS);
			const listeners = new Set();
			try {
				const raw = typeof localStorage !== "undefined" ? localStorage.getItem(PREF_KEY) : null;
				if (raw !== null) {
					const saved = JSON.parse(raw);
					for (let i = 0; i < PREF_FIELDS.length; i++) {
						const field = PREF_FIELDS[i];
						if (typeof saved[field] === "boolean") state[field] = saved[field];
					}
				}
			} catch (error) { /* 存储不可用或内容损坏时回落到默认值 */ }
			const emit = () => { listeners.forEach((fn) => fn()); };
			return {
				get: () => state,
				set(field, value) {
					if (state[field] === value) return;
					state = Object.assign({}, state, { [field]: value });
					try {
						if (typeof localStorage !== "undefined") localStorage.setItem(PREF_KEY, JSON.stringify(state));
					} catch (error) { /* 写入失败不影响本次会话 */ }
					emit();
				},
				subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
			};
		})();

		/** Subscribe one row to a single preference field. */
		function usePref(field) {
			return usePrefs()[field];
		}

		/** Subscribe to every preference, for components that read more than one. */
		function usePrefs() {
			const [snapshot, setSnapshot] = React.useState(prefStore.get());
			React.useEffect(() => prefStore.subscribe(() => setSnapshot(prefStore.get())), []);
			return snapshot;
		}

		/**
		 * One preference row: title and description on the left, a switch on the right.
		 *
		 * Built from theme tokens rather than the settings row components the shipped
		 * sections use, because those come from a Client UI package a plugin must not
		 * import.
		 */
		function PrefRow(props) {
			const on = usePref(props.field);
			return React.createElement("div", { className: "efs-set-row" }, [
				React.createElement("div", { className: "efs-set-text", key: "text" }, [
					React.createElement("div", { className: "efs-set-title", key: "title" }, props.title),
					React.createElement("div", { className: "efs-set-desc", key: "desc" }, props.description),
				]),
				React.createElement("input", {
					key: "toggle",
					type: "checkbox",
					className: "efs-set-toggle",
					checked: on,
					"aria-label": props.title,
					onChange: (event) => prefStore.set(props.field, event.target.checked),
				}),
			]);
		}

		/** The three settings rows this plugin contributes, in display order. */
		const PREF_ROWS = [
			{ id: "codex-efforting-particles", order: 30, field: "particles", title: "输入框粒子", description: "在输入框范围内喷发粒子，效果与你所选档位联动。" },
			{ id: "codex-efforting-center-glow", order: 31, field: "centerGlow", title: "中心辉光", description: "推理等级轨道下方的档位色辉光，以及最高档的呼吸光晕。" },
			{ id: "codex-efforting-edge-glow", order: 32, field: "edgeGlow", title: "边缘辉光", description: "输入框外缘的档位色描边与光环。" },
		];
		//#endregion

		//#region apply
		/**
		 * Services this plugin needs before it can seat the composer control.
		 *
		 * `remote` and `remote.session` are not incidental. A Cordis service proxy
		 * rebinds `this.ctx` to the CALLER's context at call time, so calling into
		 * `modelDirectories.directoryFor()` runs the service body against THIS
		 * plugin's fiber — and that body reaches `remote.session`. Without those two
		 * declarations the guard refuses the access with
		 * `cannot get property "remote.session" without inject`, `directoryFor`
		 * throws, and the seat then holds a control that cannot render anything
		 * usable: model choice and effort both go dead.
		 */
		const inject = ["slots", "modelDirectories", "sessions", "remote", "remote.session"];
		const name = "codex-efforting";

		/** Find the catalog entry the current selection resolves to, or null while the catalog is cold. */
		function modelOf(snapshot) {
			if (snapshot === null || snapshot === undefined) return null;
			const current = snapshot.current;
			if (current === null || current === undefined) return null;
			const groups = Array.isArray(snapshot.groups) ? snapshot.groups : [];
			for (let gi = 0; gi < groups.length; gi++) {
				const group = groups[gi];
				if (group === undefined || group === null || group.id !== current.provider) continue;
				const models = Array.isArray(group.models) ? group.models : [];
				for (let mi = 0; mi < models.length; mi++) {
					const model = models[mi];
					if (model !== undefined && model !== null && model.id === current.model) return model;
				}
			}
			return null;
		}

		function effortsOf(reasoning) {
			if (reasoning === undefined || reasoning === null) return [];
			return Array.isArray(reasoning.efforts) ? reasoning.efforts : [];
		}

		/**
		 * Decide what the seat should do about one directory snapshot.
		 *
		 * `unknown` is the case that matters. A catalog that has not loaded yet, a
		 * selection that has not resolved, and a model not yet listed all read as
		 * "no efforts" to a careless check — and at boot the catalog is cold on the
		 * very first tick. Releasing there drops the seat before this plugin ever
		 * renders, which surfaces as "the plugin does nothing". Only a model that is
		 * actually listed may make the plugin step aside.
		 *
		 * @returns `hold` to seat, `release` to hand the composer back, `unknown` to
		 * wait with the seat as it stands.
		 */
		function seatVerdict(snapshot) {
			if (snapshot === null || snapshot === undefined) return "unknown";
			if (snapshot.current === null || snapshot.current === undefined) return "unknown";
			const model = modelOf(snapshot);
			if (model === null) return "unknown";
			const reasoning = model.reasoning;
			if (reasoning === undefined || reasoning === null) return "release";
			return effortsOf(reasoning).length >= 2 ? "hold" : "release";
		}

		/**
		 * Take the composer's model seat.
		 *
		 * `conversation.input.model` is a `single` slot whose shipped occupant sits
		 * at priority 0, so priority 10 shadows it; disposing the registration
		 * reveals it again unchanged. The seat is held only while the current model
		 * declares at least two reasoning efforts — a model without Thinking Effort
		 * gets the shipped selector back rather than a slider over a single stop.
		 */
		function apply(ctx) {
			installStyles();

			ctx.inject(inject, (scope) => {
				const models = scope.modelDirectories;
				let disposeSeat = null;
				let store = null;
				let unsubscribe = null;

				const takeSeat = () => {
					if (disposeSeat !== null) return;
					disposeSeat = scope.slots.register({
						name: "conversation.input.model",
						// LOWER priority wins. The shipped occupant sits at the default 0,
						// so shadowing it needs a negative rank — the dynamic runner
						// allocates -1, -2, … for exactly this reason. A positive value
						// registers the entry but leaves it inactive, which reads as the
						// plugin doing nothing at all.
						priority: -1,
						inject: slotInject,
					}, EffortSelector);
				};

				const releaseSeat = () => {
					if (disposeSeat === null) return;
					disposeSeat();
					disposeSeat = null;
				};

				/**
				 * Watchdog: seat, release, or wait — never guess.
				 * `unknown` must leave the current seat alone, otherwise a cold catalog
				 * at boot evicts the seat before the first render.
				 */
				const evaluate = () => {
					const snapshot = store !== null && typeof store.getSnapshot === "function" ? store.getSnapshot() : null;
					const verdict = seatVerdict(snapshot);
					if (verdict === "release") releaseSeat();
					else if (verdict === "hold") takeSeat();
				};

				/** Follow one session's directory store so the seat tracks the current model. */
				const watch = (next) => {
					if (next === null || next === undefined) {
						// No store means the directory could not be resolved for this
						// session at all (a thrown `directoryFor`, a missing service).
						// Holding the seat then would hand the composer a control that
						// cannot render anything usable, taking model choice and effort
						// down with it. Fail open: give the seat back.
						if (unsubscribe !== null) unsubscribe();
						unsubscribe = null;
						store = null;
						releaseSeat();
						return;
					}
					if (store === next && unsubscribe !== null) return;
					if (unsubscribe !== null) unsubscribe();
					unsubscribe = null;
					store = next;
					if (store !== null && typeof store.subscribe === "function") unsubscribe = store.subscribe(evaluate);
					evaluate();
				};

				/**
				 * The slot's inject face: the shared store, plus `load` for the first
				 * catalog fetch, `select` for submission, and `watchStore` so the
				 * component can hand the watchdog its store.
				 */
				const slotInject = (sessionId) => {
					let directory = null;
					let load = null;
					let select = null;
					try {
						const entry = models.directoryFor(sessionId);
						if (entry !== undefined && entry !== null) {
							directory = entry.store;
							if (typeof entry.load === "function") {
								load = () => {
									try {
										const settled = entry.load();
										if (settled !== undefined && settled !== null && typeof settled.catch === "function") settled.catch(() => {});
									} catch (error) { /* 目录不可用时保持上次快照 */ }
								};
							}
							if (typeof entry.select === "function") select = (selection) => entry.select(selection);
						}
					} catch (error) {
						directory = null;
					}
					return { directory: directory, load: load, select: select, watchStore: watch };
				};

				// Seat only once the slot is declared. At boot this plugin's module can
				// materialize before the entry that declares `conversation.input.model`
				// has applied, and registering into an undeclared slot seats nothing.
				// Seating here (rather than in a render effect) is also what gives the
				// watchdog its first store; the watchdog then releases the seat only on
				// a definite verdict.
				const stopWaiting = scope.slots.inject("conversation.input.model", () => {
					takeSeat();
					return () => { releaseSeat(); };
				});

				// The preference rows belong to the General section and are independent of
				// the composer seat, so they register once with the seat's scope rather
				// than per session. Registering into the settings slot costs nothing while
				// the panel is closed, and the rows are present the first time it opens.
				const stopRows = [];
				for (let index = 0; index < PREF_ROWS.length; index++) {
					const row = PREF_ROWS[index];
					const field = row.field;
					const title = row.title;
					const description = row.description;
					const Row = (props) => PrefRow(Object.assign({}, props, { field: field, title: title, description: description }));
					stopRows.push(scope.slots.inject("settings.general.item", () => scope.slots.register({
						name: "settings.general.item",
						id: row.id,
						order: row.order,
						label: title,
					}, Row)));
				}

				return () => {
					if (unsubscribe !== null) unsubscribe();
					unsubscribe = null;
					store = null;
					stopWaiting();
					releaseSeat();
					for (let index = 0; index < stopRows.length; index++) stopRows[index]();
				};
			});

		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
