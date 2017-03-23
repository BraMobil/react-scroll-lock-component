import React, { Component, PropTypes } from 'react';

class ScrollLock extends Component {
    static propTypes = {
        className: PropTypes.string,
        enabled: PropTypes.bool
    }
    static defaultProps = {
        className: '',
        enabled: true
    }
    constructor(props) {
        super(props);
        this.listenToWheelEvent = this.listenToWheelEvent.bind(this);
        this.stopListeningToWheelEvent = this.stopListeningToWheelEvent.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.setScrollingElement = this.setScrollingElement.bind(this);
        this.cancelScrollEvent = this.cancelScrollEvent.bind(this);
    }

    componentDidMount() {
        if (this.props.enabled) {
            this.listenToWheelEvent();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.enabled !== nextProps.enabled) {
            const fn = nextProps.enabled ? this.listenToWheelEvent : this.stopListeningToWheelEvent;
            fn();
        }
    }

    componentWillUnmount() {
        this.stopListeningToWheelEvent();
    }

    onScrollHandler(e) {
        const elem = this.scrollingElement;
        const { scrollTop, scrollHeight, clientHeight } = elem;
        const wheelDelta = e.deltaY;
        const isDeltaPositive = wheelDelta > 0;

        let shouldCancelScroll = false;
        if (isDeltaPositive && wheelDelta > scrollHeight - clientHeight - scrollTop) {
            elem.scrollTop = scrollHeight;
            shouldCancelScroll = true;
        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0;
            shouldCancelScroll = true;
        }

        if (shouldCancelScroll) {
            this.cancelScrollEvent(e);
        }
    }

    setScrollingElement(r) {
        this.scrollingElement = r && r.firstChild;
    }

    cancelScrollEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    }

    listenToWheelEvent() {
        this.scrollingElement.addEventListener('wheel', this.onScrollHandler, false);
    }

    stopListeningToWheelEvent() {
        this.scrollingElement.removeEventListener('wheel', this.onScrollHandler, false);
    }

    render() {
        return (
            <div className={this.props.className} ref={this.setScrollingElement}>
                {this.props.children}
            </div>
        );
    }
}

export default ScrollLock;
