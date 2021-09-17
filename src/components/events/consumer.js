import React from 'react'
import PropTypes from 'prop-types'
import { Consumer } from './context'

const EventConsumer = ({ children }) => {
    return <Consumer>{EventBus => children(EventBus)}</Consumer>
}

EventConsumer.propTypes = {
    children: PropTypes.func.isRequired
}

export default EventConsumer