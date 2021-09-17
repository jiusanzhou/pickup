import getCssSelector from 'css-selector-generator';
import genCss from './css-selector';
import { cssToXPath } from "potent-tools";
import { getAllParents } from "./dom"

const config = {
  prefix: '__pickup__',
  state: {
    HOVER: 'hover',
    PICKED: 'picked',
    LINKED: 'linked',
  },
  keys: {
    id: 'id',
    pid: 'pid',
    state: 'state',
    broids: 'broids',
    css: 'css',
    xpath: 'xpath',
  },
  modes: {
    VIEW: 'view',
    PICKOUTER: 'pick_outter',
    PICKINNER: 'pick_inner',
  },
  withPrefix: key => config.prefix + key,
};

const extractSiteInfo = () => {
  let theme = document.head.querySelector("meta[name='theme-color']")
  let icon = document.head.querySelector('link[rel="shortcut icon"]')
  let desc = document.head.querySelector("meta[name='description']")
  let cont = document.head.querySelector("meta[http-equiv='Content-Type']")

  let path = document.location.pathname
  if (path === "/--index") path = '/'

  return {
      path: path, // how to replace with the proxy
      title: document.title,
      theme: theme && theme.getAttribute("content"),
      icon: icon && icon.getAttribute("href"),
      description: desc && desc.getAttribute("content") || '',
      contentType: cont && cont.getAttribute("content") || '',
  }
}

class PickupTarget {
  constructor(instance, evt) {
    this._instance = instance;

    // target element
    this.target = evt.target || e.srcElement;

    // get parent(pickup)
    let parent = this._instance._getParent(this.target, evt.path);
    // gen the css
    let css = this._instance._getCss(this.target, parent, evt.path);
    // get siblings
    let siblings = this._instance._getSiblings(this.target, parent, css);

    this.css = css;
    this.parent = parent;
    this.siblings = siblings;

    // generater xpath from css
    this.xpath = cssToXPath(this.css);
  }

  hovered() {
    // set style
    this._instance._stateApply(this.target, this._instance.STATES.hover);

    // set style for siblings
    this.siblings.forEach(sibe => {
      this._instance._stateApply(sibe, this._instance.STATES.hover);
    });

    // TODO: set style of parent's siblings's children
  }

  unhovered() {
    // remove style
    this._instance._stateApply(this.target, null, this._instance.STATES.hover);

    // remove style for siblings
    this.siblings.forEach(sibe => {
      this._instance._stateApply(sibe, null, this._instance.STATES.hover);
    });

    // TODO: set style of parent's siblings's children
  }

  picked() {
    // set style to picked
    this._instance._stateApply(this.target, this._instance.STATES.picked);

    // set style for siblings
    this.siblings.forEach(sibe => {
      this._instance._stateApply(
        sibe,
        this._instance.STATES.linked,
        this._instance.STATES.hover
      );
    });
  }

  unpicked() {
    // remove style
    this._instance._stateApply(this.target, null, this._instance.STATES.picked);

    // remove style for siblings
    this.siblings.forEach(sibe => {
      this._instance._stateApply(sibe, null, this._instance.STATES.linked);
    });
  }

  // remove dom from document
  remove() {
    this.unpicked();
    this.target.remove();
  }

  // generate data with trans
  genData(trans = [], selfOnly = false) {
    // take data from target
    return [this.target, ...this.siblings].map((ele) => this._extract(ele, trans))
  }

  _extract(ele, trans = []) {
    
    const data = {}

    trans.forEach(([tr, key]) => data[tr.name+(key?`-${key}`:'')] = tr.fn(ele, key))
    // TODO: if len > 1 ???
    if (trans.length === 1) {
      return Object.values(data)[0]
    }

    return data
  }
}

// Pickup is the tool to handle html elements
class Pickup {
  constructor() {}

  PREFIX = '__pickup__';

  STATES = {
    hover: 'hover',
    picked: 'picked',
    linked: 'linked',
  };

  KEYS = {
    id: 'id',
    pid: 'pid',
    state: 'state',
    broids: 'broids',
    css: 'css',
    xpath: 'xpath',
    // TODO: request id and selector
  };

  // except element
  _execptElements = [];

  // shoudl use css cache
  cacheCss = true;

  // eventor to omit event and data
  eventor = null;

  callbackFns = {};

  // generate key with prefix
  _key = k => `${this.PREFIX}${k}`;
  // get the value store in the element
  // TODO: from cache and muti supported
  _getValue = (e, k) => e.getAttribute(this._key(k)) || null;
  _setValue = (e, k, v) => e.setAttribute(this._key(k), v);
  _removeKey = (e, k) => e.removeAttribute(this._key(k));

