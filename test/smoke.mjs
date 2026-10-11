/**
 * Smoke test for the plugin's client half.
 *
 * `node --check` only proves syntax, and an initial-load test cannot catch a
 * preference that is read but omitted from its effect's dependency array — that
 * class of bug only appears when a switch changes while the plugin is mounted.
 * This covers both: the rung ladder and the overlays as loaded, and each switch
 * toggled at runtime.
 *
 * There is no build step and no test dependency: the bundle is plain
 * `window.__ModuleLoader__` output, so it is evaluated in a sandbox with a
 * stateful React stub and a recording DOM, and asserted on what it actually
 * produces.
 *
 * Run: node test/smoke.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const CLIENT = join(HERE, "..", "lib", "client.js");
const SOURCE = readFileSync(CLIENT, "utf8");

let checks = 0;
let fails = 0;
const assert = (ok, message) => {
  checks++;
  if (!ok) {
    console.log("  FAIL: " + message);
    fails++;
  }
};
const section = (title) => console.log("\n" + title);

// ---------------------------------------------------------------- React stub
/**
 * A stateful React stub. State outlives a render and effects run afterwards,
 * because the component under test reads preferences in effects and re-renders
 * from them; a stateless stub would silently render the initial value forever.
 */
function makeReact() {
  const states = [];
  const effects = [];
  let cursor = 0;
  let dirty = false;
  return {
    React: {
      createElement: (type, props, ...kids) => ({ type, props: props || {}, kids }),
      useState(init) {
        const at = cursor++;
        if (states.length <= at) states[at] = typeof init === "function" ? init() : init;
        return [states[at], (v) => {
          const next = typeof v === "function" ? v(states[at]) : v;
          if (next !== states[at]) { states[at] = next; dirty = true; }
        }];
      },
      useEffect(fn, deps) {
        const at = cursor++;
        const prev = effects[at];
        const same = prev && deps && prev.deps && deps.length === prev.deps.length && deps.every((d, i) => d === prev.deps[i]);
        if (same) return;
        if (prev && typeof prev.cleanup === "function") prev.cleanup();
        effects[at] = { deps, cleanup: fn() };
      },
      useRef: (v) => ({ current: globalThis.__efsRoot ?? v }),
      useMemo: (f) => f(),
    },
    begin: () => { cursor = 0; dirty = false; },
    isDirty: () => dirty,
  };
}

// ------------------------------------------------------------------ DOM stub
/** A recording DOM: every node keeps its class, style, attributes and children. */
function makeDom(styleSink) {
  const make = (tag) => {
    const el = {
      tagName: String(tag).toUpperCase(),
      className: "",
      textContent: "",
      dataset: {},
      style: { setProperty(k, v) { this[k] = v; } },
      children: [],
      attrs: {},
      parent: null,
      classList: { add() {}, remove() {} },
      setAttribute(k, v) { el.attrs[k] = v; },
      getAttribute(k) { return el.attrs[k]; },
      removeAttribute(k) { delete el.attrs[k]; },
      appendChild(child) { child.parent = el; el.children.push(child); return child; },
      remove() {
        if (el.parent) el.parent.children = el.parent.children.filter((x) => x !== el);
        el.parent = null;
      },
      querySelector: () => null,
      querySelectorAll: () => [],
      getBoundingClientRect: () => ({ left: 40, top: 700, right: 120, bottom: 728, width: 80, height: 28 }),
    };
    return el;
  };
  const body = make("body");
  const head = make("head");
  head.appendChild = (tag) => { styleSink.push(tag.textContent); return tag; };
  return {
    document: { body, head, createElement: make, querySelector: () => null, addEventListener() {}, removeEventListener() {} },
    make,
  };
}

// ------------------------------------------------------------------ harness
let loads = 0;

/**
 * Evaluate the bundle in a fresh sandbox and return handles for driving it.
 *
 * @param prefs - JSON blob the plugin's preference store will read back, or
 *   undefined to let it use its defaults.
 */
