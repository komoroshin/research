/* @ds-bundle: {"format":4,"namespace":"ThresholdDesignSystem_2ce5e4","components":[{"name":"ActionLink","sourcePath":"components/core/ActionLink.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"PhotoTile","sourcePath":"components/core/PhotoTile.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/core/Toast.jsx"},{"name":"Notice","sourcePath":"components/feedback/Notice.jsx"},{"name":"ScaleSlider","sourcePath":"components/forms/ScaleSlider.jsx"},{"name":"ScaleStepper","sourcePath":"components/forms/ScaleStepper.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"StoolPicker","sourcePath":"components/forms/StoolPicker.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"DayDots","sourcePath":"components/progress/DayDots.jsx"},{"name":"PathNode","sourcePath":"components/progress/PathNode.jsx"},{"name":"TabBar","sourcePath":"components/progress/TabBar.jsx"},{"name":"BodyText","sourcePath":"components/typography/BodyText.jsx"},{"name":"Display","sourcePath":"components/typography/Display.jsx"},{"name":"Eyebrow","sourcePath":"components/typography/Eyebrow.jsx"},{"name":"Numeral","sourcePath":"components/typography/Numeral.jsx"},{"name":"Rule","sourcePath":"components/typography/Rule.jsx"}],"sourceHashes":{"components/core/ActionLink.jsx":"0e72d4775c1c","components/core/Button.jsx":"fbd2ccf73947","components/core/Card.jsx":"d08bcafb8092","components/core/Chip.jsx":"6b2e755ccf6f","components/core/PhotoTile.jsx":"129e98c86064","components/core/ProgressBar.jsx":"246a1ab71b68","components/core/Toast.jsx":"e14798aa74b2","components/feedback/Notice.jsx":"d512e240b290","components/forms/ScaleSlider.jsx":"c7b605d50781","components/forms/ScaleStepper.jsx":"ba36d5d57a60","components/forms/SegmentedControl.jsx":"3e13f69f4c7d","components/forms/StoolPicker.jsx":"d74bdac0bd60","components/forms/Switch.jsx":"d0d4398546f4","components/progress/DayDots.jsx":"11bdd9784f3c","components/progress/PathNode.jsx":"5de643de65ba","components/progress/TabBar.jsx":"dfecb8958fc1","components/typography/BodyText.jsx":"6ccad70eb917","components/typography/Display.jsx":"e1bda9c16ec1","components/typography/Eyebrow.jsx":"f8cc3f5ec795","components/typography/Numeral.jsx":"6c7ec66cb3da","components/typography/Rule.jsx":"d86d2d418496","ui_kits/app/AppShell.jsx":"dcd630a23366","ui_kits/app/DayCardScreen.jsx":"0ab1df09e854","ui_kits/app/DecisionScreens.jsx":"4eb6c19c719c","ui_kits/app/DoctorPage.jsx":"1d46024bae98","ui_kits/app/MealStrip.jsx":"abe8b418e640","ui_kits/app/MealVariants.jsx":"b72a687aa8e7","ui_kits/app/OnboardingScreen.jsx":"dd5b7c7cc7e2","ui_kits/app/PathScreen.jsx":"d842f0172505","ui_kits/app/RestaurantCard.jsx":"9f16df24c98d","ui_kits/app/TodayScreen.jsx":"b785a06555e8","ui_kits/app/doc-page.js":"f52ae9c02fca"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ThresholdDesignSystem_2ce5e4 = window.ThresholdDesignSystem_2ce5e4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/ActionLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ActionLink({
  children,
  dark = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--action-size)',
      fontWeight: 'var(--action-weight)',
      letterSpacing: 'var(--action-tracking)',
      textTransform: 'uppercase',
      color: dark ? 'var(--text-action-on-dark)' : 'var(--text-action)',
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 'var(--hit-min)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontSize: 18,
      lineHeight: 1
    }
  }, "\u203A"));
}
Object.assign(__ds_scope, { ActionLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ActionLink.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = {
  primary: {
    background: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-fg)',
    hover: 'var(--btn-primary-bg-hover)'
  },
  accent: {
    background: 'var(--btn-accent-bg)',
    color: 'var(--btn-accent-fg)',
    hover: 'var(--btn-accent-bg-hover)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--btn-ghost-fg)',
    boxShadow: 'var(--ring-strong)',
    hover: 'transparent'
  },
  cream: {
    background: 'var(--btn-cream-bg)',
    color: 'var(--btn-cream-fg)',
    hover: 'var(--btn-cream-bg)'
  }
};
function Button({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      border: 0,
      borderRadius: 'var(--radius-button)',
      padding: 'var(--btn-pad-y) var(--btn-pad-x)',
      minHeight: 'var(--btn-min-height)',
      width: '100%',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--btn-size)',
      fontWeight: 'var(--btn-weight)',
      letterSpacing: 'var(--btn-tracking)',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'var(--transition-color)',
      opacity: disabled ? 0.5 : 1,
      background: hover && !disabled ? v.hover : v.background,
      color: v.color,
      boxShadow: v.boxShadow,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = {
  default: {
    background: 'var(--surface-card)'
  },
  quiet: {
    background: 'var(--surface-card-quiet)'
  },
  accent: {
    background: 'var(--surface-card-accent)',
    boxShadow: 'var(--shadow-card)'
  },
  dark: {
    background: 'var(--surface-card-dark)',
    boxShadow: 'var(--shadow-card)'
  },
  lift: {
    background: 'var(--surface-card-lift)'
  },
  line: {
    background: 'transparent',
    boxShadow: 'var(--ring-hairline)'
  }
};
function Card({
  children,
  variant = 'default',
  tight = false,
  onClick,
  style,
  ...rest
}) {
  const v = variants[variant] || variants.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      borderRadius: 'var(--radius-card)',
      padding: tight ? 'var(--card-pad-y-tight) var(--card-pad-x-tight)' : 'var(--card-pad-y) var(--card-pad-x)',
      boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : undefined,
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  children,
  tone = 'cream',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--chip-size)',
      fontWeight: 'var(--chip-weight)',
      letterSpacing: 'var(--chip-tracking)',
      textTransform: 'uppercase',
      color: 'var(--text-action)',
      background: tone === 'sage' ? 'var(--surface-card)' : 'var(--surface-screen)',
      borderRadius: 'var(--radius-chip)',
      padding: '6px 10px',
      display: 'inline-block',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/PhotoTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PhotoTile({
  label,
  sub,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card-dark)',
      color: 'var(--text-display-on-dark)',
      padding: '16px 18px',
      minHeight: 118,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      boxShadow: 'var(--shadow-card)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -26,
      top: -36,
      width: 104,
      height: 104,
      borderRadius: '50%',
      background: 'var(--surface-card-lift)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 16,
      top: 14,
      width: 30,
      height: 30,
      borderRadius: '50%',
      boxShadow: 'inset 0 0 0 3px var(--sage-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--display-card)',
      lineHeight: 'var(--display-line)',
      letterSpacing: 'var(--display-tracking)',
      textTransform: 'uppercase',
      position: 'relative',
      paddingRight: 30
    }
  }, label), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-xs)',
      color: 'var(--text-muted)',
      marginTop: 4,
      position: 'relative'
    }
  }, sub) : null);
}
Object.assign(__ds_scope, { PhotoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PhotoTile.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  dark = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: 8,
      borderRadius: 'var(--radius-bar)',
      background: dark ? 'var(--surface-card-lift)' : 'var(--track-empty)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: Math.max(0, Math.min(100, value)) + '%',
      borderRadius: 'var(--radius-bar)',
      background: dark ? 'var(--sage-300)' : 'var(--track-fill)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toast({
  children,
  show = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card-dark)',
      color: 'var(--text-display-on-dark)',
      borderRadius: 'var(--radius-button)',
      padding: '14px 18px',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-md)',
      lineHeight: 1.4,
      boxShadow: 'var(--shadow-card)',
      opacity: show ? 1 : 0,
      transition: 'var(--transition-fade)',
      pointerEvents: 'none',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Notice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* "We couldn't" states: Health denied, recognition failed, offline. Text carries the message;
   the only colour is the alert token on the rule and the label. No icons, no red fills. */
