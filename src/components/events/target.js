export class EventTarget {

    // store the handlers
    handlers = {}

    // register a event with handler
    $on(id, fn, replace=true) {
        console.log("[event] [on]", id)
        let hdls = this.handlers[id]
        hdls = hdls || []
        if (replace) { hdls = [fn] } else { hdls.push(fn) }

        this.handlers[id] = hdls
        // TODO: handle with *
    }

    // TODO: remove handler

    // emmit call a function with event name
    $emit(id, ...args) {
        console.log("[event] [emit]", id)
        if (!(id in this.handlers)) {
            // set time with delay?
            console.log("               unregister event handler:", id)
            return
        }

        const stack = this.handlers[id].slice();
        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i](...args)
        }
    
        // TODO: handle with *
    }
}

export default new EventTarget()