function prepare(prefs) {
  const react = makeReact();
  const styles = [];
  const dom = makeDom(styles);
  const storage = {};
  const selections = [];
  const sandbox = {
    console, Math, Object, Array, JSON, Symbol, Promise, String, Number, Boolean, Error,
    setTimeout, clearTimeout, Date,
    document: dom.document,
    window: {
      __ModuleLoader__: { load: (spec) => { sandbox.__spec = spec; } },
      addEventListener() {}, removeEventListener() {}, innerWidth: 1200, innerHeight: 900,
    },
    ResizeObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
    requestAnimationFrame: (fn) => { fn(); return 1; },
    localStorage: {
      getItem: (k) => (prefs !== undefined && k.includes("preferences") ? prefs : (k in storage ? storage[k] : null)),
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // A unique filename per load keeps this module's own cache from handing back a
  // stale instance.
  vm.runInContext(SOURCE, sandbox, { filename: "client-load-" + (++loads) + ".js" });

  const mod = sandbox.__spec.factory((name) => {
    if (name === "react") return react.React;
    throw new Error("unexpected require in bundle: " + name);
  });

  const seats = [];
  const rows = {};
  mod.apply({
    inject: (list, cb) => cb({
      slots: {
        register: (opts, component) => {
          if (opts.name === "conversation.input.model") seats.push(component);
          else if (opts.name === "settings.general.item") rows[opts.id] = component;
          return () => {};
        },
        inject: (name, cb) => { cb(); return () => {}; },
      },
      modelDirectories: { directoryFor: () => null },
    }),
  });

  return {
    mod,
    react,
    dom,
    styles,
    storage,
    selections,
    rows,
    seat: seats[0] ?? null,
    seatCount: seats.length,

    /** Render the seat with the composer frame wired so its refs resolve. */
    render(snapshot) {
      const frame = this.frame ?? (this.frame = dom.make("div"));
      frame.querySelector = () => ({});
      frame.querySelectorAll = () => [{}];
      const appended = [];
      const baseAppend = frame.appendChild.bind(frame);
      frame.appendChild = (child) => {
        appended.push(String(child.className));
        return baseAppend(child);
      };
      const root = dom.make("div");
      root.parentElement = frame;
      globalThis.__efsRoot = root;

      if (this.seat === null) throw new Error("seat component was never registered");
      let tree = null;
      for (let pass = 0; pass < 4; pass++) {
        react.begin();
        tree = this.seat({
          directory: { getSnapshot: () => snapshot, subscribe: () => () => {} },
          load() {}, select(selection) { selections.push(selection); }, watchStore() {}, locked: false,
        });
        if (!react.isDirty()) break;
      }
      globalThis.__efsRoot = undefined;

      return {
        tree,
        frame,
        appended,
        /** The layer the last pass mounted, found through the frame's record. */
        layer: (() => {
          const hit = frame.children.find((child) => child.className === "efs-field")?.children[0];
          return hit && hit.parent && String(hit.parent.className).includes("efs-field") ? hit.parent : null;
        })(),
      };
    },

    /** Drive one settings row's switch exactly as a click does. */
    toggle(rowId, value) {
      const Row = this.rows[rowId];
      if (!Row) throw new Error("settings row not registered: " + rowId);
      let tree = null;
      for (let pass = 0; pass < 4; pass++) {
        react.begin();
        tree = Row({});
        if (!react.isDirty()) break;
      }
      const input = findNode(tree, "efs-set-toggle");
      if (input === null) throw new Error("row rendered no switch: " + rowId);
      input.props.onChange({ target: { checked: value } });
    },
  };
}

// --------------------------------------------------------------- tree utils
const findNode = (node, needle) => {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const child of node) { const hit = findNode(child, needle); if (hit) return hit; }
    return null;
  }
  if (typeof node.props?.className === "string" && node.props.className.includes(needle)) return node;
  return findNode(node.kids, needle);
};

const lastNodeOfClass = (node, needle) => {
  let hit = null;
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (typeof n.props?.className === "string" && n.props.className.includes(needle)) hit = n;
    walk(n.kids);
  };
  walk(node);
  return hit;
};

const classesOf = (node, out = []) => {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { node.forEach((n) => classesOf(n, out)); return out; }
  if (typeof node.props?.className === "string") out.push(node.props.className);
  return classesOf(node.kids, out);
};

const countOfClass = (node, needle) => findNode(node, needle) === null ? 0 : classesOf(node).filter((c) => c.includes(needle)).length;

// ------------------------------------------------------------ domain helpers
/** Position of an effort in the list, mapped onto the four-rung ladder. */
const ladder = (index, count) => (count <= 1 || index <= 0) ? 0 : (index >= count - 1) ? 3 : 1 + Math.round(((index - 1) * 2) / (count - 2));
const RUNG_ATTR = [null, "glow", "erupt", "burst"];
const PIP = (heat) => heat >= 3 ? "efs-tdot-burst" : heat >= 2 ? "efs-tdot-erupt" : "efs-tdot";