function Notice({
  label,
  children,
  action,
  tone = 'quiet',
  style,
  ...rest
}) {
  const alert = tone === 'alert';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius-card)',
      padding: 'var(--card-pad-y-tight) var(--card-pad-x-tight)',
      background: alert ? 'var(--surface-notice)' : 'var(--surface-card-quiet)',
      boxShadow: alert ? undefined : 'var(--ring-hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), label ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: alert ? 'var(--text-alert)' : 'var(--text-eyebrow)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-sm)',
      lineHeight: 'var(--body-line)',
      color: 'var(--text-body)'
    }
  }, children), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, action) : null);
}
Object.assign(__ds_scope, { Notice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Notice.jsx", error: String((e && e.message) || e) }); }

// components/forms/ScaleSlider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The v1 artboard control: a track with a forest knob, the value in Oswald, word anchors
   at both ends and no numbers along the track. Half the height of ScaleStepper. */
function ScaleSlider({
  label,
  sub,
  value = 0,
  max = 10,
  labels = [],
  onChange,
  style,
  ...rest
}) {
  const pct = value / max * 100;
  const ref = React.useRef(null);
  const setFromEvent = clientX => {
    if (!ref.current || !onChange) return;
    const r = ref.current.getBoundingClientRect();
    const v = Math.round((clientX - r.left) / r.width * max);
    onChange(Math.max(0, Math.min(max, v)));
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius-card)',
      padding: '16px 18px 14px',
      background: 'var(--surface-card-quiet)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)'
    }
  }, label), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-xs)',
      color: 'var(--text-body-soft)',
      marginTop: 2
    }
  }, sub) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-numeral)',
      fontWeight: 700,
      fontSize: 'var(--numeral-lg)',
      lineHeight: 'var(--numeral-line)',
      letterSpacing: 'var(--numeral-tracking)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-action)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-action)'
    }
  }, labels[value]))), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    role: "slider",
    "aria-valuenow": value,
    "aria-valuemin": 0,
    "aria-valuemax": max,
    tabIndex: 0,
    onClick: e => setFromEvent(e.clientX),
    onKeyDown: e => {
      if (!onChange) return;
      if (e.key === 'ArrowRight') onChange(Math.min(max, value + 1));
      if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 1));
    },
    style: {
      position: 'relative',
      height: 'var(--hit-min)',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 8,
      width: '100%',
      borderRadius: 'var(--radius-bar)',
      background: 'var(--track-empty)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: 8,
      width: pct + '%',
      borderRadius: 'var(--radius-bar)',
      background: 'var(--track-fill)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -10,
      left: 'calc(' + pct + '% - 14px)',
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-knob)',
      background: 'var(--control-on)',
      boxShadow: 'var(--shadow-knob)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow-soft)'
    }
  }, labels[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow-soft)'
    }
  }, labels[max])));
}
Object.assign(__ds_scope, { ScaleSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ScaleSlider.jsx", error: String((e && e.message) || e) }); }

// components/forms/ScaleStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ScaleStepper({
  label,
  sub,
  value = 0,
  labels = [],
  onChange,
  style,
  ...rest
}) {
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius-card)',
      padding: '16px 18px 12px',
      background: 'var(--surface-card-quiet)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)'
    }
  }, label), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-xs)',
      color: 'var(--text-body-soft)',
      marginTop: 2
    }
  }, sub) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      justifyContent: 'flex-end',
      minWidth: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-numeral)',
      fontWeight: 700,
      fontSize: 'var(--numeral-lg)',
      lineHeight: 'var(--numeral-line)',
      letterSpacing: 'var(--numeral-tracking)',
      color: 'var(--text-display)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-action)'
    }
  }, labels[value]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0,1fr))',
      gap: 6,
      marginTop: 6
    }
  }, cells.map(i => {
    const on = value === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      role: "button",
      tabIndex: 0,
      onClick: () => onChange && onChange(i),
      style: {
        minHeight: 'var(--hit-min)',
        borderRadius: 'var(--radius-tile)',
        background: on ? 'var(--control-on)' : 'var(--surface-screen)',
        boxShadow: on ? 'none' : 'var(--ring-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-numeral)',
        fontWeight: 700,
        fontSize: 18,
        color: on ? 'var(--btn-primary-fg)' : 'var(--text-display)',
        cursor: 'pointer'
      }
    }, i);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow-soft)'
    }
  }, "0 \xB7 ", labels[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow-soft)'
    }
  }, "10 \xB7 ", labels[10])));
}
Object.assign(__ds_scope, { ScaleStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ScaleStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SegmentedControl({
  options = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + Math.max(1, options.length) + ', minmax(0, 1fr))',
      gap: 4,
      background: 'var(--surface-card-quiet)',
      borderRadius: 'var(--radius-button)',
      padding: 4,
      ...style
    }
  }, rest), options.map((o, i) => {
    const on = value === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      role: "button",
      tabIndex: 0,
      onClick: () => onChange && onChange(i),
      style: {
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--body-sm)',
        fontWeight: on ? 700 : 500,
        color: on ? 'var(--btn-primary-fg)' : 'var(--text-body-soft)',
        background: on ? 'var(--control-on)' : 'transparent',
        textAlign: 'center',
        padding: 6,
        minHeight: 'var(--hit-min)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-segment)',
        cursor: 'pointer'
      }
    }, o);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/StoolPicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Bristol shapes are drawn with the brand's own CSS gradients/masks — copied verbatim from the prototype. */
