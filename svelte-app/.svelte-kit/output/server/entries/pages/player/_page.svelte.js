import { c as create_ssr_component, h as compute_rest_props, k as spread, q as escape_object, p as escape_attribute_value, d as add_attribute, r as getContext, b as subscribe, f as escape, v as validate_component, e as each, j as createEventDispatcher, o as onDestroy, s as setContext, x as set_store_value, u as is_promise, w as noop } from "../../../chunks/index2.js";
import { B as Button$1 } from "../../../chunks/Button.js";
import { D as Dropdown, a as DropdownToggle, b as DropdownMenu, c as DropdownItem } from "../../../chunks/DropdownToggle.js";
import { F as Form, a as FormGroup, L as Label, I as Input, B as ButtonToolbar } from "../../../chunks/Label.js";
import { C as Col } from "../../../chunks/Col.js";
import { c as classnames, C as Container } from "../../../chunks/Offcanvas.svelte_svelte_type_style_lang.js";
import { R as Row } from "../../../chunks/Row.js";
import { w as writable } from "../../../chunks/index.js";
const Spinner$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "type", "size", "color"]);
  let { class: className = "" } = $$props;
  let { type = "border" } = $$props;
  let { size = "" } = $$props;
  let { color = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  classes = classnames(className, size ? `spinner-${type}-${size}` : false, `spinner-${type}`, color ? `text-${color}` : false);
  return `<div${spread(
    [
      escape_object($$restProps),
      { role: "status" },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}><span class="visually-hidden">${slots.default ? slots.default({}) : `Loading...`}</span></div>`;
});
function extensionToMimeType(filename) {
  const mimes = { mp4: "video/mp4", ogv: "video/ogg", webm: "video/webm" };
  const ext = (filename.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
  if (ext in mimes)
    return mimes[ext];
  return;
}
function prepareVideoSources(source) {
  let sources;
  if (!source) {
    sources = [];
  } else if (source instanceof Array) {
    sources = source.map((item) => {
      const type = extensionToMimeType(item);
      return typeof type === "undefined" ? { src: item } : { src: item, type };
    }).filter((item) => item);
  } else {
    const type = extensionToMimeType(source);
    sources = typeof type === "undefined" ? [{ src: source }] : [{ src: source, type }];
  }
  return sources;
}
function uid() {
  var firstPart = Math.random() * 46656 | 0;
  var secondPart = Math.random() * 46656 | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}
async function preloadImage(url) {
  return new Promise((resolve, reject) => {
    if (url) {
      const image = new Image();
      image.addEventListener(
        "load",
        () => {
          resolve(image);
        },
        { once: true }
      );
      image.addEventListener(
        "error",
        () => {
          resolve();
        },
        { once: true }
      );
      image.src = url;
    } else {
      resolve();
    }
  });
}
const Poster_svelte_svelte_type_style_lang = "";
const css$h = {
  code: ".poster.svelte-fde6bj{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}",
  map: null
};
const Poster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { src } = $$props;
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  $$result.css.add(css$h);
  return `<img${add_attribute("src", src, 0)} class="poster svelte-fde6bj" alt="poster" onerror="this.style.display='none'">`;
});
const Controls_svelte_svelte_type_style_lang = "";
const css$g = {
  code: ".overlay.svelte-h6eqmh{z-index:2147483647;position:absolute;width:100%;height:100%;top:0;left:0}",
  map: null
};
const Controls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$g);
  return `<div class="overlay svelte-h6eqmh">${slots.default ? slots.default({}) : ``}</div>`;
});
const PlayPauseIcon_svelte_svelte_type_style_lang = "";
const css$f = {
  code: ".play-pause-icon.svelte-1na3hbp{position:absolute}",
  map: null
};
const PlayPauseIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { size = "100%" } = $$props;
  let { filled = false } = $$props;
  let { paused } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.filled === void 0 && $$bindings.filled && filled !== void 0)
    $$bindings.filled(filled);
  if ($$props.paused === void 0 && $$bindings.paused && paused !== void 0)
    $$bindings.paused(paused);
  $$result.css.add(css$f);
  $$unsubscribe_cfg();
  return `<div class="play-pause-icon svelte-1na3hbp" style="${"width:" + escape(size, true) + ";"}"><svg viewBox="0 0 100 100" width="100%" stroke-linecap="round" stroke-linejoin="round"><path${add_attribute("visibility", !paused ? "visible" : "hidden", 0)} d="M40 29v42M60 29v42"${add_attribute("stroke", $cfg.iconColor, 0)} stroke-width="5"></path><path${add_attribute("visibility", paused ? "visible" : "hidden", 0)} d="M40 29v42l26-21-26-21z"${add_attribute("fill", filled ? $cfg.iconColor : "none", 0)}${add_attribute("stroke", $cfg.iconColor, 0)} stroke-width="5"></path></svg></div>`;
});
const PlayIconCenter_svelte_svelte_type_style_lang = "";
const css$e = {
  code: ".player-icon.svelte-1yuiuyr{box-sizing:border-box;position:relative;width:100%;height:100%;border-style:none;border-radius:9999px;border-width:2px}",
  map: null
};
const PlayIconCenter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { hidden } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  $$result.css.add(css$e);
  $$unsubscribe_cfg();
  return `${!hidden ? `<div class="player-icon svelte-1yuiuyr" style="${"background-color:" + escape($cfg.color, true) + "; border-color:" + escape($cfg.focusColor, true) + ";"}">${validate_component(PlayPauseIcon, "PlayPauseIcon").$$render($$result, { paused: true }, {}, {})}</div>` : ``}`;
});
const Spinner_svelte_svelte_type_style_lang = "";
const css$d = {
  code: ".spinner.svelte-1q5dh4a{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%)}.circle.svelte-1q5dh4a{box-sizing:border-box;position:absolute;height:100%;width:100%;border-width:2px;border-style:solid;border-radius:50%}.bg.svelte-1q5dh4a{opacity:0.25}.rotating.svelte-1q5dh4a{animation:1s linear 0s infinite normal none running svelte-1q5dh4a-rotate}@keyframes svelte-1q5dh4a-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}",
  map: null
};
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "60px" } = $$props;
  let { color = "#FFF" } = $$props;
  let { hidden = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  $$result.css.add(css$d);
  return `${!hidden ? `<div class="spinner svelte-1q5dh4a" style="${"width:" + escape(size, true) + "; height:" + escape(size, true) + ";"}"><div class="circle bg svelte-1q5dh4a" style="${"border-color:" + escape(color, true) + ";"}"></div>
    <div class="circle rotating svelte-1q5dh4a" style="${"border-color:" + escape(color, true) + " " + escape(color, true) + " transparent transparent;"}"></div></div>` : ``}`;
});
const CenterIcons_svelte_svelte_type_style_lang = "";
const css$c = {
  code: ".center-icons.svelte-1s6qb6f{position:absolute;width:100%;height:100%;left:50%;top:50%;transform:translate(-50%, -50%)}",
  map: null
};
const CenterIcons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { isBuffering } = $$props;
  let { isSpinnerVisible } = $$props;
  let { isIconVisible } = $$props;
  let offsetWidth;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.isBuffering === void 0 && $$bindings.isBuffering && isBuffering !== void 0)
    $$bindings.isBuffering(isBuffering);
  if ($$props.isSpinnerVisible === void 0 && $$bindings.isSpinnerVisible && isSpinnerVisible !== void 0)
    $$bindings.isSpinnerVisible(isSpinnerVisible);
  if ($$props.isIconVisible === void 0 && $$bindings.isIconVisible && isIconVisible !== void 0)
    $$bindings.isIconVisible(isIconVisible);
  $$result.css.add(css$c);
  $$unsubscribe_cfg();
  return `<div class="center-icons svelte-1s6qb6f" style="${"width:" + escape($cfg.centerIconSize, true) + "; height:" + escape($cfg.centerIconSize, true) + ";"}">${validate_component(PlayIconCenter, "PlayIconCenter").$$render($$result, { hidden: !isIconVisible }, {}, {})}
  ${validate_component(Spinner, "Spinner").$$render(
    $$result,
    {
      hidden: !isSpinnerVisible,
      color: isBuffering ? $cfg.color : $cfg.iconColor,
      size: offsetWidth + 10 + "px"
    },
    {},
    {}
  )}</div>`;
});
const BottomControls_svelte_svelte_type_style_lang = "";
const css$b = {
  code: ".controls.svelte-do64tg{position:relative;box-sizing:border-box;min-height:40px;max-height:150px;top:100%;transform:translateY(-100%);padding:10px;display:flex;gap:6px;visibility:visible;transition:transform 0.5s ease, visibility 0.5s linear}.hidden.svelte-do64tg{visibility:hidden;transform:translateY(100%)}",
  map: null
};
const BottomControls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { hidden } = $$props;
  let { isPointerOver } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  if ($$props.isPointerOver === void 0 && $$bindings.isPointerOver && isPointerOver !== void 0)
    $$bindings.isPointerOver(isPointerOver);
  $$result.css.add(css$b);
  $$unsubscribe_cfg();
  return `

<div class="${["controls svelte-do64tg", hidden ? "hidden" : ""].join(" ").trim()}" style="${"height:" + escape($cfg.controlsHeight, true) + "; background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.2) 80%);"}">${slots.default ? slots.default({}) : ``}</div>`;
});
/*!
 * just-throttle
 * Copyright (c) 2016 angus croll The MIT License (MIT)
 */