const snapshotFor = (count, index) => {
  const efforts = Array.from({ length: count }, (_, i) => ({ id: "e" + i, name: "Effort " + i }));
  return {
    current: { provider: "p", model: "m", reasoningEffort: "e" + index },
    groups: [{ id: "p", models: [{ id: "m", name: "Test", reasoning: { efforts, defaultEffort: "e0" } }] }],
  };
};

// ------------------------------------------------------------------- checks
{
  section("注册");
  const ctx = prepare();
  console.log("  导出面: " + Object.keys(ctx.mod).sort().join(", "));
  assert(typeof ctx.mod.apply === "function", "apply 未导出");
  assert(typeof ctx.mod.inject === "object", "inject 未导出");
  assert(ctx.seatCount === 1, `座位应注册一次，实得 ${ctx.seatCount}`);
  for (const id of ["codex-efforting-particles", "codex-efforting-center-glow", "codex-efforting-edge-glow"]) {
    assert(typeof ctx.rows[id] === "function", "设置行未注册: " + id);
  }
  console.log("  座位: conversation.input.model");
  console.log("  设置行: " + Object.keys(ctx.rows).join(", "));
}

{
  section("档位阶梯（每档独立上下文）");
  for (const count of [2, 3, 4, 5, 6, 8]) {
    const row = [];
    for (let index = 0; index < count; index++) {
      const ctx = prepare();
      const { tree, frame, appended, layer } = ctx.render(snapshotFor(count, index));
      const heat = ladder(index, count);
      row.push(heat);
      const cls = classesOf(tree).join(" ");
      const want = RUNG_ATTR[heat];

      assert(cls.split(/\s+/).includes(PIP(heat)), `${count} 档 idx=${index}: 档位圆点期望 ${PIP(heat)}`);
      assert(frame.attrs["data-efs-glow"] === (want ?? undefined), `${count} 档 heat=${heat}: rung 属性期望 ${want ?? "无"} 实得 ${frame.attrs["data-efs-glow"] ?? "无"}`);
      assert(frame.attrs["data-efs-edge-glow"] === (want === null ? undefined : "1"), `${count} 档 heat=${heat}: 边缘层标记`);
      assert(frame.attrs["data-efs-center-glow"] === (want === null ? undefined : "1"), `${count} 档 heat=${heat}: 中心层标记`);

      const layers = appended.filter((c) => c.includes("efs-field")).length;
      if (heat >= 2) {
        assert(layers === 1, `${count} 档 heat=${heat}: 期望 1 个粒子层，实得 ${layers}`);
        assert(layer !== null, `${count} 档 heat=${heat}: 未找到粒子层节点`);
        if (layer !== null) {
          const wantParticles = heat >= 3 ? 20 : 6;
          assert(layer.children.length === wantParticles, `${count} 档 heat=${heat}: 粒子数期望 ${wantParticles} 实得 ${layer.children.length}`);
          assert(!layer.style.left && !layer.style.width, `${count} 档 heat=${heat}: 粒子层不应带视口坐标`);
        }
      } else {
        assert(layers === 0, `${count} 档 heat=${heat}: 低档不应建粒子层`);
      }
    }
    console.log(`  ${String(count).padStart(2)} 档 -> [${row.join(", ")}]`);
  }
}

{
  section("初始加载的开关组合");
  const combos = [
    { particles: true, centerGlow: true, edgeGlow: true, label: "全开" },
    { particles: false, centerGlow: true, edgeGlow: true, label: "关粒子" },
    { particles: true, centerGlow: false, edgeGlow: true, label: "关中心光晕" },
    { particles: true, centerGlow: true, edgeGlow: false, label: "关边缘辉光" },
    { particles: false, centerGlow: false, edgeGlow: false, label: "全关" },
  ];
  for (const combo of combos) {
    const saved = JSON.stringify({ particles: combo.particles, centerGlow: combo.centerGlow, edgeGlow: combo.edgeGlow });
    const ctx = prepare(saved);
    const { frame, appended } = ctx.render(snapshotFor(4, 3)); // highest rung: all three apply
    const particles = appended.filter((c) => c.includes("efs-field")).length > 0;
    const center = frame.attrs["data-efs-center-glow"] === "1";
    const edge = frame.attrs["data-efs-edge-glow"] === "1";
    const rung = frame.attrs["data-efs-glow"];
    assert(particles === combo.particles, `[${combo.label}] 输入框粒子期望 ${combo.particles} 实得 ${particles}`);
    assert(center === combo.centerGlow, `[${combo.label}] 中心光晕期望 ${combo.centerGlow} 实得 ${center}`);
    assert(edge === combo.edgeGlow, `[${combo.label}] 边缘辉光期望 ${combo.edgeGlow} 实得 ${edge}`);
    assert(rung === (combo.edgeGlow || combo.centerGlow ? "burst" : undefined), `[${combo.label}] rung 属性应与两层启用状态一致`);
    console.log(`  [${combo.label}] 粒子=${particles ? "有" : "无"} 中心光晕=${center ? "有" : "无"} 边缘辉光=${edge ? "有" : "无"} rung=${rung ?? "无"}`);
  }
}