const shapes = [{
  height: 2,
  width: 24,
  background: 'var(--sage-500)',
  borderRadius: 2,
  margin: '7px 0'
}, {
  background: 'radial-gradient(circle 4px,var(--c) 96%,transparent 100%) 0 0/14px 16px repeat-x'
}, {
  borderRadius: 8,
  background: 'var(--c)',
  WebkitMaskImage: 'radial-gradient(circle 3px at 8px 5px,transparent 95%,#000 100%),radial-gradient(circle 3px at 24px 11px,transparent 95%,#000 100%),radial-gradient(circle 3px at 36px 5px,transparent 95%,#000 100%)',
  WebkitMaskComposite: 'source-in',
  maskImage: 'radial-gradient(circle 3px at 8px 5px,transparent 95%,#000 100%),radial-gradient(circle 3px at 24px 11px,transparent 95%,#000 100%),radial-gradient(circle 3px at 36px 5px,transparent 95%,#000 100%)',
  maskComposite: 'intersect'
}, {
  borderRadius: 8,
  background: 'repeating-linear-gradient(90deg,var(--c) 0 9px,transparent 9px 11px)'
}, {
  borderRadius: 8,
  background: 'var(--c)'
}, {
  background: 'radial-gradient(ellipse 7px 6px,var(--c) 96%,transparent 100%) 0 0/15px 16px repeat-x'
}, {
  borderRadius: '60% 40% 55% 45%/50% 65% 35% 50%',
  background: 'var(--c)',
  opacity: 0.85
}, {
  background: 'linear-gradient(var(--c),var(--c)) 0 3px/44px 3px no-repeat,linear-gradient(var(--c),var(--c)) 6px 10px/30px 3px no-repeat'
}];
function StoolPicker({
  value = 0,
  types = [],
  label = 'Stool',
  sub,
  keyline,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)'
    }
  }, label), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--body-xs)',
      color: 'var(--text-body-soft)',
      marginTop: 2
    }
  }, sub) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: 'var(--text-action)'
    }
  }, value > 0 ? value + ' · ' + types[value] : types[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
      gap: 6
    }
  }, types.map((t, i) => {
    const on = value === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      role: "button",
      tabIndex: 0,
      onClick: () => onChange && onChange(i),
      style: {
        borderRadius: 'var(--radius-stool)',
        background: on ? 'var(--control-on)' : 'var(--surface-screen)',
        boxShadow: on ? 'none' : 'var(--ring-hairline)',
        padding: '10px 6px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        minHeight: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-numeral)',
        fontWeight: 700,
        fontSize: 'var(--numeral-2xs)',
        lineHeight: 1,
        color: on ? 'var(--btn-primary-fg)' : 'var(--text-display)'
      }
    }, i === 0 ? '—' : i), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 16,
        position: 'relative',
        '--c': on ? 'var(--cream-50)' : 'var(--forest)',
        ...shapes[i]
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-text)',
        fontSize: 11,
        lineHeight: 1.2,
        textAlign: 'center',
        color: on ? 'var(--text-body-on-dark)' : 'var(--text-body-soft)'
      }
    }, t));
  })), keyline ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 11,
      textAlign: 'center',
      color: 'var(--text-body-soft)'
    }
  }, keyline) : null);
}
Object.assign(__ds_scope, { StoolPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/StoolPicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "switch",
    "aria-checked": checked,
    tabIndex: 0,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 51,
      height: 31,
      borderRadius: 'var(--radius-switch)',
      background: checked ? 'var(--control-on)' : 'var(--control-off)',
      position: 'relative',
      flex: 'none',
      cursor: 'pointer',
      transition: 'var(--transition-color)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 22 : 2,
      width: 27,
      height: 27,
      borderRadius: 'var(--radius-knob)',
      background: 'var(--control-knob)',
      transition: 'var(--transition-knob)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/progress/DayDots.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const styles = {
  done: {
    background: 'var(--day-done)'
  },
  today: {
    background: 'var(--day-today)'
  },
  ahead: {
    boxShadow: 'var(--ring-strong)'
  },
  skipped: {
    background: 'var(--day-skipped)',
    boxShadow: 'var(--ring-strong)'
  }
};
function DayDots({
  pattern = 'ddtaaaaa',
  style,
  ...rest
}) {
  const map = {
    d: 'done',
    t: 'today',
    a: 'ahead',
    s: 'skipped'
  };
  const cells = [...pattern];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + cells.length + ', minmax(0,1fr))',
      gap: 6,
      ...style
    }
  }, rest), cells.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 10,
      borderRadius: 'var(--radius-dot)',
      ...styles[map[c] || 'ahead']
    }
  })));
}
Object.assign(__ds_scope, { DayDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/DayDots.jsx", error: String((e && e.message) || e) }); }

// components/progress/PathNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PathNode({
  title,
  meta,
  state = 'ahead',
  children,
  last = false,
  style,
  ...rest
}) {
  const pin = state === 'done' ? {
    background: 'var(--day-done)',
    boxShadow: 'none'
  } : state === 'current' ? {
    background: 'var(--control-on)',
    boxShadow: 'var(--ring-current)'
  } : {
    background: 'var(--surface-screen)',
    boxShadow: 'var(--ring-strong)'
  };
  const box = state === 'current' ? {
    background: 'var(--surface-card)'
  } : state === 'ahead' ? {
    background: 'transparent',
    boxShadow: 'inset 0 0 0 2px var(--surface-card-quiet)'
  } : {
    background: 'var(--surface-card-quiet)'
  };
  const dim = state === 'ahead';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: '28px 1fr',
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 8,
      flex: 'none',
      marginTop: 4,
      ...pin
    }
  }), last ? null : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: 2,
      background: 'var(--sage-300)',
      margin: '4px 0',
      minHeight: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-node)',
      padding: '12px 14px',
      marginBottom: 6,
      ...box
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 700,
      fontSize: 'var(--body-md)',
      color: dim ? 'var(--text-muted)' : 'var(--text-body)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      textTransform: 'uppercase',
      color: dim ? 'var(--text-muted)' : 'var(--text-eyebrow)'
    }
  }, meta)), children ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, children) : null));
}
Object.assign(__ds_scope, { PathNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/PathNode.jsx", error: String((e && e.message) || e) }); }

// components/progress/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TabBar({
  tabs = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 6,
      paddingTop: 14,
      borderTop: '2px solid var(--border-strong)',
      ...style
    }
  }, rest), tabs.map(t => {
    const on = value === t.id;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      role: "button",
      tabIndex: 0,
      onClick: () => onChange && onChange(t.id),
      style: {
        flex: 1,
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--nav-size)',
        fontWeight: 700,
        letterSpacing: 'var(--nav-tracking)',
        textTransform: 'uppercase',
        color: on ? 'var(--text-action)' : 'var(--text-eyebrow)',
        background: on ? 'var(--surface-card)' : 'transparent',
        minHeight: 'var(--hit-min)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 'var(--radius-chip)',
        cursor: 'pointer'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/typography/BodyText.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tone = {
  default: 'var(--text-body)',
  soft: 'var(--text-body-soft)',
  dark: 'var(--text-body-on-dark)',
  muted: 'var(--text-muted)',
  paper: 'var(--text-paper)'
};
const sizes = {
  lead: 'var(--body-lead)',
  md: 'var(--body-size)',
  sm: 'var(--body-md)',
  xs: 'var(--body-sm)',
  '2xs': 'var(--body-xs)',
  '3xs': 'var(--body-2xs)'
};
function BodyText({
  children,
  tone: t = 'default',
  size = 'md',
  strong = false,
  as = 'div',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: sizes[size] || size,
      fontWeight: strong ? 700 : 400,
      lineHeight: 'var(--body-line)',
      color: tone[t] || tone.default,
      textWrap: 'pretty',
      margin: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { BodyText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/BodyText.jsx", error: String((e && e.message) || e) }); }

// components/typography/Display.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  answer: 'var(--display-answer)',
  screen: 'var(--display-screen)',
  hero: 'var(--display-hero)',
  card: 'var(--display-card)',
  inline: 'var(--display-inline)',
  tile: 'var(--display-tile)'
};
function Display({
  children,
  size = 'screen',
  weight = 'primary',
  dark = false,
  as = 'div',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: weight === 'secondary' ? 'var(--display-weight-secondary)' : 'var(--display-weight)',
      fontSize: sizes[size] || size,
      lineHeight: 'var(--display-line)',
      letterSpacing: 'var(--display-tracking)',
      textTransform: 'uppercase',
      color: dark ? 'var(--text-display-on-dark)' : 'var(--text-display)',
      textWrap: 'balance',
      margin: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Display });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Display.jsx", error: String((e && e.message) || e) }); }

// components/typography/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tone = {
  default: 'var(--text-eyebrow)',
  soft: 'var(--text-eyebrow-soft)',
  dark: 'var(--text-eyebrow-on-dark)',
  forest: 'var(--text-action)'
};
function Eyebrow({
  children,
  tone: t = 'default',
  tight = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 'var(--eyebrow-weight)',
      letterSpacing: tight ? 'var(--eyebrow-tracking-tight)' : 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: tone[t] || tone.default,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/typography/Numeral.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  xl: 'var(--numeral-xl)',
  lg: 'var(--numeral-lg)',
  md: 'var(--numeral-md)',
  sm: 'var(--numeral-sm)',
  xs: 'var(--numeral-xs)',
  '2xs': 'var(--numeral-2xs)'
};
function Numeral({
  children,
  unit,
  size = 'lg',
  dark = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-numeral)',
      fontWeight: 'var(--numeral-weight)',
      fontSize: sizes[size] || size,
      lineHeight: 'var(--numeral-line)',
      letterSpacing: 'var(--numeral-tracking)',
      fontVariantNumeric: 'tabular-nums',
      color: dark ? 'var(--text-display-on-dark)' : 'var(--text-display)',
      ...style
    }
  }, rest), children, unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.5em',
      color: dark ? 'var(--text-unit-on-dark)' : 'var(--text-unit)'
    }
  }, ' ', unit) : null);
}
Object.assign(__ds_scope, { Numeral });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Numeral.jsx", error: String((e && e.message) || e) }); }

// components/typography/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Rule({
  dark = false,
  width = 'var(--rule-width)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: 'var(--rule-height)',
      width,
      background: dark ? 'var(--line-rule-on-dark)' : 'var(--line-rule)',
      flex: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Rule.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  Eyebrow,
  BodyText,
  Display,
  Rule,
  Card,
  Button,
  ActionLink,
  Chip,
  Numeral,
  TabBar,
  Toast
} = window.ThresholdDesignSystem_2ce5e4;

/* Phone frame + screen chrome, matching the web prototype (390x844, 44px radius, grain). */
function Phone({
  children,
  onTapTop
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 390,
      height: 844,
      borderRadius: 'var(--radius-phone)',
      overflow: 'hidden',
      background: 'var(--surface-screen)',
      backgroundImage: 'var(--grain)',
      boxShadow: 'var(--shadow-device)'
    }
  }, children);
}
function AppScreen({
  children,
  tone = 'cream',
  pinned = false,
  style
}) {
  const bg = tone === 'dark' ? 'var(--surface-screen-dark)' : tone === 'paper' ? 'var(--surface-screen-paper)' : 'var(--surface-screen)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--screen-gap)',
      padding: 'var(--screen-pad-top) var(--screen-pad-x) var(--screen-pad-bottom)',
      overflowY: pinned ? 'hidden' : 'auto',
      background: bg,
      backgroundImage: tone === 'paper' ? 'none' : 'var(--grain)',
      ...style
    }
  }, children);
}
function TopRow({
  left,
  right,
  dark = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      userSelect: 'none',
      cursor: onClick ? 'pointer' : undefined
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: dark ? 'dark' : 'default'
  }, left), /*#__PURE__*/React.createElement(Eyebrow, {
    tone: dark ? 'dark' : 'default'
  }, right));
}

