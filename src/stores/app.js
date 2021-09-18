// app storage
import { observable, action, computed, makeObservable } from 'mobx'
import devProxy from "../proxy/dev/client"

export class AppStore {
    constructor() {
        this.proxy = devProxy;

        makeObservable(this, {
            loading: observable,
            target: observable, colorScheme: observable, visible: observable,
            enableRender: observable,
            selectorType: observable,

            apps: computed,

            init: action, start: action, toggle: action,
            setColorScheme: action,
            changeRenderMode: action,
            setSelectorType: action,
        })
    }

    // state ===== state

    // main search bar is loading
    loading = false

    // state ===== state

    // config ===== config

    // current target host
    target = "" // TODO: init from cookie
    // color schema
    colorScheme = "teal"
    // dashboard open or hide
    visible = true
    // dashboard size
    dashboardSize = "30rem"
    // enableRender
    enableRender = true
    // selectorType
    selectorType = 'css'

    // config ===== config

    get apps() {
        // FIXME:
        return Array.from(this.appsRegistry.values())
    }

    init() {
        // get target from cookie
        // load config and data from localstorage
    }

    start(url, options) {
        // start the target to handle pickup
        // TODO: push to the history and store
        // this.loading = true
        this.proxy.start(url, options)
        
    }

    toggle() {
        // TODO: store
        this.visible = !this.visible
    }

    setColorScheme(c) {
        // TODO: store
        this.colorScheme = c
    }

    changeRenderMode() {
        this.enableRender = !this.enableRender
    }

    setSelectorType(t) {
        this.selectorType = t
    }

    setDashboardSize(e) {
        this.dashboardSize = e
    }
}

export default new AppStore()