{
  section("运行中切换（每个开关单独离开全开基线）");
  const ctx = prepare();
  const snapshot = snapshotFor(4, 3);
  // The composer overlays are written while the card is mounted, so expand it
  // first and keep it open for every reading.
  const first = ctx.render(snapshot);
  console.log("  [diag] first.frame attrs =", JSON.stringify(first.frame.attrs));
  const trigger = findNode(first.tree, "efs-trigger");
  console.log("  [diag] trigger 找到:", trigger !== null);
  if (trigger !== null) trigger.props.onClick();
  const afterClick = ctx.render(snapshot);
  console.log("  [diag] click 后 frame attrs =", JSON.stringify(afterClick.frame.attrs));
  const read = () => {
    const { frame, appended } = ctx.render(snapshot);
    return {
      particles: appended.some((c) => c.includes("efs-field")),
      center: frame.attrs["data-efs-center-glow"] === "1",
      edge: frame.attrs["data-efs-edge-glow"] === "1",
      rung: frame.attrs["data-efs-glow"],
    };
  };
  const rows = { particles: "codex-efforting-particles", center: "codex-efforting-center-glow", edge: "codex-efforting-edge-glow" };

  const base = read();
  console.log("  [diag] base =", JSON.stringify(base), "| storage =", JSON.stringify(ctx.storage));
  const retry = read();
  console.log("  [diag] retry =", JSON.stringify(retry));
  assert(base.particles && base.center && base.edge, "全开时三项都应存在");
  assert(base.rung === "burst", "全开时 rung 应为 burst");
  console.log(`  全开: 粒子=有 中心光晕=有 边缘辉光=有 rung=burst`);

  for (const [key, rowId] of Object.entries(rows)) {
    ctx.toggle(rowId, false);
    const off = read();
    for (const other of ["particles", "center", "edge"]) {
      assert(off[other] === (other === key ? false : true), `关「${key}」时「${other}」状态错误`);
    }
    assert(off.rung === "burst", `关「${key}」不应清掉 rung 色（其他层还在用）`);
    console.log(`  只关「${key}」: 粒子=${off.particles ? "有" : "无"} 中心光晕=${off.center ? "有" : "无"} 边缘辉光=${off.edge ? "有" : "无"} rung=${off.rung ?? "无"}`);

    ctx.toggle(rowId, true);
    const back = read();
    assert(back[key] === true, `重开「${key}」后应恢复`);
    assert(back.rung === "burst", `重开「${key}」后 rung 应保持`);
  }

  for (const rowId of Object.values(rows)) ctx.toggle(rowId, false);
  const allOff = read();
  assert(!allOff.particles && !allOff.center && !allOff.edge, "全关后三项都应消失");
  assert(allOff.rung === undefined, "全关后不应残留 rung 属性");
  console.log(`  全关: 粒子=无 中心光晕=无 边缘辉光=无 rung=无`);
}