/* Scrolling body of a pinned screen. */
function Feed({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--feed-gap)',
      margin: '0 -20px',
      padding: '0 20px 8px'
    }
  }, children);
}
function Hint({
  children,
  center = false
}) {
  return /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      lineHeight: 1.4,
      textAlign: center ? 'center' : undefined
    }
  }, children);
}
function Metric({
  value,
  label,
  size = 'xs'
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Numeral, {
    size: size
  }, value), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true,
    style: {
      marginTop: 6
    }
  }, label));
}
function BackgroundCard({
  source = 'demo data'
}) {
  return /*#__PURE__*/React.createElement(Card, {
    variant: "quiet"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Background for the day"), /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest"
  }, source)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    value: "7 h 10 min",
    label: "sleep"
  }), /*#__PURE__*/React.createElement(Metric, {
    value: "6,200",
    label: "steps"
  }), /*#__PURE__*/React.createElement(Metric, {
    value: "61",
    label: "resting hr"
  })));
}
Object.assign(window, {
  Phone,
  AppScreen,
  TopRow,
  Feed,
  Hint,
  Metric,
  BackgroundCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DayCardScreen.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  ActionLink,
  Chip,
  Numeral,
  PhotoTile,
  ScaleSlider,
  StoolPicker,
  Switch
} = window.ThresholdDesignSystem_2ce5e4;
const LVL = ['none', 'mild', 'mild', 'mild', 'got in the way', 'got in the way', 'got in the way', 'strong', 'strong', 'strong', 'worst ever'];
const TYPES = ['none', 'hard lumps', 'lumpy sausage', 'cracked surface', 'smooth, soft', 'soft pieces', 'mushy', 'liquid'];
function DayCardScreen({
  day,
  onClose,
  onCloseDay,
  onBlood,
  onAddMeal,
  meals
}) {
  const [belly, setBelly] = React.useState(4);
  const [bloat, setBloat] = React.useState(6);
  const [stool, setStool] = React.useState(5);
  const [alcohol, setAlcohol] = React.useState(false);
  const [illness, setIllness] = React.useState(false);
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Day card",
    right: `day ${day}`
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: "screen"
  }, "How was today"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 4
    }
  }, "At the worst moment today")), /*#__PURE__*/React.createElement(ActionLink, {
    onClick: onClose,
    style: {
      marginTop: -8
    }
  }, "Back")), /*#__PURE__*/React.createElement(ScaleSlider, {
    label: "Belly",
    sub: "pain or discomfort",
    value: belly,
    labels: LVL,
    onChange: setBelly
  }), /*#__PURE__*/React.createElement(ScaleSlider, {
    label: "Bloating",
    sub: "fullness, tight belly",
    value: bloat,
    labels: LVL,
    onChange: setBloat
  }), /*#__PURE__*/React.createElement(StoolPicker, {
    value: stool,
    onChange: setStool,
    sub: "pick the closest",
    keyline: "1\u20132 constipation \xB7 3\u20135 normal \xB7 6\u20137 loose",
    types: TYPES
  }), /*#__PURE__*/React.createElement(BackgroundCard, null), /*#__PURE__*/React.createElement(Hint, null, "Mark if it happened: such days are counted separately."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, "Alcohol"), /*#__PURE__*/React.createElement(Switch, {
    checked: alcohol,
    onChange: setAlcohol
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, "Unwell"), /*#__PURE__*/React.createElement(Switch, {
    checked: illness,
    onChange: setIllness
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: onBlood,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 'var(--radius-card)',
      padding: '4px 16px',
      minHeight: 52,
      boxShadow: 'var(--ring-strong)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "sm"
  }, "Blood in stool"), /*#__PURE__*/React.createElement(ActionLink, null, "Report")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: onAddMeal,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, meals.length ? `Meals today: ${meals.length}` : 'No meals yet today'), /*#__PURE__*/React.createElement(ActionLink, null, "Add"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCloseDay
  }, "Close the day"), /*#__PURE__*/React.createElement(Hint, {
    center: true
  }, "Saves the day. You can fix it tomorrow from Today.")));
}

/* Capture first (chosen option 1), thumb-zone layout: photo is the main path, so it is the
   largest and darkest element — but it lives in the PINNED bottom block, inside the thumb's
   arc on a 844pt screen, rather than in the top third where it can't be reached one-handed.
   The person's own dishes scroll above it and log in one tap. The recognised card appears
   only for photo and voice, where a confirmation is genuinely needed. */
