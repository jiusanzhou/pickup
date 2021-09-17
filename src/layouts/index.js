import React from 'react';
import { Helmet } from 'react-helmet'

import empty from './empty';
import _default from './default';

import settings from '../utils/settings';

// multi layout
const _layouts = {
  empty,
  default: _default,
};

export default ({ layout = 'empty', title = settings.title, ...props }) => {
  // if layout is string create with or { name }
  let name;
  let _props = {};
  switch (typeof layout) {
    case 'string':
      name = layout
      _props = { ...props }
      break;
    case 'object':
      name = layout.name
      _props = { ...layout, ...props, name: null }
      break;
    default:
      break;
  }

  // create children in here???
  return <>
    {title&&<Helmet>
      <title>{title}</title>
    </Helmet>}
    {React.createElement(_layouts[name] || empty, _props)}
  </>
};