{
  section("样式表");
  const ctx = prepare();
  const { tree } = ctx.render(snapshotFor(4, 3));
  // Expand the card so the rules that only apply while it is open are present.
  const trigger = findNode(tree, "efs-trigger");
  if (trigger !== null) { trigger.props.onClick(); ctx.render(snapshotFor(4, 3)); }
  const css = ctx.styles.join("");

  const need = [
    "efs-live-glow", "efs-live-erupt", "efs-live-burst",
    "efs-fill-still", "efs-fill-glow", "efs-fill-erupt", "efs-fill-burst",
    "efs-knob-erupt", "efs-knob-burst", "efs-tdot-erupt", "efs-tdot-burst",
    "efs-field", "efs-spark-field", "efs-rail-glow",
    "efs-set-row", "efs-set-toggle",
    "data-efs-edge-glow", "data-efs-center-glow",
  ];
  const missing = need.filter((k) => !css.includes(k));
  assert(missing.length === 0, "样式缺: " + missing.join(","));

  // The flat fill must not reference its own custom property: that resolves to
  // an invalid value and drops the fill entirely.
  assert(!css.includes("var(--efs-fill-still)"), "静止档填充是自引用变量，无效");

  const stale = ["efs-live-low", "efs-live-high", "efs-live-max", "efs-fill-max", "efs-knob-high", "efs-knob-max"].filter((k) => css.includes(k));
  assert(stale.length === 0, "旧类名残留: " + stale.join(","));

  // Every value the code can write into the rung attribute needs a selector, so
  // the two sides cannot drift apart unnoticed.
  const selectors = new Set([...css.matchAll(/data-efs-glow="([a-z]+)"/g)].map((m) => m[1]));
  for (const value of RUNG_ATTR.slice(1)) {
    assert(selectors.has(value), `CSS 缺少 [data-efs-glow="${value}"] 选择器`);
  }

  // No animation may drive a property the compositor cannot handle.
  const animated = [...css.matchAll(/@keyframes (efs\w+)\{([^@]*?)\}\s*(?=@|\.|\[|\}|$)/g)];
  const names = animated.map((m) => m[1]);
  assert(names.length >= 6, "keyframes 数量异常: " + names.length);
  // These are the animations the composer and card actually rely on; a rename
  // that silently drops one would otherwise go unnoticed.
  for (const name of ["efsBurst", "efsFieldBurst", "efsBreath", "efsHalo", "efsKnobGlow", "efsTdotPulse", "efsFrameGlow"]) {
    assert(names.includes(name), "缺少 keyframes: " + name);
  }
  for (const [name, body] of animated.map((m) => [m[1], m[2]])) {
    const props = [...new Set([...body.matchAll(/(opacity|transform|box-shadow|background-position|filter|left|width|height)\s*:/g)].map((m) => m[1]))];
    const heavy = props.filter((p) => p !== "opacity" && p !== "transform");
    assert(heavy.length === 0, `@keyframes ${name} 动画了非合成属性: ${heavy.join(", ")}`);
  }
  console.log(`  样式 ${css.length} 字节，keyframes ${animated.length} 个，glow 选择器 [${[...selectors].sort().join(", ")}]`);
  console.log("  全部 keyframes 只驱动 opacity / transform");
}

{
  section("全模型 fallback 与真实档位提交");
  const ctx = prepare(JSON.stringify({ allModels: true }));
  const snapshot = { current: { provider: "p", model: "plain" }, groups: [{ id: "p", models: [{ id: "plain", name: "Plain" }] }] };
  let result = ctx.render(snapshot);
  findNode(result.tree, "efs-trigger").props.onClick();
  result = ctx.render(snapshot);
  let rail = findNode(result.tree, "efs-rail-shell").kids.flat().find((node) => node?.props?.role === "slider");
  assert(rail.props["aria-valuemax"] === 5, "fallback 应展示六个 OpenAI 档位");
  assert(rail.props["aria-valuetext"].startsWith("Medium"), "fallback 默认应为 Medium");
  rail.props.onKeyDown({ key: "ArrowRight", preventDefault() {} });
  result = ctx.render(snapshot);
  rail = findNode(result.tree, "efs-rail-shell").kids.flat().find((node) => node?.props?.role === "slider");
  assert(rail.props["aria-valuetext"].startsWith("High"), "fallback 选择应更新界面");
  assert(ctx.selections.length === 0, "fallback 不应向 Host 提交思考参数");
  findNode(result.tree, "efs-reset").props.onClick();
  result = ctx.render(snapshot);
  rail = findNode(result.tree, "efs-rail-shell").kids.flat().find((node) => node?.props?.role === "slider");
  assert(rail.props["aria-valuetext"].startsWith("Medium"), "fallback 复位应返回 Medium");

  const real = snapshotFor(3, 1);
  result = ctx.render(real);
  rail = findNode(result.tree, "efs-rail-shell").kids.flat().find((node) => node?.props?.role === "slider");
  assert(rail.props["aria-valuemax"] === 2, "真实模型应保留声明的三档");
  rail.props.onKeyDown({ key: "ArrowRight", preventDefault() {} });
  await Promise.resolve();
  await Promise.resolve();
  assert(ctx.selections[0]?.reasoningEffort === "e2", "真实选择应提交模型声明的档位 id");
  assert(typeof ctx.rows["codex-efforting-all-models"] === "function", "全模型设置行必须注册");
}

console.log(`\n断言 ${checks} 项，失败 ${fails} 项`);
if (fails > 0) process.exit(1);
console.log("全部通过");
