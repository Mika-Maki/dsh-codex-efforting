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
			".efs-trigger-tier{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1000;font-weight:600}",
			".efs-chev{flex:none;color:var(--dsw-alias-label-caption)}",
			// 卡片：一整套主题变量，深色模式整组覆盖
			".efs-card{--efs-surface:#FFFFFF;--efs-border:#D7D3CA;--efs-text:#171717;--efs-muted:#66645F;--efs-rail:#E8E8E8;--efs-hover:#F2F0EB;--efs-knob:#FFFFFF;--efs-marker:#C9C9C9;--efs-fill-off:#C9C9C9;--efs-knob-shadow:0 2px 10px rgb(24 20 14 / 22%);--efs-shadow:0 24px 70px rgb(24 20 14 / 10%);position:fixed;z-index:1100;box-sizing:border-box;background:var(--efs-surface);border:1px solid var(--efs-border);border-radius:24px;box-shadow:var(--efs-shadow);padding:14px 18px 20px;color:var(--efs-text)}",
			"@media (prefers-color-scheme: dark){.efs-card{--efs-surface:#1F1F22;--efs-border:#3A3A40;--efs-text:#F3F3F4;--efs-muted:#9C9CA3;--efs-rail:#34343A;--efs-hover:#2A2A2F;--efs-knob:#F3F3F4;--efs-marker:#4A4A52;--efs-fill-off:#4A4A52;--efs-knob-shadow:0 2px 12px rgb(0 0 0 / 55%);--efs-shadow:0 24px 70px rgb(0 0 0 / 60%)}}",
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
			".efs-hint{margin-top:12px;font-size:12px;line-height:18px;font-weight:500;text-align:center;animation:efsHint .16s ease}",
			"@keyframes efsHint{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}",
			".efs-rail{position:relative;height:26px;margin-top:16px;border-radius:999px;background:var(--efs-rail);cursor:pointer;outline:none;touch-action:none}",
			".efs-rail:focus-visible{box-shadow:0 0 0 2px #5B50E6}",
			".efs-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;overflow:hidden;transition:width .16s ease}",
			".efs-fill-max{background:linear-gradient(90deg,#3049D3 0%,#7C6BF7 25%,#9987FF 39%,#AD8FFF 56%,#9165FF 80%,#7558F2 100%)}",
			".efs-fill-high{background:#3083FD}",
			".efs-fill-low{background:#5EA2FF}",
			".efs-fill-off{background:var(--efs-fill-off)}",
			".efs-marker{position:absolute;width:4px;height:4px;border-radius:50%;background:var(--efs-marker);top:50%;transform:translate(-50%,-50%)}",
			".efs-knob{position:absolute;width:" + KNOB + "px;height:" + KNOB + "px;border-radius:50%;background:var(--efs-knob);box-shadow:var(--efs-knob-shadow);top:50%;transform:translate(-50%,-50%);transition:left .16s ease;pointer-events:none}",
			"@keyframes efsFlow{0%{left:104%;opacity:0}12%{opacity:var(--efs-o,.8)}88%{opacity:var(--efs-o,.8)}100%{left:-6%;opacity:0}}",
			".efs-dot{position:absolute;border-radius:50%;background:#FFFFFF}",
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
		 * Tier color per effort id. DSH declares `off / low / high / max`; the
		 * aliases below cover the spellings other adapters and the public API
		 * docs use (`none`, `minimal`, `medium`, `xhigh`, `maximum`, `ultra`).
		 */
		const TIER_COLOR = { off: "#66645F", low: "#5EA2FF", high: "#2E7DF7", max: "#5B50E6" };

		/** Classify one effort id into its display tier. */
		function tierOf(id) {
			const key = typeof id === "string" ? id.toLowerCase() : "";
			if (key === "max" || key === "maximum" || key === "ultra") return "max";
			if (key === "high" || key === "xhigh" || key === "medium") return "high";
			if (key === "low" || key === "minimal") return "low";
			return "off";
		}

		/** The model-declared display name, falling back to a capitalized id. */
		function prettify(stop) {
			if (stop !== undefined && stop !== null && typeof stop.name === "string" && stop.name.length > 0) return stop.name;
			if (stop !== undefined && stop !== null && typeof stop.id === "string") return stop.id.charAt(0).toUpperCase() + stop.id.slice(1);
			return "Off";
		}

		/** Drag-time cost hint per effort id. */
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
		const TIER_HINT = {
			off: "无思考消耗",
			low: "低思考消耗",
			high: "平衡质量与额度",
			max: "更快消耗使用额度",
		};

		/** Resolve a hint by id, then by declared name, then by tier. */
		function hintFor(stop, tier) {
			const id = stop !== undefined && stop !== null && typeof stop.id === "string" ? stop.id.toLowerCase() : "";
			if (Object.prototype.hasOwnProperty.call(ID_HINT, id)) return ID_HINT[id];
			if (stop !== undefined && stop !== null && typeof stop.name === "string") {
				const byName = ID_HINT[stop.name.toLowerCase()];
				if (typeof byName === "string") return byName;
			}
			return TIER_HINT[tier];
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
			const dragging = React.useRef(false);
			const triggerRef = React.useRef(null);
			const cardRef = React.useRef(null);
			const railRef = React.useRef(null);

			React.useEffect(() => {
				if (dir === undefined || dir === null || typeof dir.getSnapshot !== "function") return undefined;
				setSnap(dir.getSnapshot());
				if (typeof dir.subscribe !== "function") return undefined;
				return dir.subscribe(() => setSnap(dir.getSnapshot()));
			}, [dir]);

			React.useEffect(() => {
				if (dir !== undefined && dir !== null && typeof props.watchStore === "function") props.watchStore(dir);
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
				dragging.current = true;
				setRailIndex(indexAt(event.clientX));
			};
			const onPointerMove = (event) => {
				if (dragging.current !== true) return;
				setRailIndex(indexAt(event.clientX));
			};
			const onPointerUp = (event) => {
				if (dragging.current !== true) return;
				dragging.current = false;
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

			/** Deterministic pseudo-random flow dots: stable across renders, no Math.random. */
			const dots = React.useMemo(() => {
				const out = [];
				for (let index = 0; index < 12; index++) {
					const seed = index + 1;
					const r1 = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
					const r2 = Math.abs(Math.sin(seed * 78.233) * 12345.6789) % 1;
					const r3 = Math.abs(Math.sin(seed * 39.425) * 24634.6345) % 1;
					out.push({
						key: "dot" + index,
						size: (1.4 + r1 * 2.3).toFixed(2),
						top: (16 + r2 * 66).toFixed(1),
						duration: (2.6 + r3 * 3.6).toFixed(2),
						delay: (-(r1 * 3 + r2 * 3)).toFixed(2),
						opacity: (0.45 + r3 * 0.5).toFixed(2),
					});
				}
				return out;
			}, []);

			const shownStop = ordered[shown];
			const tier = tierOf(shownStop !== undefined && shownStop !== null ? shownStop.id : null);
			const tierColor = TIER_COLOR[tier];
			const tierLabel = shownStop !== undefined && shownStop !== null ? prettify(shownStop) : modelName;

			const trigger = React.createElement("button", {
				ref: triggerRef,
				key: "trigger",
				type: "button",
				className: "efs-trigger",
				disabled: props.locked === true,
				"aria-haspopup": "dialog",
				"aria-expanded": open ? "true" : "false",
				onClick: () => {
					if (open) setOpen(false);
					else { setPane("effort"); setOpen(true); }
				},
			}, [
				React.createElement("span", { className: "efs-trigger-label", key: "model" }, modelName),
				React.createElement("span", { className: "efs-trigger-tier", key: "tier", style: { color: tierColor } }, "· " + tierLabel),
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
								selected ? React.createElement("span", { className: "efs-item-check", key: "c" }, ICON_CHECK(tierColor)) : null,
							]));
						}
					}
					if (listChildren.length === 0) {
						listChildren.push(React.createElement("div", { className: "efs-empty", key: "empty" }, "目录尚未就绪"));
					}
					cardChildren.push(React.createElement("div", { className: "efs-list", key: "list" }, listChildren));
				} else if (ordered.length >= 2) {
					const anchor = travel(percentOf(shown));
					const fillClass = "efs-fill efs-fill-" + tier;

					const fillChildren = [];
					for (let index = 0; index < dots.length; index++) {
						const dot = dots[index];
						fillChildren.push(React.createElement("span", {
							key: dot.key,
							className: "efs-dot",
							style: {
								width: dot.size + "px",
								height: dot.size + "px",
								top: dot.top + "%",
								animation: "efsFlow " + dot.duration + "s linear " + dot.delay + "s infinite",
								"--efs-o": dot.opacity,
							},
						}));
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
						key: "knob", className: "efs-knob", style: { left: anchor },
					}));

					cardChildren.push(React.createElement("div", { className: "efs-head", key: "head" }, [
						React.createElement("div", { className: "efs-tier", key: "tier", style: { color: tierColor } }, [
							React.createElement("span", { key: "label" }, tierLabel),
							chevronRight(tierColor, "chev"),
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
							className: "efs-hint", key: "hint", style: { color: tierColor },
						}, hintFor(shownStop, tier)));
					}

					cardChildren.push(React.createElement("div", {
						ref: railRef,
						key: "rail",
						className: "efs-rail",
						tabIndex: 0,
						role: "slider",
						"aria-label": "推理等级",
						"aria-valuemin": 0,
						"aria-valuemax": ordered.length - 1,
						"aria-valuenow": shown,
						"aria-valuetext": tierLabel + "，" + hintFor(shownStop, tier),
						onPointerDown: onPointerDown,
						onPointerMove: onPointerMove,
						onPointerUp: onPointerUp,
						onKeyDown: onKeyDown,
					}, railChildren));
				}

				parts.push(React.createElement("div", {
					ref: cardRef,
					key: "card",
					className: "efs-card",
					style: { left: pos.left + "px", bottom: pos.bottom + "px", width: CARD_W + "px" },
					role: "dialog",
					"aria-label": pane === "model" ? "选择模型" : "模型与推理等级",
				}, cardChildren));
			}

			return React.createElement("div", { style: { position: "relative", display: "inline-flex" } }, parts);
		}
		//#endregion

		//#region apply
		/** Services this plugin needs before it can seat the composer control. */
		const inject = ["slots", "modelDirectories"];
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
						priority: 10,
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

				return () => {
					if (unsubscribe !== null) unsubscribe();
					unsubscribe = null;
					store = null;
					stopWaiting();
					releaseSeat();
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