  // cache to store element

  // get attr of element

  // TODO: use state machine:
  // null -> hover -> picked
  //               -> null
  // null -> linked -> null
  // null -> picked -> null
  _stateApply(ele, target, source) {
    // only state flow, the other logic not check here

    // get current state first
    const cur = this._getValue(ele, this.KEYS.state);

    // alreally and source not match
    if (cur === target || (source && source !== cur)) return;

    // filter to mock the state flow
    switch (target) {
      case null:
        // delete directly
        this._removeKey(ele, this.KEYS.state);
        return;
      case this.STATES.hover:
        // with any state can't to hover
        if (cur !== null) return;
        break;
      case this.STATES.linked:
        // picked state can't to linked
        if (cur === this.STATES.picked) return;
        break;
      case this.STATES.picked:
        // must hover state can be picked
        if (cur !== this.STATES.hover) return;
        break;
    }

    // apply the state change
    this._setValue(ele, this.KEYS.state, target);

    // TODO: notify the state change
  }

  _filter(e) {
    // ignore _execptElements

    let target = e.target || e.srcElement;

    // firefox don't has path prop
    if (!e.path) e.path = [e.target, ...getAllParents(target, null)]

    for (let i = 0; i < this._execptElements.length; i++) {
      if (e.path && e.path.includes(this._execptElements[i])) return true;
    }

    // ignore the body
    return !target || target.localName === 'body';
  }

  // get pickup parent element, not original parent element
  // which has picked or linked
  // directly: return only parent
  _getParent(e, directly = false) {
    let parent = e.parentElement;
    while (parent != null) {
      const state = this._getValue(parent, this.KEYS.state);
      // directlly picked and linked by others
      if (
        state === this.STATES.picked ||
        (!directly && state === this.STATES.linked)
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    // must need document
    return document;
  }

  // get siblings elements which has be picked
  _getSiblings(e, parent, css) {
    if (!parent || !css) return [];

    // ignore document
    if (e.nodeName === '#document') return [];

    let brs = Array.from(parent.querySelectorAll(css)).filter(x => x !== e);

    return brs;
  }

  // gen css of target, and short with parent
  // we must use event's path to generate css
  _getCss(e, parent, paths) {
    // first try to get from attr which stored
    let css = this._getValue(e, this.KEYS.css);
    if (css) return css;

    // basic get from element('s paths) directly
    // only for what use
    // get the full css which root is document
    css = genCss(e, null, paths);
    // store the css to element, disbale for debug
    if (this.cacheCss && css) this._setValue(e, this.KEYS.css, css);

    // cut the root css
    // return the short one
    if (parent) {
      // TODO: why not use _getCss
      let pcss = this._getValue(e, parent, this.KEYS.css);
      if (pcss && css.indexOf(pcss) === 0) {
        css = css.slice(pcss.length + 3);
      }
    }

    // try to shortten

    return css;
  }

  // why we use directly call function
  _callback(name, o) {
    this.callbackFns[name] && this.callbackFns[name](o);
  }

  _onmouseover(e) {
    if (this._filter(e)) return;

    const target = new PickupTarget(this, e);
    target.hovered();

    this._callback('onmouseover', target);
  }

  _onmouseout(e) {
    if (this._filter(e)) return;

    const target = new PickupTarget(this, e);
    target.unhovered();

    this._callback('onmouseout', target);
  }

  _onclick(e) {
    if (this._filter(e)) return;

    const target = new PickupTarget(this, e);

    this._callback('onclick', target);

    // must return false to stop the click event bubbling
    // some <a> with click bind, can't disable well
    // should use css pointer-event: none
    return false;
  }

  // listen the dom changed, if add node, we need to auto change the state

  enable(ok = true) {
    // enable event handle true or false
    document.onmouseover = ok ? e => this._onmouseover(e) : null;
    document.onmouseout = ok ? e => this._onmouseout(e) : null;
    document.onclick = ok ? e => this._onclick(e) : null;
  }

  // initialize the pickup instance
  init({
    exceptElements = ['#__pickup-ui', '.chakra-portal', '#chakra-toast-portal'],
    cacheCss = false, // dev mode, don't cache css
    onmouseover,
    onmouseout,
    onclick,
  } = {}) {
    this._execptElements = []
      .concat(
        ...exceptElements.map(i => Array.from(document.querySelectorAll(i)))
      )
      .filter(i => i);

    this.cacheCss = cacheCss;

    this.callbackFns = {
      onmouseover,
      onmouseout,
      onclick,
    };

    // after disable event handler
    this.enable(true);
  }
}

export { Pickup, extractSiteInfo };

export default new Pickup();