const DISHES = [{
  name: 'Oatmeal with milk',
  groups: ['lactose']
}, {
  name: 'Coffee with milk',
  groups: ['lactose']
}, {
  name: 'Caesar salad',
  groups: ['lactose']
}, {
  name: 'Garlic pasta',
  groups: ['fructans']
}, {
  name: 'Chicken and rice',
  groups: []
}];
function AddMealScreen({
  onBack,
  onSave,
  onLog,
  check,
  logged = []
}) {
  const [recognised, setRecognised] = React.useState(null);
  const [justLogged, setJustLogged] = React.useState(null);
  const isProbe = d => check && d.groups.includes('lactose');
  if (recognised) return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Add a meal",
    right: "19:20"
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "Is this right?"), /*#__PURE__*/React.createElement(Card, {
    variant: "accent"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest"
  }, "Recognized \xB7 19:20"), /*#__PURE__*/React.createElement(Display, {
    size: "card",
    style: {
      marginTop: 8
    }
  }, recognised.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10
    }
  }, recognised.groups.length ? recognised.groups.map(x => /*#__PURE__*/React.createElement(Chip, {
    key: x
  }, x)) : /*#__PURE__*/React.createElement(Chip, {
    style: {
      opacity: 0.6
    }
  }, "no known group")), isProbe(recognised) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, {
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "This is today's test dose \u2014 counted.")) : null), /*#__PURE__*/React.createElement(Hint, null, "We remember the dish and its groups, so next time it is one tap from the list.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onSave({
      time: '19:20',
      name: recognised.name,
      groups: recognised.groups
    })
  }, "Correct"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setRecognised(null)
  }, "Fix")));
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Add a meal",
    right: logged.length ? `${logged.length} today` : 'nothing today'
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "What did you eat"), /*#__PURE__*/React.createElement(ActionLink, {
    onClick: onBack,
    style: {
      marginTop: -8,
      flex: 'none'
    }
  }, "Done")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "One tap from your own"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, "this week")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, DISHES.map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.name,
    variant: justLogged === d.name ? 'accent' : 'quiet',
    tight: true,
    onClick: () => {
      setJustLogged(d.name);
      onLog({
        time: '19:20',
        name: d.name,
        groups: d.groups
      });
    },
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, isProbe(d) ? /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest",
    tight: true
  }, "test dose") : null, d.groups.map(x => /*#__PURE__*/React.createElement(Chip, {
    key: x,
    tone: "sage"
  }, x)))))), logged.length ? /*#__PURE__*/React.createElement(MealStrip, {
    meals: logged,
    onAdd: () => setRecognised(DISHES[0])
  }) : null, /*#__PURE__*/React.createElement(Hint, null, "A day with meals counts towards finding a suspect. A day without them counts for wellbeing only.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(PhotoTile, {
    label: "Snap a meal",
    sub: "we recognise the dish and its groups",
    style: {
      minHeight: 150
    },
    onClick: () => setRecognised(DISHES[0])
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: () => setRecognised(DISHES[2]),
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "Say it")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: () => setRecognised(DISHES[3]),
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "Type it")))));
}
Object.assign(window, {
  DayCardScreen,
  AddMealScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DayCardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DecisionScreens.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  Numeral,
  ActionLink,
  DayDots
} = window.ThresholdDesignSystem_2ce5e4;
function SuspicionScreen({
  onTest,
  onNotNow,
  onOther
}) {
  return /*#__PURE__*/React.createElement(AppScreen, null, /*#__PURE__*/React.createElement(TopRow, {
    left: "A suspect",
    right: "day 21"
  }), /*#__PURE__*/React.createElement(Display, {
    size: "screen"
  }, "Dairy keeps showing up on your rough days"), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "dark"
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "xl",
    dark: true,
    unit: "/ 15"
  }, "12"), /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark",
    tight: true,
    style: {
      marginTop: 10
    }
  }, "rough days with dairy")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet"
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "xl",
    unit: "/ 20"
  }, "3"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true,
    style: {
      marginTop: 10
    }
  }, "good days with dairy"))), /*#__PURE__*/React.createElement(BodyText, {
    size: "lead"
  }, "Dairy showed up in 12 of your 15 rough days. On good days \u2014 3 of 20."), /*#__PURE__*/React.createElement(BodyText, null, "This could be a coincidence \u2014 about a quarter of patterns like this turn out to be. Want to test it over eight days?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: onTest
  }, "Let's test it"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: onNotNow
  }, "Not now"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    onClick: onOther
  }, "Another suspect")));
}
function VerdictScreen({
  notConfirmed,
  onNext,
  onPath
}) {
  return /*#__PURE__*/React.createElement(AppScreen, null, /*#__PURE__*/React.createElement(TopRow, {
    left: "The answer",
    right: "Dairy \xB7 day 8"
  }), /*#__PURE__*/React.createElement(Display, {
    size: "answer",
    style: {
      marginTop: 24
    }
  }, notConfirmed ? 'Not confirmed: the difference stayed within your usual range' : 'Milk: up to 125 ml is fine, 250 ml brings symptoms'), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(BodyText, {
    tone: notConfirmed ? 'default' : 'soft'
  }, notConfirmed ? "You can bring dairy back. The restriction you were keeping wasn't needed — and that's an answer too." : 'The threshold was measured against your own day-to-day variation, with one control day inside the test.'), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Next suspect"), /*#__PURE__*/React.createElement(BodyText, {
    style: {
      marginTop: 8
    }
  }, "Fructans showed up in 9 of your 15 rough days. On good days \u2014 5 of 20.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onNext
  }, "Next suspect: fructans"), /*#__PURE__*/React.createElement("div", {
    onClick: onPath,
    style: {
      textAlign: 'center',
      padding: 12,
      minHeight: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    strong: true
  }, "To the path"))));
}
function TestPlanScreen({
  onClose,
  day
}) {
  const rows = [['1–5', 'Without the group', 'Swaps from your own meals. Everything else as usual.'], ['6', 'Bringing it back, ¼', 'Starts when the days are calm.'], ['7', 'Bringing it back, ½', ''], ['8', 'Bringing it back, full dose', 'Then the answer.']];
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Test plan",
    right: `day ${day}`
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement(Display, {
    size: "screen"
  }, "Test plan"), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, rows.map(([d, h, b], i) => /*#__PURE__*/React.createElement(Card, {
    key: d,
    variant: i === 0 && day <= 5 || i > 0 && day === 5 + i ? 'default' : 'quiet',
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      padding: '13px 16px'
    }
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "xs",
    style: {
      flex: 'none',
      width: 36,
      marginTop: 2
    }
  }, d), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, h), b ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 3
    }
  }, b) : null)))), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet"
  }, /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs"
  }, "A day after a short night (under 6 h), alcohol or illness is not counted \u2014 the dose moves. A missed day pauses the test, it does not fail it."))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Close"));
}
function RedFlagScreen({
  onDoctor,
  onBack
}) {
  return /*#__PURE__*/React.createElement(AppScreen, {
    tone: "dark"
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Protocol paused",
    right: "",
    dark: true
  }), /*#__PURE__*/React.createElement(Display, {
    size: "answer",
    dark: true,
    style: {
      marginTop: 24
    }
  }, "This could be more serious than IBS"), /*#__PURE__*/React.createElement(Rule, {
    dark: true
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    size: "lead"
  }, "Please see a doctor \u2014 here is what to show them. We do not interpret this sign, we only make sure it is not missed."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "cream",
    onClick: onDoctor
  }, "Page for your doctor"), /*#__PURE__*/React.createElement("div", {
    onClick: onBack,
    style: {
      textAlign: 'center',
      padding: 12,
      minHeight: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    strong: true
  }, "Back to the diary"))));
}
Object.assign(window, {
  SuspicionScreen,
  VerdictScreen,
  TestPlanScreen,
  RedFlagScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DecisionScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DoctorPage.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Button,
  Numeral
} = window.ThresholdDesignSystem_2ce5e4;

/* The doctor page is a document, not an app screen: white paper, no grain, prints well. */
function DoctorPage({
  onClose,
  tested
}) {
  const res = tested ? 'up to 125 ml tolerated; 250 ml — symptoms' : 'observing';
  return /*#__PURE__*/React.createElement(AppScreen, {
    tone: "paper"
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Threshold",
    right: "1 page"
  }), /*#__PURE__*/React.createElement(Display, {
    size: "hero",
    style: {
      color: 'var(--text-paper)'
    }
  }, "Participant observations"), /*#__PURE__*/React.createElement(Rule, {
    style: {
      background: 'var(--forest)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Protocol"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "paper",
    size: "xs"
  }, "Observation Sep 1\u2013Sep 27. Test of \"lactose\" Sep 30\u2013Oct 7: 5 days without the group, return in three doses, one control day.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Results by group"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, [['Lactose', res], ['Fructans', 'observing'], ['GOS · fructose · sorbitol · mannitol', 'observing']].map(([g, s]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    tone: "paper",
    size: "xs",
    strong: true
  }, g), /*#__PURE__*/React.createElement(BodyText, {
    tone: "paper",
    size: "xs",
    style: {
      textAlign: 'right'
    }
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Symptom score, daily median"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 8
    }
  }, [[6, 'before the test'], [3, 'during restriction'], [5, 'during return']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "sm",
    style: {
      color: 'var(--text-paper)'
    }
  }, n), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true,
    style: {
      marginTop: 6
    }
  }, l))))), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      marginTop: 'auto',
      borderTop: '1px solid var(--sage-500)',
      paddingTop: 12
    }
  }, "Participant's own observations. Not a diagnosis, not a prescription."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Share"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Close")));
}
Object.assign(window, {
  DoctorPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DoctorPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MealStrip.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Card,
  Numeral,
  Chip
} = window.ThresholdDesignSystem_2ce5e4;

/* The evening ritual without storing anything: the day itself is the object.
   A thin band spans 06:00–24:00 and each logged meal drops a mark onto it, so the day
   visibly fills up as it goes; underneath, each meal is a typographic tile — the time in
   Oswald, the dish, its groups. No photographs are kept: a snapped photo is recognised and
   discarded, and what remains is the dish and the hour. */
const START = 6;
const END = 24;
const pos = time => {
  const [h, m] = String(time).split(':').map(Number);
  const hours = h + (m || 0) / 60;
  return Math.max(0, Math.min(100, (hours - START) / (END - START) * 100));
};
function MealStrip({
  meals = [],
  onAdd
}) {
  const marks = ['06', '12', '18', '24'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Your day"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, meals.length ? `${meals.length} logged` : 'nothing yet')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 7,
      height: 8,
      borderRadius: 'var(--radius-bar)',
      background: 'var(--track-empty)'
    }
  }), meals.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: `calc(${pos(m.time)}% - 11px)`,
      top: 0,
      width: 22,
      height: 22,
      borderRadius: 11,
      background: 'var(--control-on)',
      boxShadow: '0 0 0 4px var(--surface-screen)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, marks.map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 500,
      letterSpacing: 'var(--eyebrow-tracking-tight)',
      color: 'var(--text-eyebrow-soft)'
    }
  }, h)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      margin: '0 -20px',
      padding: '0 20px 2px'
    }
  }, meals.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 132,
      flex: 'none',
      minHeight: 116,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card-quiet)',
      boxShadow: 'var(--ring-hairline)',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "xs"
  }, m.time), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    strong: true,
    style: {
      lineHeight: 1.25
    }
  }, m.name), m.groups && m.groups.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap',
      marginTop: 6
    }
  }, m.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    tone: "sage"
  }, g))) : null))), /*#__PURE__*/React.createElement("div", {
    onClick: onAdd,
    role: "button",
    tabIndex: 0,
    style: {
      width: 132,
      flex: 'none',
      minHeight: 116,
      borderRadius: 'var(--radius-card)',
      background: 'var(--surface-card-dark)',
      boxShadow: 'var(--shadow-card-sm)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -20,
      top: -28,
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: 'var(--surface-card-lift)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 14,
      top: 12,
      width: 24,
      height: 24,
      borderRadius: '50%',
      boxShadow: 'inset 0 0 0 3px var(--sage-300)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: 'var(--display-tile)',
      lineHeight: 1.04,
      letterSpacing: '-0.02em',
      color: 'var(--text-display-on-dark)',
      position: 'relative'
    }
  }, "Add a meal"))), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs"
  }, meals.length ? 'Photos are read and discarded — we keep the dish and the hour, not the picture.' : 'One meal — and the day counts as full. Photos are read and discarded.'));
}
Object.assign(window, {
  MealStrip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MealStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MealVariants.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  Chip,
  Numeral,
  ActionLink,
  PhotoTile
} = window.ThresholdDesignSystem_2ce5e4;
const DISHES = [{
  name: 'Oatmeal with milk',
  groups: ['lactose'],
  moment: 'morning',
  times: 12
}, {
  name: 'Coffee with milk',
  groups: ['lactose'],
  moment: 'morning',
  times: 21
}, {
  name: 'Caesar salad',
  groups: ['lactose'],
  moment: 'day',
  times: 6
}, {
  name: 'Garlic pasta',
  groups: ['fructans'],
  moment: 'day',
  times: 9
}, {
  name: 'Chicken and rice',
  groups: [],
  moment: 'evening',
  times: 14
}, {
  name: 'Apple',
  groups: ['fructose', 'sorbitol'],
  moment: 'snack',
  times: 8
}];

/* ── 1 · Capture first ─────────────────────────────────────────────
   Smallest change: the photo tile becomes the top of the screen and goes
   full width, voice/text drop to a quiet secondary row, and the recent list
   logs in one tap. Fixes the inverted hierarchy, nothing else. */
function MealCaptureFirst({
  onLog
}) {
  const [logged, setLogged] = React.useState(null);
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Add a meal",
    right: "day 24"
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "What did you eat"), /*#__PURE__*/React.createElement(PhotoTile, {
    label: "Snap a meal",
    sub: "we recognise the dish and its groups",
    style: {
      minHeight: 150
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "Say it")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "Type it"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Or one tap from your own"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, "this week")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, DISHES.slice(0, 5).map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.name,
    variant: logged === d.name ? 'accent' : 'quiet',
    tight: true,
    onClick: () => {
      setLogged(d.name);
      onLog(d);
    },
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, d.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    tone: "sage"
  }, g)))))), /*#__PURE__*/React.createElement(Hint, null, "A day with meals counts towards finding a suspect. A day without them counts for wellbeing only.")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Back"));
}

/* ── 2 · One-tap log ──────────────────────────────────────────────
   The list IS the screen. Every row logs immediately and the toast carries
   the undo, so the returning user — who eats the same six things — never
   sees a confirmation step. Capture methods compress to one row on top. */
