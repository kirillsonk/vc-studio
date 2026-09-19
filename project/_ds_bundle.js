/* @ds-bundle: {"format":4,"namespace":"VCStudioDesignSystem_40ecfd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"CaseCard","sourcePath":"components/content/CaseCard.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Trace","sourcePath":"components/content/Trace.jsx"},{"name":"DemoBlock","sourcePath":"components/demo/DemoBlock.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"OptionBlock","sourcePath":"components/forms/OptionBlock.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"BriefComposer","sourcePath":"components/intake/BriefComposer.jsx"},{"name":"BriefMessage","sourcePath":"components/intake/BriefMessage.jsx"},{"name":"EstimatePanel","sourcePath":"components/intake/EstimatePanel.jsx"},{"name":"Compare","sourcePath":"components/numbers/Compare.jsx"},{"name":"Counter","sourcePath":"components/numbers/Counter.jsx"},{"name":"Ledger","sourcePath":"components/numbers/Ledger.jsx"},{"name":"Stat","sourcePath":"components/numbers/Stat.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"141d9cd4a3a0","components/content/CaseCard.jsx":"d12540ed71f4","components/content/Tag.jsx":"1bee622cfe4e","components/content/Trace.jsx":"cd8aded36f49","components/demo/DemoBlock.jsx":"4e6d6fdd7489","components/forms/Checkbox.jsx":"aad9c57069c7","components/forms/Chip.jsx":"8546678f7d17","components/forms/Field.jsx":"847df466ed12","components/forms/OptionBlock.jsx":"d95a8a801fba","components/forms/Select.jsx":"f4fb08d4a89d","components/forms/TextInput.jsx":"ce7496c33d51","components/forms/Textarea.jsx":"868a181ec750","components/forms/inputBox.js":"033cfe4a2822","components/intake/BriefComposer.jsx":"1d93dbd8057d","components/intake/BriefMessage.jsx":"446a4b89c521","components/intake/EstimatePanel.jsx":"eadce95e86ed","components/numbers/Compare.jsx":"2e7266c5ba08","components/numbers/Counter.jsx":"a47da9fea79b","components/numbers/Ledger.jsx":"f61eaf02fe22","components/numbers/Stat.jsx":"d3f241f1fea9","ui_kits/site/Chrome.jsx":"169b2a0e63a6","ui_kits/site/Hero.jsx":"b3f8633b9302","ui_kits/site/Home.jsx":"037978444da7","ui_kits/site/Intake.jsx":"d3085f5082c2","ui_kits/site/Pages.jsx":"34c4104a4360"},"inlinedExternals":[],"unexposedExports":[{"name":"inputBox","sourcePath":"components/forms/inputBox.js"}]} */

