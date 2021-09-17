


// get siblings: should uppter to parent's siblings (which x,y is near x,y and without siblings)

// order: id, class, nth-child, attr, null
// implement with selector
const genCssOfSingle = (ele) => {
  let tagName = ele.tagName.toLowerCase();
}

const getIntersection = (items = []) => {
    const [firstItem = [], ...otherItems] = items
    if (otherItems.length === 0) {
      return firstItem
    }
    return (otherItems).reduce((accumulator, currentValue) => {
      return accumulator.filter((item) => currentValue.includes(item))
    }, firstItem)
}

const getAllCommonParents = (eles, root) => {
    return getIntersection(eles.map((e) => getAllParents(e, root||getRootNode(eles[0]))))
}

const getAllParents = (ele, root) => {
  const rs = []
  let parent = ele && ele.parentElement
  while (parent != null && (parent !== root)) {
      rs.push(parent)
      parent = parent.parentElement
  }
  return rs
}

const getRootNode = (ele) => ele && ele.ownerDocument.querySelector(":root")


const observeDOM = (obj, callback) => {
  if( !obj || obj. nodeType !== 1 ) return; 

  const MutationObserver = window. MutationObserver || window.WebKitMutationObserver;

  if( MutationObserver ){
      // define a new observer
      const mutationObserver = new MutationObserver(callback)
      // have the observer observe foo for changes in children
      mutationObserver.observe( obj, { childList: true, subtree: true })
      return mutationObserver
  } else if( window. addEventListener ){
      // browser support fallback
      obj. addEventListener('DOMNodeInserted', callback, false)
      obj. addEventListener('DOMNodeRemoved', callback, false)
  }
}

export {
  getAllParents, getRootNode
}