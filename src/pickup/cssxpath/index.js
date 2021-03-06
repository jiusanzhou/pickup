const patterns = require('./patterns');

function specialSelectorToXPathPiece(element, normalizeSpace) {
  switch (element.specialSelectorType) {
    case '#': // ID
      return `[@id='${element.specialSelectorValue}']`;
    case '.': // class
      return !normalizeSpace
        ? `[contains(@class, '${element.specialSelectorValue}')]`
        : `[contains(concat(' ',normalize-space(@class),' '), ' ${element.specialSelectorValue} ')]`;
    default:
      throw new Error(
        `Invalid special selector type: ${element.specialSelectorType}.`
      );
  }
}

function cssXPath(rule, normalizeSpace) {
  let index = 1;
  const parts = ['//', '*'];
  let lastRule = null;

  while (rule.length && rule !== lastRule) {
    lastRule = rule;

    // Trim leading whitespace
    rule = rule.trim(rule); // TODO: wtf?
    if (!rule.length) break;

    // Match the element identifier, matches rules of the form "body", ".class" and "#id"
    const element = patterns.element(rule);
    if (element) {
      if (element.specialSelectorType) {
        parts.push(specialSelectorToXPathPiece(element, normalizeSpace));
      } else if (element.namespace) {
        // TODO: can we change these to just be parts.push and put everything in a elementToXPathPiece function?
        // probably not, as they're replacing the // rule, initially. If not, leave documentation comment here.
        parts[index] = element.namespace;
      } else {
        parts[index] = element.elementName;
      }

      rule = rule.substr(element.fullGroup.length);
    }

    // Match attribute selectors
    const attribute = patterns.attributeValue(rule);
    if (attribute) {
      // matched a rule like [field~='thing'] or [name='Title']
      if (attribute.isContains) {
        parts.push(`[contains(@${attribute.field}, '${attribute.value}')]`);
      } else {
        parts.push(`[@${attribute.field}='${attribute.value}']`);
      }

      rule = rule.substr(attribute.fullGroup.length);
    } else {
      // matches rules like [mustExist], e.g., [disabled].
      const attributePresence = patterns.attributePresence(rule);
      if (attributePresence) {
        parts.push(`[@${attributePresence.attributeName}]`);

        rule = rule.substr(attributePresence.fullGroup.length);
      }
    }

    // Skip over pseudo-classes and pseudo-elements, which are of no use to us
    // e.g., :nth-child and :visited.
    let pseudoGroups = patterns.pseudo(rule);
    while (pseudoGroups) {
      rule = rule.substr(pseudoGroups.fullGroup.length);

      // if there are many, just skip them all right now.
      pseudoGroups = patterns.pseudo(rule);
    }

    // Match combinators, e.g. html > body or html + body.
    const combinator = patterns.combinator(rule);
    if (combinator && combinator.fullGroup.length) {
      if (combinator.fullGroup.indexOf('>') !== -1) {
        parts.push('/');
      } else if (combinator.fullGroup.indexOf('+') !== -1) {
        parts.push('/following-sibling::');
      } else {
        parts.push('//');
      }

      index = parts.length;
      parts.push('*');
      rule = rule.substr(combinator.fullGroup.length);
    }

    // Match comma delimited disjunctions ("or" rules), e.g., html, body
    const disjunction = patterns.comma(rule);
    if (disjunction) {
      parts.push(' | ', '//', '*');
      index = parts.length - 1;
      rule = rule.substr(disjunction.fullGroup.length);
    }
  }

  const xPath = parts.join('');
  return xPath;
}

module.exports = cssXPath;
