import React, { Component } from 'react'
import EventConsumer from './consumer'

function withEvents(WrappedComponent) {
    class WithEvents extends Component {
        render() {
            return (
                <EventConsumer>
                    {EventBus => <WrappedComponent events={EventBus} {...this.props} />}
                </EventConsumer>
            )
        }
    }

    return WithEvents
}

export default withEvents