function throttle(fn, interval, callFirst) {
  var wait = false;
  var callNow = false;
  return function() {
    callNow = callFirst && !wait;
    var context = this;
    var args = arguments;
    if (!wait) {
      wait = true;
      setTimeout(function() {
        wait = false;
        if (!callFirst) {
          return fn.apply(context, args);
        }
      }, interval);
    }
    if (callNow) {
      callNow = false;
      return fn.apply(this, arguments);
    }
  };
}
const Bar_svelte_svelte_type_style_lang = "";
const css$a = {
  code: ".bar.svelte-1539bnd{position:absolute;top:0;width:100%;height:100%;transform-origin:0 0;border-style:solid;border-width:1px}",
  map: null
};
const Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "white" } = $$props;
  let { opacity = 1 } = $$props;
  let { value = 0 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.opacity === void 0 && $$bindings.opacity && opacity !== void 0)
    $$bindings.opacity(opacity);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  $$result.css.add(css$a);
  return `<div class="bar svelte-1539bnd" style="${"background-color:" + escape(color, true) + "; border-color:" + escape(color, true) + "; opacity:" + escape(opacity, true) + "; transform: scaleX(" + escape(value, true) + ");"}"></div>`;
});
const Chunkbar_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ".chunk-bar.svelte-mhutnt{position:absolute;width:100%;height:100%}.chunk.svelte-mhutnt{position:absolute;width:100%;height:100%;transform-origin:0 0}",
  map: null
};
const Chunkbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "white" } = $$props;
  let { opacity = 1 } = $$props;
  let { ranges = [] } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.opacity === void 0 && $$bindings.opacity && opacity !== void 0)
    $$bindings.opacity(opacity);
  if ($$props.ranges === void 0 && $$bindings.ranges && ranges !== void 0)
    $$bindings.ranges(ranges);
  $$result.css.add(css$9);
  return `<div class="chunk-bar svelte-mhutnt">${each(ranges, (range) => {
    return `<div class="chunk svelte-mhutnt" style="${"background-color:" + escape(color, true) + "; opacity:" + escape(opacity, true) + "; transform: translateX(" + escape(range.start * 100, true) + "%) scaleX(" + escape(range.end - range.start, true) + ");"}"></div>`;
  })}</div>`;
});
const Thumb_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: ".thumb-wrapper.svelte-kj06qu{position:absolute;width:100%;height:100%;top:0;pointer-events:none}.thumb.svelte-kj06qu{position:relative;border-style:none;border-radius:50%;border-width:2px;top:50%;transform:translate(-50%, -50%)}.active.svelte-kj06qu{border-style:solid}",
  map: null
};
const Thumb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tx;
  let $cfg, $$unsubscribe_cfg;
  let { positionValue = 0 } = $$props;
  let { active = false } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.positionValue === void 0 && $$bindings.positionValue && positionValue !== void 0)
    $$bindings.positionValue(positionValue);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  $$result.css.add(css$8);
  tx = positionValue * 100;
  $$unsubscribe_cfg();
  return `<div class="thumb-wrapper svelte-kj06qu" style="${"transform: translateX(" + escape(tx, true) + "%);"}"><div class="${["thumb svelte-kj06qu", active ? "active" : ""].join(" ").trim()}" style="${"width:" + escape($cfg.thumbSize, true) + "; height:" + escape($cfg.thumbSize, true) + "; background-color:" + escape($cfg.color, true) + "; border-color:" + escape($cfg.color, true) + ";"}"></div></div>`;
});
const Playbar_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: ".playbar.svelte-wdgqi3.svelte-wdgqi3{position:relative;min-width:50px;height:100%;flex-grow:4;cursor:pointer;outline:none;touch-action:none}.playbar.svelte-wdgqi3:focus .bars.svelte-wdgqi3{outline-style:dotted}.bars.svelte-wdgqi3.svelte-wdgqi3{position:relative;width:100%;top:50%;transform:translateY(-50%);border-radius:9999px;overflow:hidden;outline-offset:3px;outline-width:2px;outline-style:none}.chunkbars.svelte-wdgqi3.svelte-wdgqi3{position:absolute;width:100%;height:30%}",
  map: null
};
const Playbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { isBottomControlsVisible } = $$props;
  let { marginX = "10px" } = $$props;
  let { currentTime = 0 } = $$props;
  let { duration = 0 } = $$props;
  let { buffered = [] } = $$props;
  let { played = [] } = $$props;
  let { paused } = $$props;
  let { isScrubbing } = $$props;
  createEventDispatcher();
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  let playbarElement;
  let isPointerDown;
  let _buffered;
  let _played;
  let _currentTimePercentage;
  function updateTime() {
    _currentTimePercentage = currentTime / duration;
  }
  const updateTimeThrottled = throttle(
    (time) => {
      _currentTimePercentage = time / duration;
    },
    250,
    true
  );
  const updateChunkBarsThrottled = throttle(
    (time) => {
      _buffered = buffered.map((item) => {
        return {
          start: item.start / duration,
          end: item.end / duration
        };
      });
      _played = played.map((item) => {
        return {
          start: item.start / duration,
          end: item.end / duration
        };
      });
    },
    250,
    true
  );
  if ($$props.isBottomControlsVisible === void 0 && $$bindings.isBottomControlsVisible && isBottomControlsVisible !== void 0)
    $$bindings.isBottomControlsVisible(isBottomControlsVisible);
  if ($$props.marginX === void 0 && $$bindings.marginX && marginX !== void 0)
    $$bindings.marginX(marginX);
  if ($$props.currentTime === void 0 && $$bindings.currentTime && currentTime !== void 0)
    $$bindings.currentTime(currentTime);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.buffered === void 0 && $$bindings.buffered && buffered !== void 0)
    $$bindings.buffered(buffered);
  if ($$props.played === void 0 && $$bindings.played && played !== void 0)
    $$bindings.played(played);
  if ($$props.paused === void 0 && $$bindings.paused && paused !== void 0)
    $$bindings.paused(paused);
  if ($$props.isScrubbing === void 0 && $$bindings.isScrubbing && isScrubbing !== void 0)
    $$bindings.isScrubbing(isScrubbing);
  $$result.css.add(css$7);
  {
    {
      if (isBottomControlsVisible && $cfg.chunkBars) {
        updateChunkBarsThrottled(currentTime);
      }
    }
  }
  {
    {
      if (isBottomControlsVisible) {
        if (isScrubbing)
          updateTime();
        else
          updateTimeThrottled(currentTime);
      }
    }
  }
  $$unsubscribe_cfg();
  return `

<div class="playbar svelte-wdgqi3" tabindex="0" style="${"margin:0 " + escape(marginX, true) + ";"}"${add_attribute("this", playbarElement, 0)}><div class="bars svelte-wdgqi3" style="${"height:" + escape($cfg.trackHeight, true) + "; outline-color:" + escape($cfg.focusColor, true) + ";"}">${validate_component(Bar, "Bar").$$render(
    $$result,
    {
      color: $cfg.barsBgColor,
      opacity: 1,
      value: 1
    },
    {},
    {}
  )}
    ${validate_component(Bar, "Bar").$$render(
    $$result,
    {
      color: $cfg.color,
      value: _currentTimePercentage
    },
    {},
    {}
  )}
    ${$cfg.chunkBars ? `<div class="chunkbars svelte-wdgqi3">${validate_component(Chunkbar, "Chunkbar").$$render(
    $$result,
    {
      color: $cfg.bufferedColor,
      opacity: 1,
      ranges: _buffered
    },
    {},
    {}
  )}
        ${validate_component(Chunkbar, "Chunkbar").$$render(
    $$result,
    {
      color: $cfg.color,
      opacity: 1,
      ranges: _played
    },
    {},
    {}
  )}</div>` : ``}</div>
  ${validate_component(Thumb, "Thumb").$$render(
    $$result,
    {
      positionValue: _currentTimePercentage,
      active: isPointerDown
    },
    {},
    {}
  )}</div>`;
});
const Button_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".button.svelte-ievgfv{box-sizing:border-box;position:relative;height:100%;border-style:none;border-radius:10px;border-width:2px;outline:none;cursor:pointer}@media(hover: hover) and (pointer: fine){.button.svelte-ievgfv:focus{border-style:solid}}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { round = false } = $$props;
  createEventDispatcher();
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  let offsetHeight;
  if ($$props.round === void 0 && $$bindings.round && round !== void 0)
    $$bindings.round(round);
  $$result.css.add(css$6);
  $$unsubscribe_cfg();
  return `<div class="button svelte-ievgfv" style="${"width:" + escape(offsetHeight, true) + "px; min-width:" + escape(offsetHeight, true) + "px; background-color:" + escape($cfg.color, true) + "; border-color:" + escape($cfg.focusColor, true) + "; border-radius:" + escape(round ? "9999px" : "10px", true) + ";"}" tabindex="0">${slots.default ? slots.default({}) : ``}</div>`;
});
const PlayPauseButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { paused } = $$props;
  if ($$props.paused === void 0 && $$bindings.paused && paused !== void 0)
    $$bindings.paused(paused);
  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(PlayPauseIcon, "PlayPauseIcon").$$render($$result, { paused }, {}, {})}`;
    }
  })}`;
});
const VolumeIcon_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".volume-icon.svelte-rnfp7y{position:absolute}",
  map: null
};
const VolumeIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { size = "100%" } = $$props;
  let { filled = true } = $$props;
  let { muted } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.filled === void 0 && $$bindings.filled && filled !== void 0)
    $$bindings.filled(filled);
  if ($$props.muted === void 0 && $$bindings.muted && muted !== void 0)
    $$bindings.muted(muted);
  $$result.css.add(css$5);
  $$unsubscribe_cfg();
  return `<div class="volume-icon svelte-rnfp7y" style="${"width:" + escape(size, true) + ";"}"><svg viewBox="0 0 100 100" stroke-linecap="round" stroke-linejoin="round"><g fill="none"${add_attribute("stroke", $cfg.iconColor, 0)} stroke-width="5"><path${add_attribute("fill", filled ? $cfg.iconColor : "none", 0)} d="M33.913 38.955l14.58-11.046v44.918l-14.58-11.045H22.154V38.955h11.759z"></path><g${add_attribute("visibility", !muted ? "visible" : "hidden", 0)}><path d="M68.27 31.776c10.039 10.058 10.039 26.39 0 36.448"></path><path d="M61.062 38.986c6.067 6.079 6.067 15.949 0 22.028"></path></g><g${add_attribute("visibility", muted ? "visible" : "hidden", 0)}><path d="M59.644 41.173l17.621 17.658"></path><path d="M77.265 41.173L59.644 58.831"></path></g></g></svg></div>`;
});
const VolumeButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { muted } = $$props;
  if ($$props.muted === void 0 && $$bindings.muted && muted !== void 0)
    $$bindings.muted(muted);
  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(VolumeIcon, "VolumeIcon").$$render($$result, { muted }, {}, {})}`;
    }
  })}`;
});
const Slider_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".slider.svelte-1qqqte2.svelte-1qqqte2{position:relative;flex-grow:1;min-width:25px;height:100%;outline:none}.slider.svelte-1qqqte2:focus .bars.svelte-1qqqte2{outline-style:dotted}.bars.svelte-1qqqte2.svelte-1qqqte2{position:relative;width:100%;top:50%;transform:translateY(-50%);outline-offset:3px;outline-width:2px;outline-style:none;border-radius:9999px;overflow:hidden}",
  map: null
};
const Slider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { width = "150px" } = $$props;
  let { marginX = "10px" } = $$props;
  let { value = 0.5 } = $$props;
  let sliderElement;
  let isPointerDown;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value2) => $cfg = value2);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.marginX === void 0 && $$bindings.marginX && marginX !== void 0)
    $$bindings.marginX(marginX);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  $$result.css.add(css$4);
  $$unsubscribe_cfg();
  return `

<div class="slider svelte-1qqqte2" style="${"max-width:" + escape(width, true) + "; margin:0 " + escape(marginX, true) + ";"}" tabindex="0"${add_attribute("this", sliderElement, 0)}><div class="bars svelte-1qqqte2" style="${"height:" + escape($cfg.trackHeight, true) + "; outline-color:" + escape($cfg.focusColor, true) + ";"}">${validate_component(Bar, "Bar").$$render(
    $$result,
    {
      color: $cfg.barsBgColor,
      opacity: 1,
      value: 1
    },
    {},
    {}
  )}
    ${validate_component(Bar, "Bar").$$render($$result, { color: $cfg.color, opacity: 1, value }, {}, {})}</div>
  ${validate_component(Thumb, "Thumb").$$render(
    $$result,
    {
      positionValue: value,
      active: isPointerDown
    },
    {},
    {}
  )}</div>`;
});
const VolumeControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = "100px" } = $$props;
  let { volume = 1 } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.volume === void 0 && $$bindings.volume && volume !== void 0)
    $$bindings.volume(volume);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Slider, "Slider").$$render(
      $$result,
      { width, value: volume },
      {
        value: ($$value) => {
          volume = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const FullscreenIcon_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".fullscreen-icon.svelte-15g0vgp{position:absolute}",
  map: null
};
const FullscreenIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $cfg, $$unsubscribe_cfg;
  let { size = "100%" } = $$props;
  let { isFullscreen } = $$props;
  const cfg = getContext("config");
  $$unsubscribe_cfg = subscribe(cfg, (value) => $cfg = value);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.isFullscreen === void 0 && $$bindings.isFullscreen && isFullscreen !== void 0)
    $$bindings.isFullscreen(isFullscreen);
  $$result.css.add(css$3);
  $$unsubscribe_cfg();
  return `<div class="fullscreen-icon svelte-15g0vgp" style="${"width:" + escape(size, true) + ";"}"><svg viewBox="0 0 100 100" stroke-linecap="round" stroke-linejoin="round"><g fill="none"${add_attribute("stroke", $cfg.iconColor, 0)} stroke-width="5"><g${add_attribute("visibility", !isFullscreen ? "visible" : "hidden", 0)}><path d="M71 60.5V71H60"></path><path d="M40 71H29V60.5"></path><path d="M29 40.5V29h11"></path><path d="M60 29h11v11.5"></path></g><g${add_attribute("visibility", isFullscreen ? "visible" : "hidden", 0)}><path d="M60 71V60.5h11"></path><path d="M29 60.5h11V71"></path><path d="M40 29v11.5H29"></path><path d="M71 40.5H60V29"></path></g></g></svg></div>`;
});
const FullscreenButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isFullscreen } = $$props;
  if ($$props.isFullscreen === void 0 && $$bindings.isFullscreen && isFullscreen !== void 0)
    $$bindings.isFullscreen(isFullscreen);
  return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(FullscreenIcon, "FullscreenIcon").$$render($$result, { isFullscreen }, {}, {})}`;
    }
  })}`;
});
var screenfullExports = {};
var screenfull = {
  get exports() {
    return screenfullExports;
  },
  set exports(v) {
    screenfullExports = v;
  }
};
/*!
 * screenfull
 * v5.1.0 - 2020-12-24
 * (c) Sindre Sorhus; MIT License
 */
