import { action, makeObservable, observable, computed } from "mobx";
import { extractSiteInfo } from "../pickup/pickup";
import { useTransformers } from '../pickup/transform';

export class stateStore {
    constructor() {
        makeObservable(this, {
            curHoverElement: observable,
            curActiveElement: observable,
            usedTransformers: observable,
            siteInformation: observable,

            setCurHoverElement: action,
            setCurActiveElement: action,
            unuseTransformer: action,
            useTransformer: action,
            init: action,

            // isTransformerUsed: computed,
            noTransformerUsed: computed,
            curActiveGenData: computed,
        })
    }

    // current hover element
    curHoverElement = null

    // selected tip pannel, current active element
    curActiveElement = null

    // current used transformers
    usedTransformers = []

    // supported 
    supportedTransformers = []

    // site information
    siteInformation = null

    setCurHoverElement(e) {
        this.curHoverElement = e
    }

    setCurActiveElement(e) {
        // TODO: store
        this.curActiveElement = e
        this.usedTransformers.clear()

        if (e) {
            // generate all supported transformers
            this.supportedTransformers = useTransformers(e.target);
            // add first one
            this.useTransformer(this.supportedTransformers[0])
        }
    }

    get curActiveGenData() {
        return this.curActiveElement ?
            this.curActiveElement.genData(this.usedTransformers) :
            []
    }

    get noTransformerUsed() {
        return this.usedTransformers.length === 0
    }

    isTransformerUsed (tr, key) {
        for (let i = 0; i < this.usedTransformers.length; i++ ) {
            const [ xtr, xkey ] = this.usedTransformers[i]
            if (xtr.name === tr.name && key === xkey) return true
        }
        return false
    }

    // use index to filter
    unuseTransformer(idx) {
        this.usedTransformers.splice(idx, 1)
    }

    useTransformer(tr, key) {
        // [tr, ...args]
        if (!this.isTransformerUsed(tr, key)) this.usedTransformers.push([tr, key])
    }

    init() {
        // extract informat from page
        let info = extractSiteInfo()
        if (info) {
            // change the icon url to original one
            // or to disable the cache
            if (" | ".indexOf(info.title||'') > 0) info.title = info.title.split(" | ").slice(1).join()
        }
        this.siteInformation = info
        console.log('===>', info)
    }
}

export default new stateStore();