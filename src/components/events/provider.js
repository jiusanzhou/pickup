import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from './context'
import { EventTarget } from './target'

class EventProvider extends Component {
    render() {
        const { children } = this.props
        const eventTarget = new EventTarget() // TODO: with global one?
        return <Provider value={eventTarget}>{children}</Provider>
    }
}

EventProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
}

export default EventProvider