function MealOneTap({
  onLog
}) {
  const [log, setLog] = React.useState([{
    time: '08:30',
    name: 'Coffee with milk',
    groups: ['lactose']
  }]);
  const add = d => {
    setLog(l => [...l, {
      time: '13:10',
      name: d.name,
      groups: d.groups
    }]);
    onLog(d);
  };
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Meals \xB7 day 24",
    right: `${log.length} logged`
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "One tap and it's in"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 4
    }
  }, "Nothing to confirm. Tap a dish to log it, tap it again to undo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    tight: true,
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true,
    tone: "dark"
  }, "Photo")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, "Voice")), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    style: {
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, "Text"))), /*#__PURE__*/React.createElement(Eyebrow, null, "Yours, most often first"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, [...DISHES].sort((a, b) => b.times - a.times).map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.name,
    variant: "quiet",
    tight: true,
    onClick: () => add(d),
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "2xs",
    style: {
      width: 26,
      flex: 'none'
    }
  }, d.times), /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, d.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, d.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    tone: "sage"
  }, g)))))), /*#__PURE__*/React.createElement(Eyebrow, null, "Today"), /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    style: {
      padding: '6px 18px'
    }
  }, log.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: i === log.length - 1 ? 0 : '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "2xs",
    style: {
      width: 44,
      flex: 'none'
    }
  }, m.time), /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true,
    style: {
      flex: 1
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, m.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    tone: "sage"
  }, g))))))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Done"));
}

/* ── 3 · Meal moments ─────────────────────────────────────────────
   Adds the control the screen is missing: which meal this was. The moment
   sets the time, each moment carries its own recents, and the test-dose line
   gets the room it deserves — it is the most motivating line in the flow. */
