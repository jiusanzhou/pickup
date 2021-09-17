import { getAllParents, getRootNode } from "./dom"

// can be only one

const cssIdSelector = (ele) => {
    // not start with number id
    if (!ele.id || /^\d/.test(ele.id)) return;
    return "#" + ele.id
}

const cssClassSelector = (ele) => {
    let clls = Array.from(ele.classList).filter(i=>i)
    if (clls.length === 0) return;
    // todo: handle more, shoudl return list
    return [""].concat(clls[0]).join('.')
}

// must be only one should care about the parent

const cssNthChildSelector = (ele) => {
    const parent = ele.parentNode
    if (!parent) return;
    const siblings = Array.from(parent.childNodes).filter((e) => e)
    const idx = siblings.indexOf(ele)
    // must be parent
    return `:nth-child(${idx})`
}

const cssNthOfTypeSelector = (ele) => {
    const parent = ele.parentNode
    if (!parent) return;

    const tag = e.localName

    const siblings = Array
      .from(parentElement.children)
      .filter((element) => element.tagName.toLowerCase() === tag)

    const idx = siblings.indexOf(ele)
    if (idx < 0) return;

    // must with tag
    return `${tag}:nth-of-type(${idx + 1})`
}

const tryToShortenSelector =(ele) => {

}

// temporaty metod to generate the correct selector
const genCssTemp = (ele, root = null, paths = null, onlyOne = false) => {
    if (!root) root = getRootNode(ele)
    if (!paths) paths = getAllParents(ele, root)

    let stack = []
    for (let i = 0; i < paths.length - 4 ; i++) {
        const e = paths[i];

        const tag = e.localName

        // id first, match must break
        const ids = cssIdSelector(e)
        if (ids) {
            // combine tag
            stack.push(tag + ids)
            break
        }

        // all class
        const cls = cssClassSelector(e)
        if (cls) {
            // combine tag
            stack.push(tag + cls)
            continue
        }

        // if not only just return tag
        if (!onlyOne) {
            stack.push(tag)
            continue
        }

        // if only one, use nth-child and nth-type-of
        // const nthchild = cssNthChildSelector(e)
        // stack.push(nthchild)

        const nthoftype = cssNthOfTypeSelector(e)
        if (nthoftype) {
            stack.push(nthoftype)
            continue
        }

        const nthchild = cssNthChildSelector(e)
        if (nthchild) {
            stack.push(nthchild)
            continue
        }

        // can not be here
    }

    // must reverse the order, root first
    stack.reverse()

    // TODO: some special case can just use " " to skip some node
    return stack.join(' > ')
}

const genCss = genCssTemp


export default genCss