import * as hook from '../../hooks/hook.js'
import xhook from "xhook"

// proxy provider devServer with webpack
// - inject javascript by webpack and devServer
// - can't handle out site request

class DevProxy {

    constructor() {}


    _targetCookieKey = "--proxy-target"
    _indexPlaceHolder = "--index"

    _origin = null

    // get origin 
    origin() {
        if (!this._origin) {
            document.cookie.split(";").forEach((i) => {
                let [key, value] = i.trim().split("=")
                if (key === this._targetCookieKey) {
                    this._origin = value;
                }
            })
        }
        return this._origin
    }

    start(url, options = {}) {
        let { cookies = {}, replace = true } = options;

        // try to handle the request, with special cookies
        // store the target in cookie, and start to reload page
        // NOTE: we must to normalize the url with --index
        const _url = new URL(url);
        let _path = _url.pathname;
        if (_path === "/") _path = `/${this._indexPlaceHolder}`;

        // store the target in cookie
        cookies[this._targetCookieKey] = _url.origin;

        // if cookies
        document.cookie = `${Object.keys(cookies).map(key => key+"="+cookies[key]).join("; ")}`;

        // reload the page
        if (replace) {
            location.pathname = _path;
        } else {
            open(_path);
        }
    }
}

let _proxyOrigin = null
let _proxyTargetKey = "--proxy-target"

const {
    apply,
    construct,
} = Reflect

const clientHook = () => {
    _proxyOrigin = location.origin

    // http request hook

    // hook AJAX API
    xhook.before((request) => {
        if (request.url.startsWith("http")) {
            let url = new URL(request.url)
            if (url.origin !== _proxyOrigin) {
                request.headers[_proxyTargetKey] = url.origin
                request.url = _proxyOrigin + request.url.slice(url.origin.length)
            }
        }
    })

    xhook.after(function(request, response) {
        console.log("xhr hooked [response] ====>", response);
    });


    // hook.func(global, 'fetch', oldFn => function(v) {
    //     if (v) {
    //         if (v.url) {
    //             // v is Request
    //             // const newUrl = urlx.encUrlStrAbs(v.url)
    //             // arguments[0] = new Request(newUrl, v)
    //         } else {
    //             // v is string
    //             // arguments[0] = urlx.encUrlStrRel(v, v)
    //         }
    //     }

    //     return apply(oldFn, this, arguments).then((r) => {
    //         console.log("fetch ====>", r)
    //         return r
    //     })
    // })

    hook.func(global, 'WebSocket', oldFn => function(url) {
        console.log("ws ====>", url)
        // const urlObj = urlx.newUrl(url)
        // if (urlObj) {
        //   const {ori} = env.get(this)
        //   if (ori) {
        //     const args = {
        //       'origin': ori.origin,
        //     }
        //     arguments[0] = route.genWsUrl(urlObj, args)
        //   }
        // }
        return construct(oldFn, arguments)
    })
}

export {
    clientHook
}

export default new DevProxy();