function MealMoments({
  onLog,
  inTest = true
}) {
  const MOMENTS = [{
    id: 'morning',
    label: 'Morning',
    time: '08:30'
  }, {
    id: 'day',
    label: 'Day',
    time: '13:10'
  }, {
    id: 'evening',
    label: 'Evening',
    time: '19:20'
  }, {
    id: 'snack',
    label: 'Snack',
    time: '16:00'
  }];
  const [moment, setMoment] = React.useState('day');
  const [picked, setPicked] = React.useState(null);
  const active = MOMENTS.find(m => m.id === moment);
  const list = DISHES.filter(d => d.moment === moment);
  const isProbe = picked && picked.groups.includes('lactose');
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Add a meal",
    right: "day 24"
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "What did you eat"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 4
    }
  }, "Pick the moment \u2014 it sets the time for you.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
      gap: 6
    }
  }, MOMENTS.map(m => {
    const on = m.id === moment;
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      onClick: () => {
        setMoment(m.id);
        setPicked(null);
      },
      style: {
        borderRadius: 'var(--radius-tile)',
        padding: '10px 8px 8px',
        cursor: 'pointer',
        minHeight: 66,
        background: on ? 'var(--control-on)' : 'var(--surface-card-quiet)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Numeral, {
      size: "2xs",
      dark: on
    }, m.time), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-text)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: on ? 'var(--text-body-on-dark)' : 'var(--text-eyebrow)'
      }
    }, m.label));
  })), picked ? /*#__PURE__*/React.createElement(Card, {
    variant: "accent"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest"
  }, "Recognized \xB7 ", active.time), /*#__PURE__*/React.createElement(Display, {
    size: "card",
    style: {
      marginTop: 8
    }
  }, picked.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10
    }
  }, picked.groups.length ? picked.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g
  }, g)) : /*#__PURE__*/React.createElement(Chip, {
    style: {
      opacity: 0.6
    }
  }, "no known group")), inTest && isProbe ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, {
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, "This is today's test dose \u2014 counted.")) : null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PhotoTile, {
    label: `Snap your ${active.label.toLowerCase()}`,
    sub: "photo \xB7 voice \xB7 text",
    style: {
      minHeight: 132
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Usually at ", active.time), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, list.length, " dishes")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, list.map(d => /*#__PURE__*/React.createElement(Card, {
    key: d.name,
    variant: "quiet",
    tight: true,
    onClick: () => {
      setPicked(d);
      onLog(d);
    },
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm"
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, d.groups.map(g => /*#__PURE__*/React.createElement(Chip, {
    key: g,
    tone: "sage"
  }, g))))))), /*#__PURE__*/React.createElement(Hint, null, `One meal makes the day count as full — that's what finds the suspect.`)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    disabled: !picked
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setPicked(null)
  }, picked ? 'Fix' : 'Back')));
}
Object.assign(window, {
  MealCaptureFirst,
  MealOneTap,
  MealMoments,
  DISHES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MealVariants.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/OnboardingScreen.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Button,
  SegmentedControl,
  Card,
  Notice,
  ActionLink
} = window.ThresholdDesignSystem_2ce5e4;
function OnboardingScreen({
  onStart,
  health,
  onHealth
}) {
  const [q, setQ] = React.useState([0, 1, 1]);
  const set = i => v => setQ(q.map((x, k) => k === i ? v : x));
  const rows = [['What bothers you', ['bloating', 'pain', 'bowel habits']], ['How often', ['less than weekly', 'a few times a week', 'almost daily']], ["What you've tried", ['nothing yet', 'cut foods on my own', 'with a dietitian']]];
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true,
    style: {
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Threshold"), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement(Display, {
    size: "hero"
  }, "For the first days we don't restrict anything \u2014 we watch"), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Hint, null, "Pick one in each row. You can change it later."), rows.map(([label, opts], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, label), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: opts,
    value: q[i],
    onChange: set(i)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, health === 'denied' ? /*#__PURE__*/React.createElement(Notice, {
    label: "Demo data",
    action: /*#__PURE__*/React.createElement(ActionLink, {
      onClick: () => onHealth('on')
    }, "Connect Apple Health")
  }, "Sleep and steps will be stand-in numbers. Everything else works, and we'll ask about your sleep in the evening.") : health === 'on' ? /*#__PURE__*/React.createElement(Card, {
    variant: "accent",
    tight: true
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest"
  }, "Apple Health connected"), /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    style: {
      marginTop: 4
    }
  }, "We'll read sleep, steps and resting heart rate. Nothing is written back.")) : /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Apple Health"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, "optional")), /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    style: {
      marginTop: 6
    }
  }, "So a short night isn't mistaken for a reaction to food, we can read your sleep, steps and resting heart rate. Read only \u2014 nothing is written back, and you can turn it off later."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      minHeight: 44,
      padding: '10px 12px',
      fontSize: 14
    },
    onClick: () => onHealth('denied')
  }, "Not now"), /*#__PURE__*/React.createElement(Button, {
    style: {
      minHeight: 44,
      padding: '10px 12px',
      fontSize: 14
    },
    onClick: () => onHealth('on')
  }, "Connect"))), /*#__PURE__*/React.createElement(Button, {
    onClick: onStart
  }, "Start"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "3xs",
    style: {
      textAlign: 'center',
      padding: '2px 8px 0'
    }
  }, "Observations, not a diagnosis. Treatment decisions stay with your doctor.")));
}
Object.assign(window, {
  OnboardingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/OnboardingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PathScreen.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  PathNode,
  ProgressBar,
  DayDots,
  ActionLink,
  Numeral,
  TabBar,
  Notice
} = window.ThresholdDesignSystem_2ce5e4;

/* What each group is and where it turns up — the content exists in Tips but was never
   attached to the map, so six unfamiliar words sat there unexplained. */
const GROUP_NOTES = {
  Lactose: 'The sugar in milk. Milk, soft cheese, ice cream, milk chocolate, cream sauces.',
  Fructans: 'A chain sugar in wheat and onion. Bread, pasta, onion, garlic, rye.',
  GOS: 'A chain sugar in legumes. Beans, chickpeas, lentils, soy, cashews, pistachios.',
  Fructose: 'Fruit sugar in excess of glucose. Apple, pear, mango, honey, high-fructose syrup.',
  Sorbitol: 'A sugar alcohol. Stone fruit, avocado, sugar-free gum and mints.',
  Mannitol: 'A sugar alcohol. Mushrooms, cauliflower, celery, sugar-free sweets.'
};
function PathScreen({
  day,
  tested,
  check,
  tab,
  onTab,
  onDoctor,
  onRestaurant
}) {
  const [openGroup, setOpenGroup] = React.useState(null);
  const groups = [['Lactose', tested ? 'tested: up to 125 ml' : 'observing'], ['Fructans', 'observing'], ['GOS', 'observing'], ['Fructose', 'observing'], ['Sorbitol', 'observing'], ['Mannitol', 'observing']];
  const pct = Math.min(100, Math.round(100 * day / 21));
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Path",
    right: `day ${day}`
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: "screen"
  }, "Your path"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 4
    }
  }, check ? 'Test: dairy' : 'Observing', " \xB7 day ", day)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PathNode, {
    title: "Observing",
    meta: day >= 21 ? 'completed' : `day ${day} of ~21`,
    state: day >= 21 ? 'done' : 'current'
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: pct,
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    value: Math.min(20, day),
    label: "full"
  }), /*#__PURE__*/React.createElement(Metric, {
    value: Math.min(10, Math.round(day / 2)),
    label: "rough"
  }), /*#__PURE__*/React.createElement(Metric, {
    value: Math.min(10, Math.round(day / 2)),
    label: "good"
  }))), /*#__PURE__*/React.createElement(PathNode, {
    title: "First insight",
    meta: day >= 7 ? 'Sep 7' : 'day 7',
    state: day >= 7 ? 'done' : 'ahead'
  }, day >= 7 ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs"
  }, "In four of your five rough days, the night was shorter than six hours.") : null), /*#__PURE__*/React.createElement(PathNode, {
    title: "Suspect",
    meta: day >= 21 ? 'dairy' : 'when the data is in',
    state: day >= 21 ? 'done' : 'ahead'
  }, day >= 21 ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs"
  }, "Dairy showed up in 12 of your 15 rough days. On good days \u2014 3 of 20.") : null), /*#__PURE__*/React.createElement(PathNode, {
    title: "Test 1 \xB7 dairy",
    meta: check ? 'days 22–29' : tested ? 'completed' : 'when the data is in',
    state: check ? 'current' : tested ? 'done' : 'ahead'
  }, check ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DayDots, {
    pattern: [...Array(8)].map((_, i) => i + 1 < check.day ? 'd' : i + 1 === check.day ? 't' : 'a').join('')
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      marginTop: 4
    }
  }, "day ", check.day, " of 8 \xB7 in progress")) : tested ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs"
  }, "up to 125 ml tolerated; 250 ml \u2014 symptoms") : null), /*#__PURE__*/React.createElement(PathNode, {
    title: "Answer 1",
    meta: tested ? '' : 'after the answer',
    state: tested ? 'done' : 'ahead'
  }, tested ? /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    strong: true
  }, "Milk: up to 125 ml is fine, 250 ml brings symptoms") : null), /*#__PURE__*/React.createElement(PathNode, {
    title: "Next test",
    meta: "after the answer",
    state: "ahead",
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Tolerance map"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, tested ? '1 of 6 tested' : 'observing')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, groups.map(([g, s], i) => /*#__PURE__*/React.createElement(Card, {
    key: g,
    variant: "quiet",
    tight: true,
    onClick: () => setOpenGroup(openGroup === g ? null : g),
    style: i === 0 && tested ? {
      background: 'var(--surface-answered)'
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true
  }, g), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      textAlign: 'right'
    }
  }, s)), openGroup === g ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 8
    }
  }, GROUP_NOTES[g]) : null)), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      padding: '0 4px'
    }
  }, "Tap a group to see what it is and where it turns up.")), tested ? null : /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      padding: '0 4px'
    }
  }, "Your first answer will appear after the first test."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: tested ? 'primary' : 'ghost',
    onClick: onDoctor
  }, "Page for your doctor"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onRestaurant
  }, "Card for a restaurant"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "2xs",
    style: {
      padding: '0 4px'
    }
  }, "Both take your map outside the app: one for a clinician, one for a kitchen."))), /*#__PURE__*/React.createElement(TabBar, {
    value: tab,
    onChange: onTab,
    tabs: [{
      id: 'today',
      label: 'Today'
    }, {
      id: 'path',
      label: 'Path'
    }, {
      id: 'tips',
      label: 'Tips'
    }]
  }));
}
function TipsScreen({
  tab,
  onTab,
  check
}) {
  const set = check ? [['Swaps for today', 'Oatmeal with water, lactose-free cheese, coffee with oat milk — all from what you already eat.'], ['At a party', 'Ask what is in the dish. If you cannot avoid the group, note it — the day will simply not count.'], ['Ate it by accident', 'Nothing is lost. Mark the meal, the day is not counted, the test continues tomorrow.'], ['Why a short night is not counted', 'Short sleep causes symptoms on its own. We cannot tell it apart from the food, so the dose moves to the next day.']] : [['Eating out — as usual', 'No restrictions while we watch. Order what you like and snap a photo if it is convenient.'], ['Is yogurt okay?', 'Right now everything is on the table. If dairy ever comes under suspicion, we will suggest testing it — not banning it.'], ['Why photos of meals', 'A day with meals counts towards finding a suspect. A day without meals counts for wellbeing only.'], ['Why the first insight is about sleep', 'A week of data is enough to see sleep, not food. We do not guess about food early.']];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Tips",
    right: check ? 'Test: dairy' : 'Observing'
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement(Display, {
    size: "screen"
  }, "Tips \xB7 ", check ? 'Test: dairy' : 'Observing'), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, set.map(([q, a], i) => /*#__PURE__*/React.createElement(Card, {
    key: q,
    variant: open === i ? 'default' : 'quiet',
    style: {
      padding: '14px 18px',
      cursor: 'pointer'
    },
    onClick: () => setOpen(open === i ? -1 : i)
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: open === i
  }, q), open === i ? /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "sm",
    style: {
      marginTop: 8
    }
  }, a) : null))), /*#__PURE__*/React.createElement(Notice, {
    label: "Coming soon"
  }, "An assistant that answers from your own data, and insight cards pulled from your other records.")), /*#__PURE__*/React.createElement(TabBar, {
    value: tab,
    onChange: onTab,
    tabs: [{
      id: 'today',
      label: 'Today'
    }, {
      id: 'path',
      label: 'Path'
    }, {
      id: 'tips',
      label: 'Tips'
    }]
  }));
}
Object.assign(window, {
  PathScreen,
  TipsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PathScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/RestaurantCard.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  Chip,
  Numeral,
  SegmentedControl,
  Notice,
  ActionLink
} = window.ThresholdDesignSystem_2ce5e4;

/* "In a restaurant" — a card the person shows to staff. It is the tolerance map, said out loud
   in the local language. The brief forbids prohibitive signs (crossed-out foods, locks, crosses),
   so nothing is marked with a symbol: each line states the dose in words and numbers, and the
   strongest thing it ever says is "please leave out". */
const LINES = {
  en: {
    title: 'For the kitchen',
    lead: 'I am testing food groups with my doctor. This is not an allergy — small amounts are fine.',
    avoid: 'Please leave out',
    dose: 'Fine in a small amount',
    free: 'No restriction',
    unknown: 'Not tested yet',
    thanks: 'Thank you — it helps a lot.',
    show: 'Show this to the waiter',
    lang: 'Card language'
  },
  ru: {
    title: 'Для кухни',
    lead: 'Я проверяю группы продуктов вместе с врачом. Это не аллергия — небольшое количество можно.',
    avoid: 'Прошу без этого',
    dose: 'Немного можно',
    free: 'Без ограничений',
    unknown: 'Пока не проверено',
    thanks: 'Спасибо — это очень помогает.',
    show: 'Показать официанту',
    lang: 'Язык карточки'
  }
};
const GROUPS = {
  en: {
    lactose: 'Milk and cream',
    fructans: 'Wheat, onion, garlic',
    gos: 'Beans and lentils',
    fructose: 'Apple, pear, honey',
    sorbitol: 'Stone fruit, sugar-free',
    mannitol: 'Mushrooms, cauliflower'
  },
  ru: {
    lactose: 'Молоко и сливки',
    fructans: 'Пшеница, лук, чеснок',
    gos: 'Бобовые',
    fructose: 'Яблоко, груша, мёд',
    sorbitol: 'Косточковые, без сахара',
    mannitol: 'Грибы, цветная капуста'
  }
};
function RestaurantCard({
  tested,
  check,
  onClose
}) {
  const [lang, setLang] = React.useState(0);
  const L = lang === 0 ? LINES.en : LINES.ru;
  const G = lang === 0 ? GROUPS.en : GROUPS.ru;

  /* Status per group: what is being tested right now outranks what has been answered. */
  const rows = [['lactose', check ? L.avoid : tested ? L.dose : L.unknown, tested && !check ? 'up to 125 ml' : check ? 'testing now' : ''], ['fructans', L.unknown, ''], ['gos', L.unknown, ''], ['fructose', L.unknown, ''], ['sorbitol', L.unknown, ''], ['mannitol', L.unknown, '']];
  return /*#__PURE__*/React.createElement(AppScreen, {
    tone: "paper",
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: "Threshold",
    right: L.show
  }), /*#__PURE__*/React.createElement(Feed, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: "hero",
    style: {
      color: 'var(--text-paper)'
    }
  }, L.title), /*#__PURE__*/React.createElement(ActionLink, {
    onClick: onClose,
    style: {
      marginTop: -8,
      flex: 'none'
    }
  }, "Close")), /*#__PURE__*/React.createElement(Rule, {
    style: {
      background: 'var(--forest)'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "paper",
    size: "sm"
  }, L.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      marginTop: 4
    }
  }, rows.map(([g, status, note], i) => {
    const strong = status === L.avoid;
    return /*#__PURE__*/React.createElement("div", {
      key: g,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--sage-300)'
      }
    }, /*#__PURE__*/React.createElement(BodyText, {
      tone: "paper",
      size: "sm",
      strong: strong,
      style: {
        flex: 1
      }
    }, G[g]), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(BodyText, {
      tone: "paper",
      size: "xs",
      strong: strong
    }, status), note ? /*#__PURE__*/React.createElement(BodyText, {
      tone: "soft",
      size: "2xs",
      style: {
        marginTop: 2
      }
    }, note) : null));
  })), /*#__PURE__*/React.createElement(BodyText, {
    tone: "paper",
    size: "sm",
    strong: true,
    style: {
      marginTop: 4
    }
  }, L.thanks), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, L.lang), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ['English', 'Русский'],
    value: lang,
    onChange: setLang
  })), /*#__PURE__*/React.createElement(Notice, {
    label: lang === 0 ? 'Coming soon' : 'Скоро'
  }, lang === 0 ? 'More languages, and a version that names dishes on the menu rather than food groups.' : 'Другие языки и версия, которая называет блюда из меню, а не группы продуктов.')), /*#__PURE__*/React.createElement(Button, {
    onClick: onClose
  }, L.show));
}
Object.assign(window, {
  RestaurantCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/RestaurantCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TodayScreen.jsx
try { (() => {
const {
  Display,
  BodyText,
  Eyebrow,
  Rule,
  Card,
  Button,
  ActionLink,
  Chip,
  Numeral,
  TabBar,
  PhotoTile,
  ProgressBar,
  DayDots
} = window.ThresholdDesignSystem_2ce5e4;
function ObservingHero({
  day,
  insight,
  onInsightOk
}) {
  if (day === 0) return /*#__PURE__*/React.createElement(Card, {
    variant: "dark"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "Today \xB7 day 0"), /*#__PURE__*/React.createElement(Display, {
    size: "hero",
    dark: true,
    style: {
      marginTop: 10
    }
  }, "Tonight \u2014 your first day card"), /*#__PURE__*/React.createElement(Rule, {
    dark: true,
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    size: "sm"
  }, "Live as usual. In the evening, three questions and thirty seconds."));
  if (insight) return /*#__PURE__*/React.createElement(Card, {
    variant: "dark"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "One week in"), /*#__PURE__*/React.createElement(Display, {
    size: "card",
    dark: true,
    style: {
      marginTop: 10
    }
  }, "The first thing we see"), /*#__PURE__*/React.createElement(Rule, {
    dark: true,
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark"
  }, "In four of your five rough days, the night was shorter than six hours."), /*#__PURE__*/React.createElement(BodyText, {
    tone: "muted",
    size: "sm",
    style: {
      marginTop: 12
    }
  }, "For now this is an observation, not a conclusion \u2014 there isn't much data yet. Too early to talk about food, and we won't guess."), /*#__PURE__*/React.createElement(Button, {
    variant: "cream",
    style: {
      marginTop: 16
    },
    onClick: onInsightOk
  }, "Got it"));
  return /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    style: {
      padding: '14px 20px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "Observing"), /*#__PURE__*/React.createElement(Display, {
    size: "inline",
    dark: true,
    style: {
      marginTop: 6
    }
  }, "Eat as usual"), /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    size: "xs",
    style: {
      marginTop: 6
    }
  }, "Nothing to restrict. Tonight: three questions and thirty seconds. A photo of a meal when it is convenient."));
}
function TestHero({
  check
}) {
  const swaps = ['oatmeal with water', 'lactose-free cheese', 'coffee with oat milk'];
  if (check.day <= 5) return /*#__PURE__*/React.createElement(Card, {
    variant: "dark"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "Test: dairy \xB7 Day ", check.day), /*#__PURE__*/React.createElement(Display, {
    size: "hero",
    dark: true,
    style: {
      marginTop: 10
    }
  }, "Today without dairy"), /*#__PURE__*/React.createElement(Rule, {
    dark: true,
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    size: "xs"
  }, "Swaps from your own meals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 10
    }
  }, swaps.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s,
    variant: "lift",
    style: {
      padding: '11px 16px'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    tone: "dark",
    size: "sm"
  }, s)))));
  const step = check.day - 5;
  return /*#__PURE__*/React.createElement(Card, {
    variant: "dark"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "Test: dairy \xB7 Day ", check.day), /*#__PURE__*/React.createElement(Display, {
    size: "card",
    dark: true,
    style: {
      marginTop: 10
    }
  }, "Bringing it back, dose ", step, " of 3"), /*#__PURE__*/React.createElement(Rule, {
    dark: true,
    style: {
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement(Numeral, {
    size: "xl",
    dark: true,
    unit: ['a quarter cup', 'half a cup', 'a full cup'][step - 1]
  }, ['¼', '½', '1'][step - 1]));
}

/* Pluralisation follows the source string table (prototip/web/threshold-prototype.html, progress). */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
function TodayScreen({
  day,
  check,
  insight,
  meals,
  tested,
  onInsightOk,
  onOpenDay,
  onAddMeal,
  onOpenPlan,
  onEditYesterday,
  tab,
  onTab,
  onTapTop
}) {
  const pct = Math.min(100, Math.round(100 * day / 21));
  return /*#__PURE__*/React.createElement(AppScreen, {
    pinned: true
  }, /*#__PURE__*/React.createElement(TopRow, {
    left: `Today · day ${day}`,
    right: check ? 'Test: dairy' : 'Observing',
    onClick: onTapTop
  }), /*#__PURE__*/React.createElement(Feed, null, check ? /*#__PURE__*/React.createElement(TestHero, {
    check: check
  }) : /*#__PURE__*/React.createElement(ObservingHero, {
    day: day,
    insight: insight,
    onInsightOk: onInsightOk
  }), day > 0 && onEditYesterday ? /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: onEditYesterday,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, "Yesterday \xB7 day ", day - 1), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs",
    style: {
      marginTop: 4
    }
  }, "belly 4 \xB7 bloating 6 \xB7 stool 5")), /*#__PURE__*/React.createElement(ActionLink, {
    style: {
      flex: 'none'
    }
  }, "Edit")) : null, tested ? /*#__PURE__*/React.createElement(Card, {
    variant: "accent"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "forest"
  }, "Your threshold"), /*#__PURE__*/React.createElement(Eyebrow, {
    tight: true
  }, "dairy")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Numeral, {
    size: "md",
    unit: "ml is fine"
  }, "125")), /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    style: {
      marginTop: 6
    }
  }, "250 ml brings symptoms. Below the dose \u2014 freely.")) : null, check ? /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: onOpenPlan
  }, /*#__PURE__*/React.createElement(DayDots, {
    pattern: [...Array(8)].map((_, i) => i + 1 < check.day ? 'd' : i + 1 === check.day ? 't' : 'a').join('')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    strong: true
  }, "day ", check.day, " of 8 \xB7 ", check.day <= 5 ? 'without dairy' : 'bringing it back'), /*#__PURE__*/React.createElement(ActionLink, null, "Test plan"))) : day > 0 ? /*#__PURE__*/React.createElement(Card, {
    variant: "quiet",
    tight: true,
    onClick: () => onTab('path')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(BodyText, {
    size: "xs",
    strong: true
  }, plural(day, 'day', 'days'), " collected"), /*#__PURE__*/React.createElement(ActionLink, null, "Open the path")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: pct,
    style: {
      margin: '2px 0 8px'
    }
  }), /*#__PURE__*/React.createElement(BodyText, {
    tone: "soft",
    size: "xs"
  }, day < 7 ? `first insight in ${plural(7 - day, 'day', 'days')}` : `about ${plural(Math.max(1, 21 - day), 'day', 'days')} more to a suspect`)) : null, /*#__PURE__*/React.createElement(MealStrip, {
    meals: meals,
    onAdd: onAddMeal
  }), /*#__PURE__*/React.createElement(BackgroundCard, null), /*#__PURE__*/React.createElement(Card, {
    variant: "line",
    style: {
      padding: '4px 20px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Tip of the day"), /*#__PURE__*/React.createElement(ActionLink, {
    onClick: () => onTab('tips')
  }, "All tips")), /*#__PURE__*/React.createElement(BodyText, {
    size: "sm",
    strong: true,
    style: {
      marginTop: 2
    }
  }, "Eating out \u2014 as usual"))), /*#__PURE__*/React.createElement(Hint, {
    center: true
  }, "Three questions, thirty seconds."), /*#__PURE__*/React.createElement(Button, {
    onClick: onOpenDay
  }, "Close the day"), /*#__PURE__*/React.createElement(TabBar, {
    value: tab,
    onChange: onTab,
    tabs: [{
      id: 'today',
      label: 'Today'
    }, {
      id: 'path',
      label: 'Path'
    }, {
      id: 'tips',
      label: 'Tips'
    }]
  }));
}
Object.assign(window, {
  TodayScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/doc-page.js", error: String((e && e.message) || e) }); }

__ds_ns.ActionLink = __ds_scope.ActionLink;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.PhotoTile = __ds_scope.PhotoTile;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Notice = __ds_scope.Notice;

__ds_ns.ScaleSlider = __ds_scope.ScaleSlider;

__ds_ns.ScaleStepper = __ds_scope.ScaleStepper;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.StoolPicker = __ds_scope.StoolPicker;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.DayDots = __ds_scope.DayDots;

__ds_ns.PathNode = __ds_scope.PathNode;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.BodyText = __ds_scope.BodyText;

__ds_ns.Display = __ds_scope.Display;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Numeral = __ds_scope.Numeral;

__ds_ns.Rule = __ds_scope.Rule;

})();