(function(module) {
  (function() {
    var document = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
    var isCommonjs = module.exports;
    var fn = function() {
      var val;
      var fnMap = [
        [
          "requestFullscreen",
          "exitFullscreen",
          "fullscreenElement",
          "fullscreenEnabled",
          "fullscreenchange",
          "fullscreenerror"
        ],
        // New WebKit
        [
          "webkitRequestFullscreen",
          "webkitExitFullscreen",
          "webkitFullscreenElement",
          "webkitFullscreenEnabled",
          "webkitfullscreenchange",
          "webkitfullscreenerror"
        ],
        // Old WebKit
        [
          "webkitRequestFullScreen",
          "webkitCancelFullScreen",
          "webkitCurrentFullScreenElement",
          "webkitCancelFullScreen",
          "webkitfullscreenchange",
          "webkitfullscreenerror"
        ],
        [
          "mozRequestFullScreen",
          "mozCancelFullScreen",
          "mozFullScreenElement",
          "mozFullScreenEnabled",
          "mozfullscreenchange",
          "mozfullscreenerror"
        ],
        [
          "msRequestFullscreen",
          "msExitFullscreen",
          "msFullscreenElement",
          "msFullscreenEnabled",
          "MSFullscreenChange",
          "MSFullscreenError"
        ]
      ];
      var i = 0;
      var l = fnMap.length;
      var ret = {};
      for (; i < l; i++) {
        val = fnMap[i];
        if (val && val[1] in document) {
          for (i = 0; i < val.length; i++) {
            ret[fnMap[0][i]] = val[i];
          }
          return ret;
        }
      }
      return false;
    }();
    var eventNameMap = {
      change: fn.fullscreenchange,
      error: fn.fullscreenerror
    };
    var screenfull2 = {
      request(element, options) {
        return new Promise(
          function(resolve, reject) {
            var onFullScreenEntered = function() {
              this.off("change", onFullScreenEntered);
              resolve();
            }.bind(this);
            this.on("change", onFullScreenEntered);
            element = element || document.documentElement;
            var returnPromise = element[fn.requestFullscreen](options);
            if (returnPromise instanceof Promise) {
              returnPromise.then(onFullScreenEntered).catch(reject);
            }
          }.bind(this)
        );
      },
      exit() {
        return new Promise(
          function(resolve, reject) {
            if (!this.isFullscreen) {
              resolve();
              return;
            }
            var onFullScreenExit = function() {
              this.off("change", onFullScreenExit);
              resolve();
            }.bind(this);
            this.on("change", onFullScreenExit);
            var returnPromise = document[fn.exitFullscreen]();
            if (returnPromise instanceof Promise) {
              returnPromise.then(onFullScreenExit).catch(reject);
            }
          }.bind(this)
        );
      },
      toggle(element, options) {
        return this.isFullscreen ? this.exit() : this.request(element, options);
      },
      onchange(callback) {
        this.on("change", callback);
      },
      onerror(callback) {
        this.on("error", callback);
      },
      on(event, callback) {
        var eventName = eventNameMap[event];
        if (eventName) {
          document.addEventListener(eventName, callback, false);
        }
      },
      off(event, callback) {
        var eventName = eventNameMap[event];
        if (eventName) {
          document.removeEventListener(eventName, callback, false);
        }
      },
      raw: fn
    };
    if (!fn) {
      if (isCommonjs) {
        module.exports = { isEnabled: false };
      } else {
        window.screenfull = { isEnabled: false };
      }
      return;
    }
    Object.defineProperties(screenfull2, {
      isFullscreen: {
        get: function() {
          return Boolean(document[fn.fullscreenElement]);
        }
      },
      element: {
        enumerable: true,
        get: function() {
          return document[fn.fullscreenElement];
        }
      },
      isEnabled: {
        enumerable: true,
        get: function() {
          return Boolean(document[fn.fullscreenEnabled]);
        }
      }
    });
    if (isCommonjs) {
      module.exports = screenfull2;
    } else {
      window.screenfull = screenfull2;
    }
  })();
})(screenfull);
const FullscreenManager = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { element } = $$props;
  let { isFullscreen } = $$props;
  let { isFullscreenEnabled } = $$props;
  isFullscreenEnabled = screenfullExports.isEnabled;
  if (isFullscreenEnabled)
    screenfullExports.on("change", onChange);
  function onChange(e) {
    if (element == e.target)
      isFullscreen = screenfullExports.isFullscreen;
  }
  onDestroy(() => {
    screenfullExports.off("change", onChange);
  });
  if ($$props.element === void 0 && $$bindings.element && element !== void 0)
    $$bindings.element(element);
  if ($$props.isFullscreen === void 0 && $$bindings.isFullscreen && isFullscreen !== void 0)
    $$bindings.isFullscreen(isFullscreen);
  if ($$props.isFullscreenEnabled === void 0 && $$bindings.isFullscreenEnabled && isFullscreenEnabled !== void 0)
    $$bindings.isFullscreenEnabled(isFullscreenEnabled);
  {
    {
      if (isFullscreenEnabled)
        isFullscreen ? screenfullExports.request(element) : screenfullExports.exit();
    }
  }
  return ``;
});
const IdleDetector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isIdle = false } = $$props;
  let timeout;
  onDestroy(() => {
    clearTimeout(timeout);
  });
  if ($$props.isIdle === void 0 && $$bindings.isIdle && isIdle !== void 0)
    $$bindings.isIdle(isIdle);
  return ``;
});
const ScrollDetector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isScrolling = false } = $$props;
  let timeout;
  onDestroy(() => {
    clearTimeout(timeout);
  });
  if ($$props.isScrolling === void 0 && $$bindings.isScrolling && isScrolling !== void 0)
    $$bindings.isScrolling(isScrolling);
  return ``;
});
const Time_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".time.svelte-1a30cmt{position:relative;height:100%;text-align:center;display:flex;flex-direction:column;justify-content:center;margin-right:6px}.text.svelte-1a30cmt{position:relative;font-family:'Lucida Sans Typewriter', 'Lucida Console', monaco, 'Bitstream Vera Sans Mono', monospace;font-size:1rem;line-height:1rem;color:white}",
  map: null
};
const Time = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hours;
  let { duration } = $$props;
  let { currentTime } = $$props;
  let ft = 0;
  const setTime = throttle(
    () => {
      ft = formatTime(currentTime, hours);
    },
    250,
    true
  );
  const formatTime = (seconds = 0, hours2 = false) => {
    let s = new Date(seconds * 1e3).toISOString().substr(11, 8);
    return hours2 ? s : s.substring(3);
  };
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.currentTime === void 0 && $$bindings.currentTime && currentTime !== void 0)
    $$bindings.currentTime(currentTime);
  $$result.css.add(css$2);
  hours = duration >= 3600;
  {
    {
      if (currentTime)
        setTime();
    }
  }
  return `<div class="time svelte-1a30cmt"><div class="text svelte-1a30cmt">${escape(ft)}</div></div>`;
});
const VideoPlayerClient_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "video::-webkit-media-controls{display:none !important}.aspect.svelte-1ai3mbf.svelte-1ai3mbf{position:relative;width:100%;height:0;padding-top:100%;overflow:hidden;border-radius:8px;-webkit-mask-image:-webkit-radial-gradient(white, black);mask-image:-webkit-radial-gradient(white, black)}.aspect.svelte-1ai3mbf>.svelte-1ai3mbf:first-child{position:absolute;top:0;right:0;bottom:0;left:0;outline:none}video.svelte-1ai3mbf.svelte-1ai3mbf{position:relative;width:100%;height:100%}",
  map: null
};
const VideoPlayerClient = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let _sources;
  let muted;
  let isPosterVisible;
  let isBottomControlsVisible;
  let isSpinnerVisible;
  let isCenterIconVisibile;
  let $config, $$unsubscribe_config;
  let { width } = $$props;
  let { height } = $$props;
  let { poster } = $$props;
  let { source } = $$props;
  let { controlsHeight } = $$props;
  let { trackHeight } = $$props;
  let { thumbSize } = $$props;
  let { centerIconSize } = $$props;
  let { playerBgColor } = $$props;
  let { color } = $$props;
  let { focusColor } = $$props;
  let { barsBgColor } = $$props;
  let { iconColor } = $$props;
  let { bufferedColor } = $$props;
  let { chunkBars } = $$props;
  let { borderRadius } = $$props;
  let { loop } = $$props;
  let { skipSeconds } = $$props;
  let { aspectRatio } = $$props;
  let { controlsOnPause } = $$props;
  let { timeDisplay } = $$props;
  const config = writable({});
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  setContext("config", config);
  let videoPlayerElement;
  let videoElement;
  let currentTime = 0;
  let duration;
  let buffered = [];
  let played = [];
  let paused = true;
  let volume = 1;
  let isVideoData = false;
  let isPointerOverControls = false;
  let isBuffering = false;
  let isFullscreenEnabled = false;
  let isFullscreen = false;
  let isIdle = false;
  let isScrolling = false;
  let isScrubbing = false;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.poster === void 0 && $$bindings.poster && poster !== void 0)
    $$bindings.poster(poster);
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  if ($$props.controlsHeight === void 0 && $$bindings.controlsHeight && controlsHeight !== void 0)
    $$bindings.controlsHeight(controlsHeight);
  if ($$props.trackHeight === void 0 && $$bindings.trackHeight && trackHeight !== void 0)
    $$bindings.trackHeight(trackHeight);
  if ($$props.thumbSize === void 0 && $$bindings.thumbSize && thumbSize !== void 0)
    $$bindings.thumbSize(thumbSize);
  if ($$props.centerIconSize === void 0 && $$bindings.centerIconSize && centerIconSize !== void 0)
    $$bindings.centerIconSize(centerIconSize);
  if ($$props.playerBgColor === void 0 && $$bindings.playerBgColor && playerBgColor !== void 0)
    $$bindings.playerBgColor(playerBgColor);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.focusColor === void 0 && $$bindings.focusColor && focusColor !== void 0)
    $$bindings.focusColor(focusColor);
  if ($$props.barsBgColor === void 0 && $$bindings.barsBgColor && barsBgColor !== void 0)
    $$bindings.barsBgColor(barsBgColor);
  if ($$props.iconColor === void 0 && $$bindings.iconColor && iconColor !== void 0)
    $$bindings.iconColor(iconColor);
  if ($$props.bufferedColor === void 0 && $$bindings.bufferedColor && bufferedColor !== void 0)
    $$bindings.bufferedColor(bufferedColor);
  if ($$props.chunkBars === void 0 && $$bindings.chunkBars && chunkBars !== void 0)
    $$bindings.chunkBars(chunkBars);
  if ($$props.borderRadius === void 0 && $$bindings.borderRadius && borderRadius !== void 0)
    $$bindings.borderRadius(borderRadius);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0)
    $$bindings.loop(loop);
  if ($$props.skipSeconds === void 0 && $$bindings.skipSeconds && skipSeconds !== void 0)
    $$bindings.skipSeconds(skipSeconds);
  if ($$props.aspectRatio === void 0 && $$bindings.aspectRatio && aspectRatio !== void 0)
    $$bindings.aspectRatio(aspectRatio);
  if ($$props.controlsOnPause === void 0 && $$bindings.controlsOnPause && controlsOnPause !== void 0)
    $$bindings.controlsOnPause(controlsOnPause);
  if ($$props.timeDisplay === void 0 && $$bindings.timeDisplay && timeDisplay !== void 0)
    $$bindings.timeDisplay(timeDisplay);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    _sources = prepareVideoSources(source);
    set_store_value(config, $config.controlsHeight = controlsHeight, $config);
    set_store_value(config, $config.thumbSize = thumbSize, $config);
    set_store_value(config, $config.trackHeight = trackHeight, $config);
    set_store_value(config, $config.centerIconSize = centerIconSize, $config);
    set_store_value(config, $config.color = color, $config);
    set_store_value(config, $config.playerBgColor = playerBgColor, $config);
    set_store_value(config, $config.focusColor = focusColor, $config);
    set_store_value(config, $config.barsBgColor = barsBgColor, $config);
    set_store_value(config, $config.iconColor = iconColor, $config);
    set_store_value(config, $config.bufferedColor = bufferedColor, $config);
    set_store_value(config, $config.chunkBars = chunkBars, $config);
    set_store_value(config, $config.loop = loop, $config);
    set_store_value(config, $config.borderRadius = borderRadius, $config);
    set_store_value(config, $config.controlsOnPause = controlsOnPause, $config);
    set_store_value(config, $config.timeDisplay = timeDisplay, $config);
    muted = volume == 0;
    isPosterVisible = !isVideoData;
    isBottomControlsVisible = isVideoData;
    isSpinnerVisible = isBuffering;
    isCenterIconVisibile = !isVideoData;
    $$rendered = `






<div class="aspect svelte-1ai3mbf" style="${"padding-top:" + escape(aspectRatio * 100, true) + "%; background-color:" + escape(playerBgColor, true) + "; border-radius:" + escape(borderRadius, true)}">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return `
    <div class="svelte-1ai3mbf">${validate_component(Spinner, "Spinner").$$render($$result, { color: iconColor, size: "60px" }, {}, {})}</div>
  `;
      }
      return function() {
        return `
    <div id="${"video-player-" + escape(uid(), true)}"${add_attribute("tabindex", "-1", 0)} class="svelte-1ai3mbf"${add_attribute("this", videoPlayerElement, 0)}><video${add_attribute("width", width, 0)}${add_attribute("height", height, 0)} preload="none" class="svelte-1ai3mbf"${add_attribute("this", videoElement, 0)}${add_attribute("currentTime", currentTime, 0)}${add_attribute("paused", paused, 0)}${add_attribute("volume", volume, 0)}><track kind="captions">${each(_sources, ({ src, type }) => {
          return `<source${add_attribute("src", src, 0)}${add_attribute("type", type, 0)}>`;
        })}<p>Sorry, your browser doesn&#39;t support HTML5 videos.</p></video>

      ${poster && isPosterVisible ? `${validate_component(Poster, "Poster").$$render($$result, { src: poster }, {}, {})}` : ``}

      ${validate_component(Controls, "Controls").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(BottomControls, "BottomControls").$$render(
              $$result,
              {
                hidden: !isBottomControlsVisible,
                isPointerOver: isPointerOverControls
              },
              {
                isPointerOver: ($$value) => {
                  isPointerOverControls = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `${validate_component(PlayPauseButton, "PlayPauseButton").$$render($$result, { paused }, {}, {})}
          ${validate_component(Playbar, "Playbar").$$render(
                    $$result,
                    {
                      duration,
                      buffered,
                      played,
                      isBottomControlsVisible,
                      currentTime,
                      paused,
                      isScrubbing
                    },
                    {
                      currentTime: ($$value) => {
                        currentTime = $$value;
                        $$settled = false;
                      },
                      paused: ($$value) => {
                        paused = $$value;
                        $$settled = false;
                      },
                      isScrubbing: ($$value) => {
                        isScrubbing = $$value;
                        $$settled = false;
                      }
                    },
                    {}
                  )}
          ${timeDisplay ? `${validate_component(Time, "Time").$$render($$result, { duration, currentTime }, {}, {})}` : ``}
          ${validate_component(VolumeButton, "VolumeButton").$$render($$result, { muted }, {}, {})}
          ${validate_component(VolumeControl, "VolumeControl").$$render(
                    $$result,
                    { volume },
                    {
                      volume: ($$value) => {
                        volume = $$value;
                        $$settled = false;
                      }
                    },
                    {}
                  )}
          ${isFullscreenEnabled ? `${validate_component(FullscreenButton, "FullscreenButton").$$render($$result, { isFullscreen }, {}, {})}` : ``}`;
                }
              }
            )}
        ${validate_component(CenterIcons, "CenterIcons").$$render(
              $$result,
              {
                isIconVisible: isCenterIconVisibile,
                isSpinnerVisible,
                isBuffering
              },
              {},
              {}
            )}`;
          }
        })}</div>
  `;
      }();
    }(preloadImage(poster))}

  

  ${validate_component(IdleDetector, "IdleDetector").$$render(
      $$result,
      { isIdle },
      {
        isIdle: ($$value) => {
          isIdle = $$value;
          $$settled = false;
        }
      },
      {}
    )}

  ${validate_component(ScrollDetector, "ScrollDetector").$$render(
      $$result,
      { isScrolling },
      {
        isScrolling: ($$value) => {
          isScrolling = $$value;
          $$settled = false;
        }
      },
      {}
    )}

  ${validate_component(FullscreenManager, "FullscreenManager").$$render(
      $$result,
      {
        element: videoPlayerElement,
        isFullscreenEnabled,
        isFullscreen
      },
      {
        isFullscreenEnabled: ($$value) => {
          isFullscreenEnabled = $$value;
          $$settled = false;
        },
        isFullscreen: ($$value) => {
          isFullscreen = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  $$unsubscribe_config();
  return $$rendered;
});
const VideoPlayerServer_svelte_svelte_type_style_lang = "";
const css = {
  code: ".aspect.svelte-1sqfmr5{position:relative;width:100%;height:0;padding-top:100%;overflow:hidden;border-radius:8px;-webkit-mask-image:-webkit-radial-gradient(white, black);mask-image:-webkit-radial-gradient(white, black)}",
  map: null
};
const VideoPlayerServer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { playerBgColor } = $$props;
  let { borderRadius } = $$props;
  let { aspectRatio } = $$props;
  if ($$props.playerBgColor === void 0 && $$bindings.playerBgColor && playerBgColor !== void 0)
    $$bindings.playerBgColor(playerBgColor);
  if ($$props.borderRadius === void 0 && $$bindings.borderRadius && borderRadius !== void 0)
    $$bindings.borderRadius(borderRadius);
  if ($$props.aspectRatio === void 0 && $$bindings.aspectRatio && aspectRatio !== void 0)
    $$bindings.aspectRatio(aspectRatio);
  $$result.css.add(css);
  return `<div class="aspect svelte-1sqfmr5" style="${"padding-top:" + escape(aspectRatio * 100, true) + "%; background-color:" + escape(playerBgColor, true) + "; border-radius:" + escape(borderRadius, true)}"></div>`;
});
const VideoPlayer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let _width;
  let _height;
  let aspectRatio;
  let isClient = typeof window !== "undefined" ? true : false;
  let { width = 1920 } = $$props;
  let { height = 1080 } = $$props;
  let { poster = "" } = $$props;
  let { source = "" } = $$props;
  let { controlsHeight = "55px" } = $$props;
  let { trackHeight = "6px" } = $$props;
  let { thumbSize = "15px" } = $$props;
  let { centerIconSize = "60px" } = $$props;
  let { playerBgColor = "black" } = $$props;
  let { color = "#FF3E00" } = $$props;
  let { focusColor = "white" } = $$props;
  let { barsBgColor = "white" } = $$props;
  let { iconColor = "white" } = $$props;
  let { bufferedColor = "#FF9600" } = $$props;
  let { chunkBars = false } = $$props;
  let { borderRadius = "8px" } = $$props;
  let { loop = false } = $$props;
  let { skipSeconds = 5 } = $$props;
  let { controlsOnPause = true } = $$props;
  let { timeDisplay = false } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.poster === void 0 && $$bindings.poster && poster !== void 0)
    $$bindings.poster(poster);
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  if ($$props.controlsHeight === void 0 && $$bindings.controlsHeight && controlsHeight !== void 0)
    $$bindings.controlsHeight(controlsHeight);
  if ($$props.trackHeight === void 0 && $$bindings.trackHeight && trackHeight !== void 0)
    $$bindings.trackHeight(trackHeight);
  if ($$props.thumbSize === void 0 && $$bindings.thumbSize && thumbSize !== void 0)
    $$bindings.thumbSize(thumbSize);
  if ($$props.centerIconSize === void 0 && $$bindings.centerIconSize && centerIconSize !== void 0)
    $$bindings.centerIconSize(centerIconSize);
  if ($$props.playerBgColor === void 0 && $$bindings.playerBgColor && playerBgColor !== void 0)
    $$bindings.playerBgColor(playerBgColor);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.focusColor === void 0 && $$bindings.focusColor && focusColor !== void 0)
    $$bindings.focusColor(focusColor);
  if ($$props.barsBgColor === void 0 && $$bindings.barsBgColor && barsBgColor !== void 0)
    $$bindings.barsBgColor(barsBgColor);
  if ($$props.iconColor === void 0 && $$bindings.iconColor && iconColor !== void 0)
    $$bindings.iconColor(iconColor);
  if ($$props.bufferedColor === void 0 && $$bindings.bufferedColor && bufferedColor !== void 0)
    $$bindings.bufferedColor(bufferedColor);
  if ($$props.chunkBars === void 0 && $$bindings.chunkBars && chunkBars !== void 0)
    $$bindings.chunkBars(chunkBars);
  if ($$props.borderRadius === void 0 && $$bindings.borderRadius && borderRadius !== void 0)
    $$bindings.borderRadius(borderRadius);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0)
    $$bindings.loop(loop);
  if ($$props.skipSeconds === void 0 && $$bindings.skipSeconds && skipSeconds !== void 0)
    $$bindings.skipSeconds(skipSeconds);
  if ($$props.controlsOnPause === void 0 && $$bindings.controlsOnPause && controlsOnPause !== void 0)
    $$bindings.controlsOnPause(controlsOnPause);
  if ($$props.timeDisplay === void 0 && $$bindings.timeDisplay && timeDisplay !== void 0)
    $$bindings.timeDisplay(timeDisplay);
  _width = parseInt(width);
  _height = parseInt(height);
  aspectRatio = _height / _width;
  return `${isClient ? `${validate_component(VideoPlayerClient, "VideoPlayerClient").$$render(
    $$result,
    {
      width,
      height,
      poster,
      source,
      controlsHeight,
      trackHeight,
      thumbSize,
      centerIconSize,
      playerBgColor,
      color,
      focusColor,
      barsBgColor,
      iconColor,
      bufferedColor,
      chunkBars,
      borderRadius,
      loop,
      skipSeconds,
      aspectRatio,
      controlsOnPause,
      timeDisplay
    },
    {},
    {}
  )}` : `${validate_component(VideoPlayerServer, "VideoPlayerServer").$$render($$result, { playerBgColor, borderRadius, aspectRatio }, {}, {})}`}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isOpen = false;
  let playUrl = "";
  let inputUrl = "https://sveltejs.github.io/assets/caminandes-llamigos.mp4";
  let player;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Container, "Container").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Row, "Row").$$render($$result, { class: "mt-2" }, {}, {
          default: () => {
            return `<h1>Welcome to the Player page</h1>`;
          }
        })}
	${validate_component(Row, "Row").$$render($$result, { class: "mt-2" }, {}, {
          default: () => {
            return `${validate_component(Form, "Form").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Col, "Col").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
                              default: () => {
                                return `${validate_component(Label, "Label").$$render($$result, { for: "url" }, {}, {
                                  default: () => {
                                    return `Enter URL`;
                                  }
                                })}
							${validate_component(Input, "Input").$$render(
                                  $$result,
                                  {
                                    type: "text",
                                    name: "url",
                                    value: inputUrl
                                  },
                                  {
                                    value: ($$value) => {
                                      inputUrl = $$value;
                                      $$settled = false;
                                    }
                                  },
                                  {}
                                )}`;
                              }
                            })}
						${validate_component(ButtonToolbar, "ButtonToolbar").$$render($$result, {}, {}, {
                              default: () => {
                                return `${validate_component(Button$1, "Button").$$render(
                                  $$result,
                                  {
                                    type: "submit",
                                    color: "success",
                                    class: "mr-2"
                                  },
                                  {},
                                  {
                                    default: () => {
                                      return `Play`;
                                    }
                                  }
                                )}`;
                              }
                            })}`;
                          }
                        })}
					${validate_component(Col, "Col").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
                              default: () => {
                                return `${validate_component(Label, "Label").$$render($$result, { for: "ddmenu" }, {}, {
                                  default: () => {
                                    return `or select one from the list of`;
                                  }
                                })}
							${function(__value) {
                                  if (is_promise(__value)) {
                                    __value.then(null, noop);
                                    return `
								${validate_component(Spinner$1, "Spinner").$$render($$result, { size: "lg", color: "primary" }, {}, {})}
							`;
                                  }
                                  return function(videos) {
                                    return `
								${validate_component(Dropdown, "Dropdown").$$render($$result, { isOpen, toggle: () => isOpen = !isOpen }, {}, {
                                      default: () => {
                                        return `${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, { caret: true }, {}, {
                                          default: () => {
                                            return `Available MP4s`;
                                          }
                                        })}
									${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, {}, {}, {
                                          default: () => {
                                            return `${each(videos, (v) => {
                                              return `${validate_component(DropdownItem, "DropdownItem").$$render($$result, {}, {}, {
                                                default: () => {
                                                  return `${escape(v.name)}
											`;
                                                }
                                              })}`;
                                            })}`;
                                          }
                                        })}`;
                                      }
                                    })}
							`;
                                  }(__value);
                                }(data.videos)}`;
                              }
                            })}`;
                          }
                        })}`;
                      }
                    })}`;
                  }
                })}`;
              }
            })}`;
          }
        })}
	${validate_component(Row, "Row").$$render($$result, { class: "mt-3" }, {}, {
          default: () => {
            return `${validate_component(Col, "Col").$$render($$result, {}, {}, {
              default: () => {
                return `<p>If your implementation of range byte requests works, you should be able to stream MP4 from
				your server.
			</p>
			<p>Currently playing <tt>${escape(playUrl)}</tt></p>
			<div style="max-width: 800px; margin: 0 auto;"${add_attribute("this", player, 0)}>${validate_component(VideoPlayer, "VideoPlayer").$$render($$result, { source: playUrl }, {}, {})}</div>`;
              }
            })}`;
          }
        })}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