(() => {

const __ds_ns = (window.VCStudioDesignSystem_40ecfd = window.VCStudioDesignSystem_40ecfd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: ['var(--control-h-sm)', 16, 'var(--type-label-sm)'],
  md: ['var(--control-h-md)', 22, 'var(--type-label)'],
  lg: ['var(--control-h-lg)', 28, '500 17px/1 var(--font-sans)']
};

/** Primary (blue) / secondary (1px border) / tertiary (text with animated baseline). Labels are verbs, no trailing arrows. */
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconRight,
  full,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const [h, px, font] = sizes[size] || sizes.md;
  const off = disabled || loading;
  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: variant === 'tertiary' ? 'auto' : h,
    padding: variant === 'tertiary' ? '4px 0' : `0 ${px}px`,
    font,
    fontFamily: 'var(--font-sans)',
    borderRadius: variant === 'tertiary' ? 0 : 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: off ? 'not-allowed' : 'pointer',
    transition: 'background var(--dur-micro) var(--ease), color var(--dur-micro) var(--ease), border-color var(--dur-micro) var(--ease), transform var(--dur-micro) var(--ease)',
    transform: press && !off ? 'translateY(1px)' : 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    textDecoration: 'none',
    position: 'relative'
  };
  let look;
  if (off) look = variant === 'primary' ? {
    background: 'var(--disabled-bg)',
    color: 'var(--disabled-text)'
  } : {
    background: 'transparent',
    color: 'var(--disabled-text)',
    borderColor: variant === 'secondary' ? 'var(--line)' : 'transparent'
  };else if (variant === 'primary') look = {
    background: press ? 'var(--brand-press)' : hover ? 'var(--brand-hover)' : 'var(--brand)',
    color: 'var(--text-on-brand)'
  };else if (variant === 'secondary') look = {
    background: hover ? 'var(--surface)' : 'transparent',
    color: 'var(--text)',
    borderColor: hover ? 'var(--text)' : 'var(--line-strong)'
  };else look = {
    background: 'transparent',
    color: hover ? 'var(--brand)' : 'var(--text)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: off,
    "aria-busy": loading || undefined,
    style: {
      ...base,
      ...look,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '1.5px solid currentColor',
      borderRightColor: 'transparent',
      animation: 'vc-spin .8s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes vc-spin{to{transform:rotate(360deg)}}`)) : icon, /*#__PURE__*/React.createElement("span", null, children), !loading && iconRight, variant === 'tertiary' && !off && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 1,
      width: '100%',
      background: 'currentColor',
      transform: hover ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: hover ? 'left' : 'right',
      transition: 'transform var(--dur-ui) var(--ease)'
    }
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/CaseCard.jsx
try { (() => {
/** Editorial project preview: the visual IS the card; text sits plainly beneath on the canvas. Hover starts motion in the visual. */
function CaseCard({
  title,
  kind,
  year,
  client,
  days,
  budget,
  media,
  ratio = '4/3',
  href,
  onClick,
  size = 'md',
  style
}) {
  const [hover, setHover] = React.useState(false);
  const Wrap = href ? 'a' : 'div';
  const fact = (v, l) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-body)',
      fontFeatureSettings: 'var(--num-features)',
      color: 'var(--text)'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, l));
  return /*#__PURE__*/React.createElement(Wrap, {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      color: 'var(--text)',
      textDecoration: 'none',
      cursor: 'pointer',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      transform: hover ? 'scale(1.02)' : 'none',
      transition: 'transform var(--dur-reveal) var(--ease)',
      display: 'grid',
      placeItems: 'center'
    }
  }, media || /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, "\u043F\u0440\u0435\u0432\u044C\u044E \u043F\u0440\u043E\u0435\u043A\u0442\u0430"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, [kind, year, client].filter(Boolean).join(' / ')), /*#__PURE__*/React.createElement("span", {
    style: {
      font: size === 'lg' ? 'var(--type-h3)' : 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)',
      color: hover ? 'var(--brand)' : 'var(--text)',
      transition: 'color var(--dur-micro)'
    }
  }, title), (days || budget) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      paddingTop: 12,
      borderTop: '1px solid var(--line)'
    }
  }, days && fact(days + ' дней', 'до запуска'), budget && fact(budget.toLocaleString('ru-RU') + ' ₽', 'бюджет проекта'))));
}
Object.assign(__ds_scope, { CaseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CaseCard.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
/** Small text tag for type / stack / year. Plain, radius 4. */
function Tag({
  children,
  tone = 'default',
  style
}) {
  const t = {
    default: {
      color: 'var(--text-2)',
      border: 'var(--line-strong)'
    },
    brand: {
      color: 'var(--brand)',
      border: 'var(--brand)'
    },
    ink: {
      color: 'var(--surface)',
      border: 'var(--ink)',
      background: 'var(--ink)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 24,
      padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${t.border}`,
      background: t.background || 'transparent',
      color: t.color,
      font: 'var(--type-caption)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/content/Trace.jsx
try { (() => {
/** Production Trace — the brand motif. A thin blue line through named nodes; `active` index is the current stage, earlier ones are done, the last is production (green when reached). Draws on mount. */
function Trace({
  steps = ['Brief', 'Scope', 'Build', 'QA', 'Production'],
  active = 2,
  labels = true,
  vertical = false,
  style
}) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);
  const n = steps.length,
    done = Math.min(active, n - 1);
  const pct = n > 1 ? done / (n - 1) * 100 : 0;
  if (vertical) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      position: 'relative',
      ...style
    }
  }, steps.map((s, i) => {
    const d = i < active,
      cur = i === active,
      last = i === n - 1;
    const c = last && active >= n - 1 ? 'var(--positive)' : d || cur ? 'var(--brand)' : 'var(--line-strong)';
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        display: 'grid',
        gridTemplateColumns: '20px 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: cur ? 'var(--surface)' : c,
        border: `1.5px solid ${c}`,
        boxSizing: 'border-box',
        marginTop: 6,
        flex: 'none'
      }
    }), i < n - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        width: 1.5,
        minHeight: 32,
        background: d ? 'var(--brand)' : 'var(--line)',
        transformOrigin: 'top',
        transform: on ? 'scaleY(1)' : 'scaleY(0)',
        transition: `transform var(--dur-reveal) var(--ease) ${i * 120}ms`
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 28,
        minWidth: 0
      }
    }, typeof s === 'string' ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        color: d || cur ? 'var(--text)' : 'var(--text-3)'
      }
    }, s) : s));
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 12,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 5,
      right: 5,
      height: 1.5,
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 5,
      height: 1.5,
      background: 'var(--brand)',
      width: on ? `calc(${pct}% - ${pct / 100 * 10}px)` : 0,
      transition: 'width var(--dur-reveal) var(--ease)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, steps.map((s, i) => {
    const d = i < active,
      cur = i === active,
      last = i === n - 1;
    const c = last && active >= n - 1 ? 'var(--positive)' : d || cur ? 'var(--brand)' : 'var(--line-strong)';
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: cur ? 'var(--surface)' : c,
        border: `1.5px solid ${c}`,
        boxSizing: 'border-box',
        opacity: on || i === 0 ? 1 : 0,
        transition: `opacity var(--dur-ui) var(--ease) ${i * 120}ms`
      }
    });
  }))), labels && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 12
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: 'var(--type-caption)',
      color: i === n - 1 && active >= n - 1 ? 'var(--positive)' : i <= active ? 'var(--text)' : 'var(--text-3)',
      textAlign: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center',
      width: `${100 / n}%`,
      marginLeft: i === 0 ? 0 : undefined,
      transform: i === 0 ? 'translateX(-5px)' : i === n - 1 ? 'translateX(5px)' : 'none'
    }
  }, s))));
}
Object.assign(__ds_scope, { Trace });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Trace.jsx", error: String((e && e.message) || e) }); }

// components/demo/DemoBlock.jsx
try { (() => {
/** Frame for a live demo (WebGL, game, interactive). Idle poster with a run button; loading; then children mount. Light chrome; dark only when `dark`. */
function DemoBlock({
  title,
  meta,
  poster,
  ratio = '16/9',
  cta = 'Запустить демо',
  autoload = false,
  loadingText = 'Загружаем сцену',
  dark = false,
  children,
  onStart,
  style
}) {
  const [state, setState] = React.useState(autoload ? 'loading' : 'idle');
  React.useEffect(() => {
    if (state === 'loading') {
      const t = setTimeout(() => setState('live'), 1100);
      return () => clearTimeout(t);
    }
  }, [state]);
  const start = () => {
    setState('loading');
    onStart && onStart();
  };
  const bg = dark ? 'var(--contrast)' : 'var(--surface)',
    fg = dark ? 'var(--contrast-ink)' : 'var(--text)',
    fg2 = dark ? 'var(--contrast-ink-2)' : 'var(--text-2)',
    ln = dark ? 'var(--contrast-line)' : 'var(--line)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: ratio,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: `1px solid ${state === 'live' ? 'var(--brand)' : ln}`,
      background: bg,
      transition: 'border-color var(--dur-ui)'
    }
  }, state === 'live' ? children : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, poster, state === 'idle' ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: start,
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      height: 'var(--control-h-lg)',
      padding: '0 24px 0 18px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      background: 'var(--brand)',
      color: '#fff',
      font: '500 17px/1 var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })), cta) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      font: 'var(--type-body-sm)',
      color: fg2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '1.5px solid var(--brand)',
      borderRightColor: 'transparent',
      animation: 'vc-spin .8s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes vc-spin{to{transform:rotate(360deg)}}`), loadingText))), (title || meta) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 16,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      font: 'var(--type-caption)',
      color: state === 'live' ? 'var(--positive)' : 'var(--text-3)',
      fontFeatureSettings: 'var(--num-features)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: state === 'live' ? 'var(--positive)' : 'var(--line-strong)'
    }
  }), state === 'live' ? meta || 'Live' : 'Превью')));
}
Object.assign(__ds_scope, { DemoBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/demo/DemoBlock.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox with label; checked = brand blue. */
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled,
  label,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = e => {
    if (disabled) return;
    if (checked === undefined) setInner(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? 'var(--disabled-text)' : 'var(--text)',
      font: 'var(--type-body-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 20,
      height: 20,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${on ? 'var(--brand)' : 'var(--line-strong)'}`,
      background: disabled ? 'var(--disabled-bg)' : on ? 'var(--brand)' : 'var(--surface)',
      transition: 'all var(--dur-micro) var(--ease)',
      display: 'grid',
      placeItems: 'center'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
/** Compact chip — secondary multi-select only (filters, tags). Radius 4, never a pill. */
function Chip({
  selected,
  disabled,
  onClick,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    "aria-pressed": !!selected,
    onClick: onClick,
    style: {
      height: 32,
      padding: '0 12px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--type-label-sm)',
      fontFamily: 'var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: `1px solid ${selected ? 'var(--brand)' : 'var(--line-strong)'}`,
      background: selected ? 'var(--brand-soft)' : 'transparent',
      color: disabled ? 'var(--disabled-text)' : selected ? 'var(--brand)' : 'var(--text-2)',
      transition: 'all var(--dur-micro) var(--ease)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/** Label above, hint or error below. Labels are plain, no floating. */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label-sm)',
      color: 'var(--text-2)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, " *")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--error)' : 'var(--text-3)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/OptionBlock.jsx
try { (() => {
/** Rectangular option for single/multi choice (intake brief, project type). Selected = blue border + soft fill. Not a pill. */
function OptionBlock({
  selected,
  disabled,
  onClick,
  children,
  meta,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    "aria-pressed": !!selected,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minHeight: 52,
      padding: '0 16px',
      textAlign: 'left',
      borderRadius: 'var(--radius-md)',
      font: 'var(--type-body-sm)',
      fontFamily: 'var(--font-sans)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxSizing: 'border-box',
      border: `1px solid ${selected ? 'var(--brand)' : hover && !disabled ? 'var(--text)' : 'var(--line-strong)'}`,
      background: selected ? 'var(--brand-soft)' : 'var(--surface)',
      color: disabled ? 'var(--disabled-text)' : selected ? 'var(--brand)' : 'var(--text)',
      transition: 'all var(--dur-micro) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, children), meta && /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-caption)',
      color: selected ? 'var(--brand)' : 'var(--text-3)'
    }
  }, meta));
}
Object.assign(__ds_scope, { OptionBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/OptionBlock.jsx", error: String((e && e.message) || e) }); }

// components/forms/inputBox.js
try { (() => {
const inputBox = (focus, error, disabled) => ({
  width: '100%',
  boxSizing: 'border-box',
  background: disabled ? 'var(--disabled-bg)' : 'var(--surface)',
  color: disabled ? 'var(--disabled-text)' : 'var(--text)',
  border: `1px solid ${error ? 'var(--error)' : focus ? 'var(--brand)' : 'var(--line-strong)'}`,
  borderRadius: 'var(--radius-md)',
  font: 'var(--type-body)',
  fontFamily: 'var(--font-sans)',
  padding: '0 16px',
  outline: 'none',
  boxShadow: focus && !error ? '0 0 0 3px var(--brand-soft)' : 'none',
  transition: 'border-color var(--dur-micro) var(--ease), box-shadow var(--dur-micro) var(--ease)'
});
Object.assign(__ds_scope, { inputBox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/inputBox.js", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled like TextInput. */
function Select({
  error,
  disabled,
  options = [],
  placeholder,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    "aria-invalid": error || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    defaultValue: rest.value === undefined ? '' : undefined,
    style: {
      ...__ds_scope.inputBox(focus, error, disabled),
      height: 'var(--input-h)',
      appearance: 'none',
      paddingRight: 44,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": true,
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-2)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Single-line field, 56px, white, 1px line; focus = blue border + soft ring. Numeric inputs get tabular figures. */
function TextInput({
  error,
  disabled,
  prefix,
  suffix,
  type = 'text',
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const numeric = type === 'number' || rest.inputMode === 'numeric' || rest.inputMode === 'decimal';
  const el = /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    disabled: disabled,
    "aria-invalid": error || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...__ds_scope.inputBox(focus, error, disabled),
      height: 'var(--input-h)',
      fontFeatureSettings: numeric ? 'var(--num-features)' : undefined,
      paddingLeft: prefix ? 40 : 16,
      paddingRight: suffix ? 44 : 16,
      ...style
    }
  }, rest));
  if (!prefix && !suffix) return el;
  const side = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-3)',
    font: 'var(--type-body)',
    pointerEvents: 'none'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      ...side,
      left: 14
    }
  }, prefix), el, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      ...side,
      right: 14
    }
  }, suffix));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line field matching TextInput. */
function Textarea({
  error,
  disabled,
  rows = 3,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    "aria-invalid": error || undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...__ds_scope.inputBox(focus, error, disabled),
      padding: '14px 16px',
      resize: 'vertical',
      lineHeight: 1.55,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/intake/BriefComposer.jsx
try { (() => {
/** Free-text answer field for the brief: white, 1px, blue send. Enter sends, Shift+Enter breaks. */
function BriefComposer({
  placeholder = 'Или напишите своими словами',
  value,
  onChange,
  onSend,
  disabled,
  style
}) {
  const [inner, setInner] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const text = value !== undefined ? value : inner;
  const set = v => {
    if (value === undefined) setInner(v);
    onChange && onChange(v);
  };
  const send = () => {
    if (!text.trim() || disabled) return;
    onSend && onSend(text.trim());
    set('');
  };
  const can = !!text.trim() && !disabled;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      padding: 6,
      background: 'var(--surface)',
      border: `1px solid ${focus ? 'var(--brand)' : 'var(--line-strong)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 3px var(--brand-soft)' : 'none',
      transition: 'all var(--dur-micro)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 1,
    value: text,
    disabled: disabled,
    placeholder: placeholder,
    onChange: e => set(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      minHeight: 44,
      maxHeight: 160,
      padding: '12px 10px',
      resize: 'none',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text)',
      font: 'var(--type-body)',
      fontFamily: 'var(--font-sans)',
      lineHeight: 1.3
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0432\u0435\u0442",
    onClick: send,
    disabled: !can,
    style: {
      width: 44,
      height: 44,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: can ? 'pointer' : 'not-allowed',
      background: can ? 'var(--brand)' : 'var(--disabled-bg)',
      color: can ? '#fff' : 'var(--disabled-text)',
      display: 'grid',
      placeItems: 'center',
      transition: 'background var(--dur-micro)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 19V5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m5 12 7-7 7 7"
  }))));
}
Object.assign(__ds_scope, { BriefComposer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/intake/BriefComposer.jsx", error: String((e && e.message) || e) }); }

// components/intake/BriefMessage.jsx
try { (() => {
/** One line of the project brief dialogue. Not a chat bubble: AI is a plain paragraph with a blue index; the user's answer is set in ink with a left rule. */
function BriefMessage({
  role = 'ai',
  index,
  children,
  pending,
  style
}) {
  const ai = role === 'ai';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '40px minmax(0,1fr)',
      gap: 16,
      alignItems: 'start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: ai ? 'var(--brand)' : 'var(--text-3)',
      paddingTop: 5
    }
  }, ai ? index !== undefined ? String(index).padStart(2, '0') : '—' : ''), pending ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 5,
      alignItems: 'center',
      height: 26
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes vc-dot{0%,80%,100%{opacity:.25}40%{opacity:1}}`), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--brand)',
      animation: `vc-dot 1.2s ${i * .15}s var(--ease-in-out) infinite`
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: ai ? 'var(--type-body-lg)' : 'var(--type-body)',
      color: ai ? 'var(--text)' : 'var(--text-2)',
      borderLeft: ai ? 'none' : '1.5px solid var(--line-strong)',
      paddingLeft: ai ? 0 : 14,
      lineHeight: 1.45
    }
  }, children));
}
Object.assign(__ds_scope, { BriefMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/intake/BriefMessage.jsx", error: String((e && e.message) || e) }); }

// components/intake/EstimatePanel.jsx
try { (() => {
/** Live estimate that assembles beside the brief: scope rows append as answers arrive; term and budget range fill in. Empty state until the first answer. */
function EstimatePanel({
  scope = [],
  term,
  budget,
  status = 'empty',
  onConfirm,
  confirmLabel = 'Получить точную оценку',
  style
}) {
  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '14px 0',
    borderBottom: '1px solid var(--line)',
    alignItems: 'baseline'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-md)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingBottom: 12,
      borderBottom: '1px solid var(--text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "\u041F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 scope"), status === 'thinking' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--brand)'
    }
  }, "\u0421\u043E\u0431\u0438\u0440\u0430\u0435\u043C scope"), status === 'ready' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--positive)'
    }
  }, "\u0413\u043E\u0442\u043E\u0432\u043E")), status === 'empty' && scope.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text)'
    }
  }, "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-3)'
    }
  }, "\u041E\u0442\u0432\u0435\u0442\u044C\u0442\u0435 \u043D\u0430 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432 \u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0435.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      padding: '16px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, scope.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text)',
      padding: '6px 10px',
      border: '1px solid var(--line-strong)',
      borderRadius: 'var(--radius-sm)',
      animation: 'vc-in var(--dur-ui) var(--ease) both',
      animationDelay: `${i * 40}ms`
    }
  }, s)), /*#__PURE__*/React.createElement("style", null, `@keyframes vc-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`)), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, "\u041E\u0446\u0435\u043D\u043A\u0430 \u0441\u0440\u043E\u043A\u0430"), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-body)',
      color: term ? 'var(--text)' : 'var(--text-3)',
      fontFeatureSettings: 'var(--num-features)'
    }
  }, term || '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      ...row,
      borderBottom: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, "\u041F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442"), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-num-md)',
      letterSpacing: 'var(--track-num)',
      color: budget ? 'var(--text)' : 'var(--text-3)',
      fontFeatureSettings: 'var(--num-features)'
    }
  }, budget || '—')), status === 'ready' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)',
      paddingBottom: 16
    }
  }, "\u042D\u0442\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430. \u041F\u0435\u0440\u0435\u0434 \u0441\u0442\u0430\u0440\u0442\u043E\u043C \u0438\u043D\u0436\u0435\u043D\u0435\u0440 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442 scope \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onConfirm,
    style: {
      height: 'var(--control-h-md)',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--brand)',
      color: '#fff',
      font: 'var(--type-label)',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer'
    }
  }, confirmLabel))));
}
Object.assign(__ds_scope, { EstimatePanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/intake/EstimatePanel.jsx", error: String((e && e.message) || e) }); }

// components/numbers/Compare.jsx
try { (() => {
/** Two production models as horizontal bars — ours in blue, market reference in graphite. Quiet; no strike-through, no badges. */
function Compare({
  ours,
  theirs,
  ourLabel = 'AI-native production',
  theirLabel = 'Классическая production-модель',
  unit = ' ₽',
  savingLabel = 'разница',
  note,
  style
}) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);
  const fmt = v => Array.isArray(v) ? v[0].toLocaleString('ru-RU') + '–' + v[1].toLocaleString('ru-RU') + unit : v.toLocaleString('ru-RU') + unit;
  const max = Array.isArray(theirs) ? theirs[1] : theirs;
  const oursN = Array.isArray(ours) ? ours[1] : ours;
  const theirsN = Array.isArray(theirs) ? theirs[0] : theirs;
  const bar = (v, color) => /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40,
      background: color,
      width: on ? v / max * 100 + '%' : '0%',
      transition: 'width var(--dur-reveal) var(--ease)',
      borderRadius: 2
    }
  });
  const row = (label, v, vN, color) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: 24,
      alignItems: 'center',
      padding: '20px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, label), bar(vN, color)), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-num-md)',
      letterSpacing: 'var(--track-num)',
      fontFeatureSettings: 'var(--num-features)',
      color: color === 'var(--brand)' ? 'var(--text)' : 'var(--text-2)',
      whiteSpace: 'nowrap'
    }
  }, fmt(v)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, row(ourLabel, ours, oursN, 'var(--brand)'), row(theirLabel, theirs, theirsN, 'var(--line-strong)'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      padding: '16px 0 0',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)',
      maxWidth: 520
    }
  }, note), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-body)',
      color: 'var(--positive)',
      fontFeatureSettings: 'var(--num-features)',
      whiteSpace: 'nowrap'
    }
  }, savingLabel, " \u2212", (theirsN - oursN).toLocaleString('ru-RU'), unit)));
}
Object.assign(__ds_scope, { Compare });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/numbers/Compare.jsx", error: String((e && e.message) || e) }); }

// components/numbers/Counter.jsx
try { (() => {
/** Animated tabular number. Ink by default; tone="positive" for savings/live, tone="brand" for the highlighted figure. */
function Counter({
  value = 0,
  from,
  duration = 900,
  decimals = 0,
  prefix = '',
  suffix = '',
  size = 'lg',
  tone = 'ink',
  style
}) {
  const [shown, setShown] = React.useState(from ?? value);
  const prev = React.useRef(from ?? value);
  React.useEffect(() => {
    const start = prev.current,
      end = value,
      t0 = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min(1, (now - t0) / duration),
        e = 1 - Math.pow(1 - p, 3);
      setShown(start + (end - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick);else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const font = {
    xl: 'var(--type-num-xl)',
    lg: 'var(--type-num-lg)',
    md: 'var(--type-num-md)',
    sm: 'var(--type-num-sm)'
  }[size] || 'var(--type-num-lg)';
  const color = {
    ink: 'var(--text)',
    positive: 'var(--positive)',
    brand: 'var(--brand)',
    muted: 'var(--text-2)',
    inverse: 'var(--contrast-ink)'
  }[tone] || 'var(--text)';
  return /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font,
      letterSpacing: 'var(--track-num)',
      fontFeatureSettings: 'var(--num-features)',
      fontVariantNumeric: 'tabular-nums lining-nums',
      color,
      whiteSpace: 'nowrap',
      ...style
    }
  }, prefix, shown.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }), suffix);
}
Object.assign(__ds_scope, { Counter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/numbers/Counter.jsx", error: String((e && e.message) || e) }); }

// components/numbers/Ledger.jsx
try { (() => {
/** Estimate / invoice rows: label left, value right, 1px dividers, total row emphasised. The brand's pricing surface — never SaaS tiers. */
function Ledger({
  title,
  rows = [],
  total,
  totalLabel = 'Итого',
  note,
  dense,
  style
}) {
  const cell = {
    padding: dense ? '12px 0' : '18px 0',
    borderBottom: '1px solid var(--line)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 24
  };
  const val = (v, tone) => /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: dense ? 'var(--type-body)' : 'var(--type-body-lg)',
      fontFeatureSettings: 'var(--num-features)',
      color: tone === 'positive' ? 'var(--positive)' : tone === 'muted' ? 'var(--text-3)' : tone === 'brand' ? 'var(--brand)' : 'var(--text)',
      whiteSpace: 'nowrap'
    }
  }, typeof v === 'number' ? v.toLocaleString('ru-RU') + ' ₽' : v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)',
      paddingBottom: 12,
      borderBottom: '1px solid var(--text)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, title), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: cell
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: dense ? 'var(--type-body-sm)' : 'var(--type-body)',
      color: 'var(--text)'
    }
  }, r.label), r.sub && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, r.sub)), val(r.value, r.tone))), total !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      ...cell,
      borderBottom: 'none',
      paddingTop: 24,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-2)'
    }
  }, totalLabel), /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-num-md)',
      letterSpacing: 'var(--track-num)',
      fontFeatureSettings: 'var(--num-features)',
      color: 'var(--text)',
      whiteSpace: 'nowrap'
    }
  }, typeof total === 'number' ? total.toLocaleString('ru-RU') + ' ₽' : total)), note && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)',
      paddingTop: 12
    }
  }, note));
}
Object.assign(__ds_scope, { Ledger });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/numbers/Ledger.jsx", error: String((e && e.message) || e) }); }

// components/numbers/Stat.jsx
try { (() => {
/** Big number + short label, optional caption. Numbers animate on mount. */
function Stat({
  value,
  label,
  note,
  tone = 'ink',
  size = 'lg',
  animate = true,
  prefix,
  suffix,
  decimals,
  style
}) {
  const numeric = typeof value === 'number';
  const color = {
    ink: 'var(--text)',
    positive: 'var(--positive)',
    brand: 'var(--brand)',
    inverse: 'var(--contrast-ink)'
  }[tone];
  const font = {
    xl: 'var(--type-num-xl)',
    lg: 'var(--type-num-lg)',
    md: 'var(--type-num-md)',
    sm: 'var(--type-num-sm)'
  }[size];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0,
      ...style
    }
  }, numeric && animate ? /*#__PURE__*/React.createElement(__ds_scope.Counter, {
    value: value,
    from: 0,
    size: size,
    prefix: prefix,
    suffix: suffix,
    decimals: decimals,
    tone: tone
  }) : /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font,
      letterSpacing: 'var(--track-num)',
      fontFeatureSettings: 'var(--num-features)',
      color
    }
  }, prefix, value, suffix), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: tone === 'inverse' ? 'var(--contrast-ink-2)' : 'var(--text-2)'
    }
  }, label), note && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, note));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/numbers/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Chrome.jsx
try { (() => {
const {
  Button
} = window.VCStudioDesignSystem_40ecfd;
function Container({
  children,
  style,
  id
}) {
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-pad)',
      boxSizing: 'border-box',
      ...style
    }
  }, children);
}
function Section({
  children,
  style,
  id,
  pad = 140,
  border
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      paddingTop: pad,
      borderTop: border ? '1px solid var(--line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: style
  }, children));
}
/** Editorial 5/7 head: index + title left, lead right. */
function Head({
  index,
  title,
  lead,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'end',
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, index && /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)'
    }
  }, index), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h2)',
      letterSpacing: 'var(--track-h2)',
      maxWidth: 760,
      textWrap: 'balance'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, lead && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)',
      maxWidth: 480,
      textWrap: 'pretty'
    }
  }, lead), children));
}
function Nav({
  go,
  screen
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  const items = [['cases', 'Кейсы'], ['process', 'Как работаем'], ['economics', 'Стоимость'], ['agencies', 'Для агентств']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-header)',
      background: 'var(--canvas)',
      borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
      transition: 'border-color var(--dur-ui)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      height: 'var(--header-h)',
      display: 'flex',
      alignItems: 'center',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      font: '500 22px/1 var(--font-sans)',
      letterSpacing: '-.04em',
      color: 'var(--text)'
    }
  }, "VC Studio"), /*#__PURE__*/React.createElement("nav", {
    className: "nav-links",
    style: {
      display: 'flex',
      gap: 32,
      flex: 1,
      justifyContent: 'flex-end'
    }
  }, items.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home', k);
    },
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('home', 'intake')
  }, "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442")));
}
function Footer({
  go
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--line)',
      marginTop: 140
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '48px var(--container-pad) 40px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,5fr) minmax(0,4fr) minmax(0,3fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 22px/1 var(--font-sans)',
      letterSpacing: '-.04em'
    }
  }, "VC Studio"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)',
      maxWidth: 360
    }
  }, "AI-native production \u0434\u043B\u044F \u0441\u0430\u0439\u0442\u043E\u0432, \u0438\u0433\u0440 \u0438 digital-\u0441\u043F\u0435\u0446\u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, [['cases', 'Кейсы'], ['process', 'Как работаем'], ['economics', 'Стоимость'], ['agencies', 'Для агентств'], ['faq', 'Вопросы']].map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home', k);
    },
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@vc.studio",
    style: {
      font: 'var(--type-body-sm)'
    }
  }, "hello@vc.studio"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      font: 'var(--type-body-sm)'
    }
  }, "Telegram"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)',
      marginTop: 16
    }
  }, "\xA9 2026"))));
}
Object.assign(window, {
  Container,
  Section,
  Head,
  Nav,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Hero.jsx
try { (() => {
const {
  Button,
  Counter
} = window.VCStudioDesignSystem_40ecfd;

/** Production canvas: a light build interface that assembles itself in ~1.6s, then stays calm. */
function ProductionCanvas() {
  const rows = [['Hero section', 'ready'], ['Interactive canvas', 'ready'], ['API integration', 'building'], ['QA', 'queued']];
  const [step, setStep] = React.useState(0);
  const [tokens, setTokens] = React.useState(0);
  React.useEffect(() => {
    const t = [200, 500, 800, 1100, 1400].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    const t0 = setTimeout(() => setTokens(1284310), 900);
    const live = setInterval(() => setTokens(v => v ? v + Math.round(Math.random() * 600) : v), 2400);
    return () => {
      t.forEach(clearTimeout);
      clearTimeout(t0);
      clearInterval(live);
    };
  }, []);
  const cost = Math.round(tokens * 0.00299);
  const status = s => s === 'ready' ? {
    c: 'var(--positive)',
    t: 'ready'
  } : s === 'building' ? {
    c: 'var(--brand)',
    t: 'building'
  } : {
    c: 'var(--text-3)',
    t: 'queued'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      position: 'relative',
      overflow: 'hidden',
      opacity: step > 0 ? 1 : 0,
      transition: 'opacity var(--dur-ui) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingBottom: 16,
      borderBottom: '1px solid var(--text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)',
      letterSpacing: '.04em'
    }
  }, "BUILD 0042"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      font: 'var(--type-caption)',
      color: 'var(--positive)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--positive)'
    }
  }), "Live")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 4,
      top: 0,
      bottom: 0,
      width: 1.5,
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 4,
      top: 0,
      width: 1.5,
      background: 'var(--brand)',
      height: `${Math.min(step, 4) / 4 * 100}%`,
      transition: 'height var(--dur-reveal) var(--ease)'
    }
  }), rows.map(([n, s], i) => {
    const on = step > i,
      st = status(s);
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'grid',
        gridTemplateColumns: '24px 1fr auto',
        gap: 12,
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid var(--line)',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(6px)',
        transition: 'all var(--dur-ui) var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: s === 'queued' ? 'var(--surface)' : st.c,
        border: `1.5px solid ${st.c}`,
        boxSizing: 'border-box',
        marginLeft: .5
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text)'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: st.c
      }
    }, st.t));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      paddingTop: 24,
      opacity: step > 3 ? 1 : 0,
      transition: 'opacity var(--dur-reveal) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, "AI-\u0440\u0430\u0441\u0445\u043E\u0434 \u044D\u0442\u043E\u0439 \u0441\u0431\u043E\u0440\u043A\u0438"), /*#__PURE__*/React.createElement(Counter, {
    value: tokens,
    size: "md",
    suffix: " \u0442\u043E\u043A\u0435\u043D\u043E\u0432",
    style: {
      fontSize: 'clamp(22px,2vw,30px)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, "\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043C\u043E\u0434\u0435\u043B\u0435\u0439"), /*#__PURE__*/React.createElement(Counter, {
    value: cost,
    size: "md",
    suffix: " \u20BD",
    style: {
      fontSize: 'clamp(22px,2vw,30px)'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)',
      paddingTop: 16,
      opacity: step > 4 ? 1 : 0,
      transition: 'opacity var(--dur-reveal)'
    }
  }, "\u0421\u0447\u0451\u0442\u0447\u0438\u043A \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430 \u0438 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043F\u043E\u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C \u043C\u043E\u0434\u0435\u043B\u0438 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0434\u0435\u043C\u043E. \u0411\u0435\u0437 \u043D\u0430\u0446\u0435\u043D\u043A\u0438 \u043D\u0430 AI-\u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443."));
}
function Hero({
  go
}) {
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setIn(true), 40);
    return () => clearTimeout(t);
  }, []);
  const reveal = d => ({
    clipPath: in_ ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
    transform: in_ ? 'none' : 'translateY(12px)',
    transition: `clip-path var(--dur-reveal) var(--ease) ${d}ms, transform var(--dur-reveal) var(--ease) ${d}ms`
  });
  return /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 72
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-display)',
      letterSpacing: 'var(--track-display)',
      maxWidth: 820,
      textWrap: 'balance',
      ...reveal(80)
    }
  }, "\u0421\u043F\u0435\u0446\u043F\u0440\u043E\u0435\u043A\u0442\u044B \u043D\u0430 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 AI. \u0421 \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u0442\u0443\u0434\u0438\u0438."), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start',
      ...reveal(240)
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, "\u0414\u0435\u043B\u0430\u0435\u043C \u043F\u0440\u043E\u043C\u043E-\u0441\u0430\u0439\u0442\u044B, \u0432\u0435\u0431-\u0438\u0433\u0440\u044B, 3D \u0438 \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B. AI \u0431\u0435\u0440\u0451\u0442 \u043D\u0430 \u0441\u0435\u0431\u044F \u0431\u043E\u043B\u044C\u0448\u0443\u044E \u0447\u0430\u0441\u0442\u044C \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043A\u043E\u0434\u0430, \u043D\u0430\u0448\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u2014 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0443, \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0438 \u0437\u0430\u043F\u0443\u0441\u043A."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)',
      paddingTop: 4,
      borderTop: '1px solid var(--line)'
    }
  }, "\u0420\u0430\u0441\u0445\u043E\u0434 AI \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u043F\u043E \u0444\u0430\u043A\u0442\u0443. \u0420\u0430\u0431\u043E\u0442\u0443 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u043C \u0437\u0430\u0440\u0430\u043D\u0435\u0435.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      ...reveal(360)
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('home', 'intake')
  }, "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => go('home', 'cases')
  }, "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043A\u0435\u0439\u0441\u044B"))), /*#__PURE__*/React.createElement(ProductionCanvas, null)));
}
Object.assign(window, {
  Hero,
  ProductionCanvas
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Home.jsx
try { (() => {
const {
  Button,
  Counter,
  Stat,
  Ledger,
  Compare,
  CaseCard,
  DemoBlock,
  Trace,
  Tag
} = window.VCStudioDesignSystem_40ecfd;
const Media = ({
  c,
  t,
  fg = 'rgba(255,255,255,.55)'
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    background: c,
    display: 'grid',
    placeItems: 'center'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    font: '500 clamp(28px,4vw,56px)/1 var(--font-sans)',
    letterSpacing: '-.04em',
    color: fg
  }
}, t));
function LiveTokens() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setN(x => x + Math.round(Math.random() * 900)), 600);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Counter, {
    value: n,
    size: "xl",
    tone: "inverse"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--contrast-ink-2)'
    }
  }, "\u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0437\u0430 \u044D\u0442\u0443 \u0441\u0435\u0441\u0441\u0438\u044E")));
}
function Demos() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "demos",
    pad: 160
  }, /*#__PURE__*/React.createElement(Head, {
    index: "01",
    title: "\u041D\u0435 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C, \u0447\u0442\u043E \u0443\u043C\u0435\u0435\u043C. \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C.",
    lead: "\u0412\u0435\u0431-\u0438\u0433\u0440\u044B, 3D, \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0438 \u0438 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 \u043F\u0440\u044F\u043C\u043E \u0437\u0434\u0435\u0441\u044C. \u042D\u0442\u043E \u0442\u043E\u0442 \u0436\u0435 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043C\u044B \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u043C \u0434\u043B\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u0441\u043A\u0438\u0445 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement(DemoBlock, {
    dark: true,
    title: "3D-\u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043E\u0440 \u0443\u043F\u0430\u043A\u043E\u0432\u043A\u0438",
    meta: "WebGL \xB7 60 FPS",
    ratio: "21/9",
    cta: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0435\u043C\u043E",
    poster: /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--contrast-ink-2)',
        font: 'var(--type-body-sm)'
      }
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(36vw,320px)',
      aspectRatio: '1',
      border: '1.5px solid var(--brand)',
      borderRadius: 'var(--radius-lg)',
      animation: 'vc-turn 6s var(--ease-in-out) infinite alternate',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--contrast-ink-2)',
      font: 'var(--type-caption)'
    }
  }, "\u0437\u0434\u0435\u0441\u044C \u043C\u043E\u043D\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0441\u0446\u0435\u043D\u0430")), /*#__PURE__*/React.createElement("style", null, `@keyframes vc-turn{from{transform:perspective(900px) rotateY(-24deg) rotateX(8deg)}to{transform:perspective(900px) rotateY(24deg) rotateX(-8deg)}}`))), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(DemoBlock, {
    title: "\u0411\u0440\u0430\u0443\u0437\u0435\u0440\u043D\u0430\u044F \u043C\u0438\u043D\u0438-\u0438\u0433\u0440\u0430",
    meta: "Canvas \xB7 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434",
    ratio: "16/10",
    cta: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0438\u0433\u0440\u0443"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-3)',
      font: 'var(--type-body-sm)'
    }
  }, "\u0437\u0434\u0435\u0441\u044C \u043C\u043E\u043D\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0438\u0433\u0440\u0430")), /*#__PURE__*/React.createElement(DemoBlock, {
    title: "Live-\u0441\u0447\u0451\u0442\u0447\u0438\u043A \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438",
    meta: "Live",
    ratio: "4/5",
    autoload: true,
    dark: true
  }, /*#__PURE__*/React.createElement(LiveTokens, null)))));
}
function Cases({
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    id: "cases",
    pad: 160
  }, /*#__PURE__*/React.createElement(Head, {
    index: "02",
    title: "\u041A\u0435\u0439\u0441\u044B \u0441 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0439 \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u043A\u043E\u0439",
    lead: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442, \u043D\u043E \u0438 \u0441\u0440\u043E\u043A, \u0438\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442 \u0438 \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 AI-\u0440\u0430\u0441\u0445\u043E\u0434."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: '64px var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(CaseCard, {
    size: "lg",
    ratio: "16/10",
    onClick: () => go('case'),
    kind: "\u0412\u0435\u0431-\u0438\u0433\u0440\u0430",
    year: "2026",
    client: "\u0421\u0435\u0442\u044C \u043A\u043E\u0444\u0435\u0435\u043D",
    title: "\u041F\u0440\u043E\u043C\u043E-\u0438\u0433\u0440\u0430 \u0441 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u043E\u043C \u0438 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u0430\u043C\u0438",
    days: 9,
    budget: 184000,
    media: /*#__PURE__*/React.createElement(Media, {
      c: "var(--vermilion)",
      t: "Coffee Run"
    })
  }), /*#__PURE__*/React.createElement(CaseCard, {
    onClick: () => go('case'),
    kind: "3D / WebGL",
    year: "2026",
    client: "\u0417\u0430\u0441\u0442\u0440\u043E\u0439\u0449\u0438\u043A",
    title: "\u041A\u0432\u0430\u0440\u0442\u0430\u043B \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435",
    days: 14,
    budget: 412000,
    media: /*#__PURE__*/React.createElement(Media, {
      c: "var(--ink)",
      t: "Quarter"
    })
  }), /*#__PURE__*/React.createElement(CaseCard, {
    onClick: () => go('case'),
    kind: "\u041F\u0440\u043E\u043C\u043E-\u0441\u0430\u0439\u0442",
    year: "2026",
    client: "\u0411\u0430\u043D\u043A",
    title: "\u0417\u0430\u043F\u0443\u0441\u043A \u043A\u0430\u0440\u0442\u044B \u0441\u043E scroll-\u043C\u0435\u0445\u0430\u043D\u0438\u043A\u043E\u0439",
    days: 6,
    budget: 126500,
    media: /*#__PURE__*/React.createElement(Media, {
      c: "var(--surface-2)",
      t: "Launch",
      fg: "var(--text-3)"
    })
  }), /*#__PURE__*/React.createElement(CaseCard, {
    ratio: "16/10",
    size: "lg",
    onClick: () => go('case'),
    kind: "\u0421\u043F\u0435\u0446\u043F\u0440\u043E\u0435\u043A\u0442",
    year: "2026",
    client: "FMCG",
    title: "\u0418\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 storytelling \u043A \u0441\u0435\u0437\u043E\u043D\u043D\u043E\u0439 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438",
    days: 12,
    budget: 238000,
    media: /*#__PURE__*/React.createElement(Media, {
      c: "var(--brand-soft)",
      t: "Season",
      fg: "var(--brand)"
    })
  })));
}
function WhatWeDo() {
  const items = [['Промо-сайты', 'Кампании, запуски, продуктовые страницы с интерактивом и анимацией.'], ['Веб-игры', 'Короткие браузерные механики с лидербордами, промокодами и аналитикой.'], ['3D / WebGL', 'Конфигураторы, сцены и визуализации, которые работают без установки.'], ['Спецпроекты', 'Нестандартная механика под конкретную рекламную идею.'], ['Production для агентств', 'Frontend, backend, интеграции и запуск по готовому дизайну.']];
  return /*#__PURE__*/React.createElement(Section, {
    id: "what",
    pad: 160,
    border: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
      gap: 'var(--grid-gutter)',
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)'
    }
  }, "03"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h2)',
      letterSpacing: 'var(--track-h2)'
    }
  }, "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0435\u043C"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      color: 'var(--text-2)',
      maxWidth: 400
    }
  }, "\u0411\u044E\u0434\u0436\u0435\u0442\u044B \u043E\u0442 100 000 \u20BD. \u0412\u0435\u0440\u0445\u043D\u0435\u0439 \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u043D\u0435\u0442: \u0442\u043E\u0442 \u0436\u0435 production \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0442 \u043F\u0440\u043E\u0435\u043A\u0442\u044B, \u0437\u0430 \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0441\u0442\u0443\u0434\u0438\u044F \u0431\u0435\u0440\u0451\u0442 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043C\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432.")), /*#__PURE__*/React.createElement("div", null, items.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px minmax(0,1fr) minmax(0,1.4fr)',
      gap: 'var(--grid-gutter)',
      padding: '24px 0',
      borderBottom: '1px solid var(--line)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, d))))));
}
function Economics() {
  return /*#__PURE__*/React.createElement(Section, {
    id: "economics",
    pad: 160
  }, /*#__PURE__*/React.createElement(Head, {
    index: "04",
    title: "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0431\u0435\u0437 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u044F\u0449\u0438\u043A\u0430",
    lead: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0441\u043E\u0441\u0442\u043E\u0438\u0442 \u0438\u0437 \u0434\u0432\u0443\u0445 \u0447\u0430\u0441\u0442\u0435\u0439: \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0440\u0430\u0441\u0445\u043E\u0434\u0430 AI-\u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432 \u0438 \u0440\u0430\u0431\u043E\u0442\u044B production-\u043A\u043E\u043C\u0430\u043D\u0434\u044B. \u0414\u043E \u0441\u0442\u0430\u0440\u0442\u0430 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u043C scope \u0438 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043D\u0430\u0448\u0435\u0439 \u0440\u0430\u0431\u043E\u0442\u044B. \u041F\u043E\u0441\u043B\u0435 \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0441\u0445\u043E\u0434 \u043C\u043E\u0434\u0435\u043B\u0435\u0439."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid3",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--grid-gutter)'
    }
  }, [['AI-инфраструктура', 'По фактическому расходу', 'Модели, генерация, агентские сессии и другие AI-расходы проекта.'], ['Production-команда', 'Фиксируем до старта', 'Архитектура, управление, инженерный контроль, QA, интеграции, деплой и выпуск.'], ['Поддержка', '3 месяца включены', 'Исправляем ошибки и сопровождаем запущенный проект. Дальше — от 5 000 ₽ / мес.']].map(([h, v, d]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      borderTop: '1px solid var(--text)',
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, h), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)'
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, d)))), /*#__PURE__*/React.createElement(Ledger, {
    title: "Project estimate \xB7 demo",
    rows: [{
      label: 'AI-инфраструктура',
      sub: 'по фактическому расходу',
      value: 12840
    }, {
      label: 'Production-команда',
      sub: 'зафиксировано до старта',
      value: 94000
    }, {
      label: 'Поддержка 3 месяца',
      value: 'включено',
      tone: 'positive'
    }],
    total: 106840,
    totalLabel: "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",
    note: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0440\u0430\u0441\u0447\u0451\u0442. \u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u044B."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-h3)',
      letterSpacing: 'var(--track-h3)'
    }
  }, "\u041E\u0434\u0438\u043D \u0438 \u0442\u043E\u0442 \u0436\u0435 scope. \u0420\u0430\u0437\u043D\u044B\u0439 \u043E\u0431\u044A\u0451\u043C \u0440\u0443\u0447\u043D\u043E\u0439 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)',
      maxWidth: 400
    }
  }, "AI \u0441\u043E\u043A\u0440\u0430\u0442\u0438\u043B \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043C\u0435\u0445\u0430\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438. \u041C\u044B \u043F\u0435\u0440\u0435\u0441\u0442\u0440\u043E\u0438\u043B\u0438 \u043F\u043E\u0434 \u044D\u0442\u043E production \u0438 \u0446\u0435\u043D\u043E\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435.")), /*#__PURE__*/React.createElement(Compare, {
    ours: 180000,
    theirs: [450000, 650000],
    ourLabel: "AI-native production",
    theirLabel: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F production-\u043C\u043E\u0434\u0435\u043B\u044C",
    note: "\u041E\u0440\u0438\u0435\u043D\u0442\u0438\u0440 \u0434\u043B\u044F \u0441\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043C\u043E\u0433\u043E \u043E\u0431\u044A\u0451\u043C\u0430 \u0440\u0430\u0431\u043E\u0442. \u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u044B."
  }))));
}
function Process() {
  const steps = [['Задача', 'Можно прийти без ТЗ.', 'Разбираем задачу, аудиторию, механику, ограничения и срок.'], ['Scope', 'Собираем решение до начала разработки.', 'Определяем сценарии, дизайн, интеграции и критерии готовности.'], ['Production', 'AI генерирует. Инженер управляет.', 'Работаем с coding agents, проверяем архитектуру, код и промежуточные сборки.'], ['QA и запуск', 'В прод попадает не первый ответ модели.', 'Тестируем адаптивность, сценарии, производительность, интеграции и ошибки.'], ['Отчёт', 'После запуска открываем экономику проекта.', 'Показываем AI-расход, работу команды и итоговую стоимость.']];
  return /*#__PURE__*/React.createElement(Section, {
    id: "process",
    pad: 160,
    border: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement(Head, {
    index: "05",
    title: "AI \u0432\u043D\u0443\u0442\u0440\u0438. \u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0441\u043D\u0430\u0440\u0443\u0436\u0438.",
    lead: "\u0414\u043B\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u043F\u0440\u043E\u0446\u0435\u0441\u0441 \u043F\u043E\u0447\u0442\u0438 \u043D\u0435 \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043E\u0442 \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u0441\u0438\u043B\u044C\u043D\u043E\u0439 \u0441\u0442\u0443\u0434\u0438\u0435\u0439. \u041E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0442\u043E, \u0447\u0442\u043E \u043F\u0440\u043E\u0438\u0441\u0445\u043E\u0434\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0438 production."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      position: 'sticky',
      top: 120
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      color: 'var(--text)',
      maxWidth: 360
    }
  }, "\u0412 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0438\u0441\u0442 \u043F\u0438\u0448\u0435\u0442 \u0431\u043E\u043B\u044C\u0448\u0443\u044E \u0447\u0430\u0441\u0442\u044C \u043A\u043E\u0434\u0430 \u0432\u0440\u0443\u0447\u043D\u0443\u044E. \u0423 \u043D\u0430\u0441 \u0438\u043D\u0436\u0435\u043D\u0435\u0440 \u0441\u0442\u0430\u0432\u0438\u0442 \u0437\u0430\u0434\u0430\u0447\u0443 AI-\u0430\u0433\u0435\u043D\u0442\u0443, \u0437\u0430\u0434\u0430\u0451\u0442 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442 \u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F, \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u0435, \u0442\u0435\u0441\u0442\u0438\u0440\u0443\u0435\u0442 \u0438 \u0434\u043E\u0432\u043E\u0434\u0438\u0442 \u0435\u0433\u043E \u0434\u043E production."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)',
      maxWidth: 360
    }
  }, "\u0422\u043E\u0442 \u0436\u0435 \u043E\u0431\u044A\u0451\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u2014 \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435.")), /*#__PURE__*/React.createElement(Trace, {
    vertical: true,
    active: 4,
    steps: steps.map(([t, h, d], i) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)',
        gap: 'var(--grid-gutter)',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-h4)',
        letterSpacing: 'var(--track-h4)'
      }
    }, t), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text)'
      }
    }, h), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-sm)',
        color: 'var(--text-2)'
      }
    }, d))))
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)',
      paddingTop: 96,
      borderTop: '1px solid var(--line)',
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-h3)',
      letterSpacing: 'var(--track-h3)'
    }
  }, "\u041D\u0435 \u043F\u0440\u043E\u0434\u0430\u0451\u043C \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u043E-\u0447\u0430\u0441\u044B \u043A\u043E\u0434\u0430"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text)'
    }
  }, "\u0426\u0435\u043D\u0430 \u043D\u0430\u0448\u0435\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u2014 \u044D\u0442\u043E \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u043C \u0438 \u0438\u043D\u0436\u0435\u043D\u0435\u0440\u043D\u0430\u044F \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C. \u041C\u044B \u043F\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u0435\u043C \u0437\u0430\u0434\u0430\u0447\u0443 \u0432 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0438\u0439 \u043F\u0440\u043E\u0434\u0443\u043A\u0442: \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0435\u043C \u0440\u0435\u0448\u0435\u043D\u0438\u0435, \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C AI, \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u043A\u043E\u0434, \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u043C \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438, \u0442\u0435\u0441\u0442\u0438\u0440\u0443\u0435\u043C, \u0434\u0435\u043F\u043B\u043E\u0438\u043C \u0438 \u0434\u043E\u0432\u043E\u0434\u0438\u043C \u0434\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      color: 'var(--text-2)'
    }
  }, "AI \u0441\u043E\u043A\u0440\u0430\u0449\u0430\u0435\u0442 \u043E\u0431\u044A\u0451\u043C \u0440\u0443\u0447\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B. \u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0437\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0443 \u043D\u0430\u0441.")))));
}
function Agencies({
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    id: "agencies",
    pad: 160
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      padding: 'clamp(28px,4vw,56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,6fr) minmax(0,6fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)'
    }
  }, "06"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h2)',
      letterSpacing: 'var(--track-h2)'
    }
  }, "Production-\u043F\u0430\u0440\u0442\u043D\u0451\u0440 \u0434\u043B\u044F \u0430\u0433\u0435\u043D\u0442\u0441\u0442\u0432")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)'
    }
  }, "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u043C\u0441\u044F \u043A \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438 \u043D\u0430 \u044D\u0442\u0430\u043F\u0435 \u0438\u0434\u0435\u0438, \u0434\u0438\u0437\u0430\u0439\u043D\u0430 \u0438\u043B\u0438 \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u043C\u0430\u043A\u0435\u0442\u0430. \u0411\u0435\u0440\u0451\u043C \u043D\u0430 \u0441\u0435\u0431\u044F frontend, backend, WebGL, \u0438\u0433\u0440\u043E\u0432\u044B\u0435 \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0438, \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438, QA \u0438 \u0437\u0430\u043F\u0443\u0441\u043A."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, "\u041F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432, \u0433\u0434\u0435 \u0434\u0435\u0434\u043B\u0430\u0439\u043D \u0443\u0436\u0435 \u0435\u0441\u0442\u044C, \u0430 production-\u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0435\u0449\u0451 \u043D\u0435\u0442."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('home', 'intake')
  }, "\u041F\u0435\u0440\u0435\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442 \u0432 production"))))));
}
function FAQ() {
  const qa = [['Это обычный сайт, сгенерированный нейросетью?', 'Нет. AI участвует в production так же, как IDE, библиотеки и облачная инфраструктура. Архитектуру, сценарии, дизайн, интеграции, проверку и запуск контролирует команда. В production не попадает код только потому, что его сгенерировала модель.'], ['Почему тогда дешевле?', 'Потому что AI сокращает количество ручной работы. Задачи, которые раньше занимали у разработчика часы или дни, coding agent может выполнить значительно быстрее. Мы не закладываем эти человеко-часы в смету только потому, что так исторически устроен рынок.'], ['Кто отвечает, если AI ошибётся?', 'Мы. Клиент работает со студией, а не с моделью. Проверка кода, тестирование, интеграции и запуск находятся на нашей стороне.'], ['Код останется у нас?', 'Да. После запуска проект, исходный код и необходимая документация передаются клиенту согласно договору.'], ['Можно передать вам дизайн от другого агентства?', 'Да. Можем подключиться только как production-партнёр: взять готовый дизайн и собрать frontend, backend, интерактив или 3D.']];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement(Section, {
    id: "faq",
    pad: 160
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)'
    }
  }, "07"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h2)',
      letterSpacing: 'var(--track-h2)'
    }
  }, "\u0412\u043E\u043F\u0440\u043E\u0441\u044B")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--text)'
    }
  }, qa.map(([q, a], i) => {
    const on = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: q,
      style: {
        borderBottom: '1px solid var(--line)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-expanded": on,
      onClick: () => setOpen(on ? -1 : i),
      style: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 24px',
        gap: 24,
        alignItems: 'center',
        padding: '24px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'var(--type-h4)',
        letterSpacing: 'var(--track-h4)',
        color: on ? 'var(--brand)' : 'var(--text)',
        fontFamily: 'var(--font-sans)',
        transition: 'color var(--dur-micro)'
      }
    }, q, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      style: {
        transform: on ? 'rotate(45deg)' : 'none',
        transition: 'transform var(--dur-ui) var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 5v14M5 12h14"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateRows: on ? '1fr' : '0fr',
        transition: 'grid-template-rows var(--dur-ui) var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: '0 48px 28px 0',
        font: 'var(--type-body)',
        color: 'var(--text-2)',
        maxWidth: 680
      }
    }, a))));
  }))));
}
Object.assign(window, {
  Demos,
  Cases,
  WhatWeDo,
  Economics,
  Process,
  Agencies,
  FAQ,
  Media
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Intake.jsx
try { (() => {
const {
  Button,
  BriefMessage,
  BriefComposer,
  EstimatePanel,
  OptionBlock,
  TextInput,
  Field
} = window.VCStudioDesignSystem_40ecfd;
const SCRIPT = [{
  q: 'Что нужно сделать?',
  opts: ['Промо-сайт', 'Веб-игра', '3D / WebGL', 'Интерактивный спецпроект', 'Другое'],
  scope: a => a === 'Другое' ? ['Спецпроект'] : [a]
}, {
  q: 'Что проект должен сделать для бизнеса?',
  opts: ['Поддержать рекламную кампанию', 'Вовлечь аудиторию', 'Собрать лиды', 'Запустить продукт', 'Пока формулируем'],
  scope: a => a === 'Собрать лиды' ? ['Форма и CRM'] : a === 'Вовлечь аудиторию' ? ['Игровая механика', 'Лидерборд'] : ['Аналитика']
}, {
  q: 'Когда проект должен быть в проде?',
  opts: ['До 7 дней', '1–2 недели', '3–4 недели', 'Срок гибкий'],
  term: a => ({
    'До 7 дней': '5–7 рабочих дней',
    '1–2 недели': '8–12 рабочих дней',
    '3–4 недели': '15–20 рабочих дней',
    'Срок гибкий': '10–15 рабочих дней'
  })[a] || '8–12 рабочих дней',
  scope: () => ['Адаптив', 'Деплой']
}, {
  q: 'Есть ориентир по бюджету?',
  opts: ['100–200 тыс.', '200–350 тыс.', '350–500 тыс.', 'Нужна оценка'],
  budget: a => ({
    '100–200 тыс.': '120 000–190 000 ₽',
    '200–350 тыс.': '210 000–330 000 ₽',
    '350–500 тыс.': '360 000–480 000 ₽'
  })[a] || '160 000–210 000 ₽'
}];
function Intake() {
  const [log, setLog] = React.useState([{
    r: 'ai',
    t: 'Расскажите, что хотите запустить. Можно без ТЗ. Я уточню несколько вещей и соберу предварительный scope, срок и вилку бюджета.',
    intro: true
  }, {
    r: 'ai',
    t: SCRIPT[0].q,
    i: 1
  }]);
  const [step, setStep] = React.useState(0);
  const [pending, setPending] = React.useState(false);
  const [est, setEst] = React.useState({
    scope: [],
    term: undefined,
    budget: undefined,
    status: 'empty'
  });
  const [contact, setContact] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState('');
  const done = step >= SCRIPT.length;
  const answer = a => {
    if (pending || done) return;
    const s = SCRIPT[step];
    setLog(l => [...l, {
      r: 'user',
      t: a
    }]);
    setPending(true);
    setEst(e => ({
      ...e,
      status: 'thinking'
    }));
    setTimeout(() => {
      setEst(e => ({
        scope: [...new Set([...e.scope, ...(s.scope ? s.scope(a) : [])])],
        term: s.term ? s.term(a) : e.term,
        budget: s.budget ? s.budget(a) : e.budget,
        status: step + 1 >= SCRIPT.length ? 'ready' : 'building'
      }));
      const n = step + 1;
      setStep(n);
      setPending(false);
      setLog(l => [...l, n < SCRIPT.length ? {
        r: 'ai',
        t: SCRIPT[n].q,
        i: n + 1
      } : {
        r: 'ai',
        t: 'Куда отправить расчёт и продолжить обсуждение?',
        i: n + 1
      }]);
    }, 800);
  };
  const send = () => {
    const ok = /^@?[\w]{4,}$/.test(contact) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
    if (!ok) {
      setErr(contact.startsWith('@') ? 'Нужен username в формате @username' : 'Проверьте адрес почты');
      return;
    }
    setErr('');
    setSent(true);
  };
  return /*#__PURE__*/React.createElement(Section, {
    id: "intake",
    pad: 160,
    border: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement(Head, {
    index: "08",
    title: "\u0415\u0441\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0430 \u2014 \u043F\u043E\u0441\u0447\u0438\u0442\u0430\u0435\u043C production",
    lead: "\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0435\u043A\u0442 \u0441\u0432\u043E\u0438\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438. \u0411\u0435\u0437 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0431\u0440\u0438\u0444\u0430. \u0417\u0430 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432 \u0441\u043E\u0431\u0435\u0440\u0451\u043C \u043F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 scope, \u0441\u0440\u043E\u043A \u0438 \u0431\u044E\u0434\u0436\u0435\u0442."
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      borderTop: '1px solid var(--text)',
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "Project brief"), log.map((m, k) => /*#__PURE__*/React.createElement(BriefMessage, {
    key: k,
    role: m.r,
    index: m.i,
    style: m.intro ? {
      paddingBottom: 8
    } : undefined
  }, m.t)), pending && /*#__PURE__*/React.createElement(BriefMessage, {
    pending: true
  }), !pending && !done && /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      paddingLeft: 56
    }
  }, SCRIPT[step].opts.map(o => /*#__PURE__*/React.createElement(OptionBlock, {
    key: o,
    onClick: () => answer(o)
  }, o))), !done ? /*#__PURE__*/React.createElement(BriefComposer, {
    placeholder: "\u0418\u043B\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u0432\u043E\u0438\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438",
    onSend: answer,
    disabled: pending,
    style: {
      marginLeft: 56
    }
  }) : !sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      paddingLeft: 56
    }
  }, /*#__PURE__*/React.createElement(Field, {
    error: err
  }, /*#__PURE__*/React.createElement(TextInput, {
    placeholder: "Email \u0438\u043B\u0438 Telegram",
    value: contact,
    onChange: e => setContact(e.target.value),
    error: !!err,
    onKeyDown: e => e.key === 'Enter' && send()
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    onClick: send
  }, "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0442\u043E\u0447\u043D\u0443\u044E \u043E\u0446\u0435\u043D\u043A\u0443"))) : /*#__PURE__*/React.createElement(BriefMessage, {
    index: 6
  }, "\u0420\u0430\u0441\u0447\u0451\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0430 ", contact, ". \u0418\u043D\u0436\u0435\u043D\u0435\u0440 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442 scope \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u0435\u0440\u0435\u0434 \u0441\u0442\u0430\u0440\u0442\u043E\u043C.")), /*#__PURE__*/React.createElement(EstimatePanel, {
    scope: est.scope,
    term: est.term,
    budget: est.budget,
    status: est.status,
    onConfirm: () => document.querySelector('#intake input')?.focus(),
    style: {
      position: 'sticky',
      top: 104
    }
  }))));
}
Object.assign(window, {
  Intake
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Intake.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Pages.jsx
try { (() => {
const {
  Button,
  Counter,
  Stat,
  Ledger,
  Compare,
  DemoBlock,
  Trace,
  Tag
} = window.VCStudioDesignSystem_40ecfd;
function CasePage({
  go
}) {
  const Para = ({
    h,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)',
      padding: '40px 0',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)'
    }
  }, h), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)',
      maxWidth: 720,
      textWrap: 'pretty'
    }
  }, children));
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 64,
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    size: "sm",
    onClick: () => go('home', 'cases'),
    style: {
      alignSelf: 'flex-start'
    }
  }, "\u0412\u0441\u0435 \u043A\u0435\u0439\u0441\u044B"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "ink"
  }, "\u0412\u0435\u0431-\u0438\u0433\u0440\u0430"), /*#__PURE__*/React.createElement(Tag, null, "2026"), /*#__PURE__*/React.createElement(Tag, null, "\u0421\u0435\u0442\u044C \u043A\u043E\u0444\u0435\u0435\u043D")), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,8fr) minmax(0,4fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-h1)',
      letterSpacing: 'var(--track-h1)',
      textWrap: 'balance'
    }
  }, "\u041F\u0440\u043E\u043C\u043E-\u0438\u0433\u0440\u0430 \u0434\u043B\u044F \u0441\u0435\u0442\u0438 \u043A\u043E\u0444\u0435\u0435\u043D"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)'
    }
  }, "30-\u0441\u0435\u043A\u0443\u043D\u0434\u043D\u0430\u044F \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043D\u0430\u044F \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0430 \u0441 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u043E\u043C \u0438 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u0430\u043C\u0438. \u041E\u0442 \u043F\u0435\u0440\u0432\u043E\u0433\u043E scope \u0434\u043E production \u2014 9 \u0434\u043D\u0435\u0439.")), /*#__PURE__*/React.createElement("div", {
    className: "grid3",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--grid-gutter)',
      paddingTop: 24,
      borderTop: '1px solid var(--text)'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: 184000,
    suffix: " \u20BD",
    label: "\u0431\u044E\u0434\u0436\u0435\u0442 \u043F\u0440\u043E\u0435\u043A\u0442\u0430",
    note: "\u0432\u043A\u043B\u044E\u0447\u0430\u044F AI-\u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 18 320 \u20BD",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: 9,
    suffix: " \u0434\u043D\u0435\u0439",
    label: "\u0434\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: 41200,
    label: "\u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0437\u0430 \u043F\u0435\u0440\u0432\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E",
    size: "lg"
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 64
    }
  }, /*#__PURE__*/React.createElement(DemoBlock, {
    dark: true,
    title: "\u0418\u0433\u0440\u0430\u0442\u044C \u043F\u0440\u044F\u043C\u043E \u0437\u0434\u0435\u0441\u044C",
    meta: "Live \xB7 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434",
    ratio: "21/9",
    cta: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0438\u0433\u0440\u0443"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--contrast-ink-2)',
      font: 'var(--type-body-sm)'
    }
  }, "\u0437\u0434\u0435\u0441\u044C \u043C\u043E\u043D\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0438\u0433\u0440\u0430"))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement(Para, {
    h: "\u0417\u0430\u0434\u0430\u0447\u0430"
  }, "\u041C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u043E\u0432\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u0435 \u043D\u0443\u0436\u043D\u0430 \u0431\u044B\u043B\u0430 \u0438\u0433\u0440\u043E\u0432\u0430\u044F \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0430 \u0434\u043B\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u043D\u043E\u0439 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0438: \u043A\u043E\u0440\u043E\u0442\u043A\u0430\u044F \u0441\u0435\u0441\u0441\u0438\u044F, \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u0438 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u044F. \u0414\u0435\u0434\u043B\u0430\u0439\u043D \u0431\u044B\u043B \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A \u0441\u0442\u0430\u0440\u0442\u0443 \u043C\u0435\u0434\u0438\u0439\u043D\u043E\u0433\u043E \u0440\u0430\u0437\u043C\u0435\u0449\u0435\u043D\u0438\u044F."), /*#__PURE__*/React.createElement(Para, {
    h: "\u0420\u0435\u0448\u0435\u043D\u0438\u0435"
  }, "\u0421\u043E\u0431\u0440\u0430\u043B\u0438 \u0438\u0433\u0440\u043E\u0432\u0443\u044E \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0443, \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441, \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u0443\u044E \u0447\u0430\u0441\u0442\u044C \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 \u0438 \u0432\u044B\u0434\u0430\u0447\u0443 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u043E\u0432. \u041E\u0441\u043D\u043E\u0432\u043D\u0443\u044E \u0447\u0430\u0441\u0442\u044C frontend-\u043A\u043E\u0434\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u043B\u0438 \u0441 AI coding agents, \u043F\u043E\u0441\u043B\u0435 \u0447\u0435\u0433\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u043B\u0430 review, \u0442\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0438 \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044E."), /*#__PURE__*/React.createElement(Para, {
    h: "\u0421\u0440\u043E\u043A"
  }, "\u041F\u0435\u0440\u0432\u0430\u044F \u0440\u0430\u0431\u043E\u0447\u0430\u044F \u0441\u0431\u043E\u0440\u043A\u0430 \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C \u043D\u0430 \u0442\u0440\u0435\u0442\u0438\u0439 \u0434\u0435\u043D\u044C. \u0412 production \u043F\u0440\u043E\u0435\u043A\u0442 \u0432\u044B\u0448\u0435\u043B \u0447\u0435\u0440\u0435\u0437 \u0434\u0435\u0432\u044F\u0442\u044C \u0434\u043D\u0435\u0439 \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u0430\u0440\u0442\u0430."), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)',
      padding: '40px 0',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)'
    }
  }, "Timeline"), /*#__PURE__*/React.createElement(Trace, {
    active: 4,
    steps: ['Задача', 'Scope · день 1', 'Сборка · день 3', 'QA · день 8', 'Production · день 9']
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,8fr)',
      gap: 'var(--grid-gutter)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--type-h3)',
      letterSpacing: 'var(--track-h3)'
    }
  }, "\u0421\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043C\u044B\u0439 \u043E\u0431\u044A\u0451\u043C \u0440\u0430\u0431\u043E\u0442"), /*#__PURE__*/React.createElement(Compare, {
    ours: 184000,
    theirs: [450000, 650000],
    note: "\u041E\u0440\u0438\u0435\u043D\u0442\u0438\u0440 \u0434\u043B\u044F \u0441\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043C\u043E\u0433\u043E \u043E\u0431\u044A\u0451\u043C\u0430 \u0440\u0430\u0431\u043E\u0442. \u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u044B."
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 96,
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('report')
  }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0442\u0447\u0451\u0442 \u043F\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0443"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => go('home', 'intake')
  }, "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u043E\u0445\u043E\u0436\u0438\u0439 \u043F\u0440\u043E\u0435\u043A\u0442")));
}
function ReportPage({
  go
}) {
  const stages = [['Прототип механики', 3210, 24000], ['Графика и анимация', 5480, 52000], ['Лидерборд и промокоды', 4690, 48000], ['QA, правки, запуск', 4940, 42000]];
  const ai = stages.reduce((a, r) => a + r[1], 0),
    team = stages.reduce((a, r) => a + r[2], 0);
  const [detail, setDetail] = React.useState(false);
  const cell = {
    padding: '16px 0',
    borderBottom: '1px solid var(--line)',
    font: 'var(--type-body)',
    textAlign: 'left'
  };
  const num = {
    ...cell,
    textAlign: 'right',
    fontFeatureSettings: 'var(--num-features)',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap'
  };
  const th = {
    ...cell,
    padding: '0 0 12px',
    font: 'var(--type-caption)',
    color: 'var(--text-3)',
    borderBottom: '1px solid var(--text)'
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 64,
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    size: "sm",
    onClick: () => go('case'),
    style: {
      alignSelf: 'flex-start'
    }
  }, "\u041A \u043A\u0435\u0439\u0441\u0443"), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      font: 'var(--type-index)',
      color: 'var(--text-3)',
      letterSpacing: '.04em'
    }
  }, "FINAL REPORT \xB7 COFFEE RUN \xB7 14.09.2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--type-h1)',
      letterSpacing: 'var(--track-h1)'
    }
  }, "\u0418\u0437 \u0447\u0435\u0433\u043E \u0441\u043B\u043E\u0436\u0438\u043B\u0430\u0441\u044C \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body-lg)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, "\u0414\u043E \u0441\u0442\u0430\u0440\u0442\u0430 \u043A\u043B\u0438\u0435\u043D\u0442\u0443 \u043D\u0435 \u043D\u0443\u0436\u043D\u043E \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C\u0441\u044F \u0432 \u043C\u043E\u0434\u0435\u043B\u044F\u0445, \u0442\u043E\u043A\u0435\u043D\u0430\u0445 \u0438 AI-\u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0430\u0445. \u041F\u043E\u0441\u043B\u0435 \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u043C\u044B \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C production \u0438\u0437\u043D\u0443\u0442\u0440\u0438: \u0447\u0442\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043B\u0438, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u044D\u0442\u043E \u0441\u0442\u043E\u0438\u043B\u043E \u0438 \u0437\u0430 \u043A\u0430\u043A\u0443\u044E \u0440\u0430\u0431\u043E\u0442\u0443 \u043E\u0442\u0432\u0435\u0447\u0430\u043B\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430."))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'start',
      paddingTop: 32,
      borderTop: '1px solid var(--text)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Counter, {
    value: ai + team,
    from: 0,
    size: "xl",
    suffix: " \u20BD"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-2)'
    }
  }, "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442")), /*#__PURE__*/React.createElement("div", {
    className: "grid3",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 'var(--grid-gutter)'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: 8421388,
    label: "\u0442\u043E\u043A\u0435\u043D\u043E\u0432",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: 143,
    label: "\u0441\u0431\u043E\u0440\u043E\u043A",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: 9,
    suffix: " \u0434.",
    label: "production",
    size: "sm"
  }))), /*#__PURE__*/React.createElement(Ledger, {
    rows: [{
      label: 'AI-инфраструктура',
      sub: 'Claude · GPT · агентские сессии — по фактическому расходу',
      value: ai
    }, {
      label: 'Production-команда',
      sub: 'архитектура, управление AI, review, QA, интеграции, деплой — зафиксировано до старта',
      value: team
    }, {
      label: 'Поддержка 3 месяца',
      sub: 'до 14.12.2026',
      value: 'включено',
      tone: 'positive'
    }],
    total: ai + team,
    totalLabel: "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442"
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 24,
      flexWrap: 'wrap',
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-h3)',
      letterSpacing: 'var(--track-h3)'
    }
  }, "\u041F\u043E \u044D\u0442\u0430\u043F\u0430\u043C"), /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    size: "sm",
    onClick: () => setDetail(!detail)
  }, detail ? 'Скрыть детализацию по моделям' : 'Показать детализацию по моделям')), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "\u042D\u0442\u0430\u043F"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "AI-\u0440\u0430\u0441\u0445\u043E\u0434"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "\u0420\u0430\u0431\u043E\u0442\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u044B"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "\u0418\u0442\u043E\u0433\u043E"))), /*#__PURE__*/React.createElement("tbody", null, stages.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", {
    style: cell
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      color: 'var(--text-2)'
    }
  }, r[1].toLocaleString('ru-RU'), " \u20BD"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      color: 'var(--text-2)'
    }
  }, r[2].toLocaleString('ru-RU'), " \u20BD"), /*#__PURE__*/React.createElement("td", {
    style: num
  }, (r[1] + r[2]).toLocaleString('ru-RU'), " \u20BD"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      borderBottom: 'none',
      font: 'var(--type-label)'
    }
  }, "\u0418\u0442\u043E\u0433\u043E"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      borderBottom: 'none'
    }
  }, ai.toLocaleString('ru-RU'), " \u20BD"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      borderBottom: 'none'
    }
  }, team.toLocaleString('ru-RU'), " \u20BD"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      borderBottom: 'none',
      font: 'var(--type-label)'
    }
  }, (ai + team).toLocaleString('ru-RU'), " \u20BD")))), detail && /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "\u041C\u043E\u0434\u0435\u043B\u044C"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Input tokens"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Output tokens"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Cached"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C"))), /*#__PURE__*/React.createElement("tbody", null, [['Claude Sonnet', 5120400, 812300, 1904200, 11840], ['GPT', 402100, 96400, 0, 3980], ['Gemini', 78900, 6088, 0, 2500]].map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", {
    style: cell
  }, r[0]), r.slice(1).map((v, i) => /*#__PURE__*/React.createElement("td", {
    key: i,
    style: {
      ...num,
      color: i === 3 ? 'var(--text)' : 'var(--text-2)'
    }
  }, v.toLocaleString('ru-RU'), i === 3 ? ' ₽' : '')))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      font: 'var(--type-caption)',
      color: 'var(--text-3)'
    }
  }, "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435. \u0421\u0442\u0430\u0432\u043A\u0438 \u043C\u043E\u0434\u0435\u043B\u0435\u0439 \u0440\u0430\u0437\u043B\u0438\u0447\u0430\u044E\u0442\u0441\u044F; \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430 \u043F\u043E \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0442\u0430\u0440\u0438\u0444\u0430\u043C \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043E\u0432 \u0431\u0435\u0437 \u043D\u0430\u0446\u0435\u043D\u043A\u0438.")), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
      gap: 'var(--grid-gutter)',
      alignItems: 'center',
      padding: '32px 0',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h4)',
      letterSpacing: 'var(--track-h4)'
    }
  }, "3 \u043C\u0435\u0441\u044F\u0446\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-2)'
    }
  }, "\u0414\u043E 14.12.2026 \u2014 ", /*#__PURE__*/React.createElement("span", {
    "data-num": true,
    style: {
      color: 'var(--positive)'
    }
  }, "0 \u20BD"), ". \u041F\u043E\u0441\u043B\u0435 \u2014 \u043E\u0442 5 000 \u20BD / \u043C\u0435\u0441.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('home', 'intake'),
    variant: "secondary"
  }, "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u043E\u0445\u043E\u0436\u0438\u0439 \u043F\u0440\u043E\u0435\u043A\u0442"), /*#__PURE__*/React.createElement(Button, null, "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0442\u0447\u0451\u0442")))));
}
Object.assign(window, {
  CasePage,
  ReportPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Pages.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CaseCard = __ds_scope.CaseCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Trace = __ds_scope.Trace;

__ds_ns.DemoBlock = __ds_scope.DemoBlock;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.OptionBlock = __ds_scope.OptionBlock;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.BriefComposer = __ds_scope.BriefComposer;

__ds_ns.BriefMessage = __ds_scope.BriefMessage;

__ds_ns.EstimatePanel = __ds_scope.EstimatePanel;

__ds_ns.Compare = __ds_scope.Compare;

__ds_ns.Counter = __ds_scope.Counter;

__ds_ns.Ledger = __ds_scope.Ledger;

__ds_ns.Stat = __ds_scope.Stat;

})();
