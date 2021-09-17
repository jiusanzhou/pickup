import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './utils/serviceWorker'

import App from "./App"
import { clientHook } from './proxy/dev/client'

// install the ui
const installUI = () => {
    // create the container for react to load
    const containerId = "__pickup-ui"
    const _containerDiv = document.createElement("div")
    _containerDiv.id = containerId
    document.body.appendChild(_containerDiv)

    // start the react main ui
    ReactDOM.render(<App />, document.getElementById(containerId))
}

// when dom is loaded in dev mode
// otherwise normal way
if (process.env.NODE_ENV !== "production") {
    window.addEventListener('DOMContentLoaded', installUI);

    // hooks the client
    if (location.path !== "/") clientHook()
} else {
    installUI();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
