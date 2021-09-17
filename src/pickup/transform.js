
// transformer turn element to value

// factory to convert a transformer
const must = (t, name) => {
    switch (typeof t) {
    case 'function':
        return {
            name: name || t.name,
            fn: t,
            // no when for match all
        }
    case 'object':
        // TODO: Array.is
        if (Array.isArray(t)) return
        if (!t.fn) return
        t.name = name || t.name || t.fn.name
        return t
    }
}

const html = (e) => e && e.innerHTML

const text = (e) => e && e.innerText

const attr = (e, k) => e && e.getAttribute(k)

const image = {
    // todo: add more
    fn: (e) => e && e.src,
    when: {
        tag: "img",
        match: (e) => e.src && true
    }
}

const link = {
    fn: (e) => e && e.href,
    when: {
        tag: "a",
        match: (e) => e.href
    }
}

// textarea
const input = {
    fn: (e) => e && e.value,
    when: {
        tag: 'input',
        match: (e) => e.value
    }
}

// ordered
export const transformers = [
    // special case
    must(image, 'image'),
    must(input, 'input'),
    must(link, 'link'),

    // common
    must(text, 'text'),
    must(html, 'html'),
    must(attr, 'attr'),
].filter((i) => i)

export const useTransformers = (e) => {
    return transformers.filter((t) => {
        return !e || !t.when ||
            (t.when.tag === e.tagName.toLowerCase() &&
            (!t.when.match || t.when.match(e)))
    })
}