import React, { useCallback } from 'react';

export default class Resizer extends React.Component {


    _cursors = {
        x: 'col-resize',
        y: 'row-resize',
        xy: 'all-resize',
    }

    _curPoint = {
        x: 0, y: 0,
    }

    _sizeChanged = {
        x: 0, y: 0,
        width: 0, height: 0,
    }

    componentWillUnmount() {
        this._removeListeners()
    }

    _removeListeners() {
        window.removeEventListener('mouseup', this._mouseUp)
        window.removeEventListener('mousemove', this._mouseMove)
    }

    _mouseDown = (e) => {
        e.preventDefault();

        this.props.onResizeStart && this.props.onResizeStart(e)

        // register callback
        window.addEventListener('mouseup', this._mouseUp)
        window.addEventListener('mousemove', this._mouseMove)

        // current pointer
        this._curPoint.x = e.clientX
        this._curPoint.y = e.clientY
    
        // change set to 0
        this._sizeChanged.x = 0
        this._sizeChanged.y = 0

        // set target size
        if (this.props.target) {
            const rect = this.props.target.current.getBoundingClientRect()
            this._sizeChanged.width = rect.width
            this._sizeChanged.height = rect.height

            // clean transition
            this.props.target.current.style.transition = "none"
        }
    }

    _mouseUp = (e) => {
        e.preventDefault();

        this.props.onResizeEnd && this.props.onResizeEnd(this._sizeChanged)
        this._removeListeners()

        // recovery the transition
        if (this.props.target) this.props.target.current.style.transition = ""
    }

    _mouseMove = (e) => {
        e.preventDefault();

        let x = 0, y = 0
        // x
        if (this.props.direction.indexOf('x')>=0) {
            x = this._curPoint.x - e.clientX
        }

        // y
        if (this.props.direction.indexOf('y')>=0) {
            y = this._curPoint.y - e.clientY
        }

        // store the new pointer after moved
        this._curPoint.x = e.clientX
        this._curPoint.y = e.clientY

        // set the changed size
        this._sizeChanged.x += x
        this._sizeChanged.y += y

        // set the target size
        this._sizeChanged.width += x
        this._sizeChanged.height += y

        // callback
        this._updateStyle(x, y)
        this.props.onResize && this.props.onResize({x, y})
    }

    _updateStyle(x, y) {
        // set ref's size?
        if (!this.props.target) return
    
        if (x) this.props.target.current.style.width = `${this._sizeChanged.width}px`
        if (y) this.props.target.current.style.height = `${this._sizeChanged.height}px`
    }

    componentDidMount() {

    }

    render() {
        return React.cloneElement(this.props.children, {
            cursor: this._cursors[this.props.direction],
            onMouseDown: this._mouseDown,
        })
    }
}
